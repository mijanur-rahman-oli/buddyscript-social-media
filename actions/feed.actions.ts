// actions/feed.actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { CommentWithReplies, FeedResult, PostWithDetails } from "@/types";

const POSTS_PER_PAGE = 10;

// ─── Recursive comment builder ────────────────────────────────────────────────
function buildCommentTree(
  comments: (CommentWithReplies & { parentId: string | null })[]
): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  // First pass: index all comments
  for (const comment of comments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

  // Second pass: build tree
  for (const comment of comments) {
    const node = commentMap.get(comment.id)!;
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// ─── getFeedPosts ─────────────────────────────────────────────────────────────
// Optimised for "millions of reads":
//  - cursor-based pagination (no OFFSET)
//  - targeted indexes on (visibility, createdAt DESC)
//  - single DB round-trip per page load
export async function getFeedPosts(cursor?: string): Promise<FeedResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const posts = await prisma.post.findMany({
    take: POSTS_PER_PAGE + 1, // fetch one extra to detect hasMore
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    where: {
      OR: [{ visibility: "PUBLIC" }, { authorId: userId }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      text: true,
      imagePath: true,
      visibility: true,
      createdAt: true,
      author: {
        select: { id: true, firstName: true, lastName: true, image: true },
      },
      // Only fetch top-level comments here; replies are nested below
      comments: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          text: true,
          createdAt: true,
          postId: true,
          parentId: true,
          author: {
            select: { id: true, firstName: true, lastName: true, image: true },
          },
          likes: { select: { userId: true } },
          _count: { select: { likes: true } },
        },
      },
      likes: { select: { userId: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  const hasMore = posts.length > POSTS_PER_PAGE;
  const trimmedPosts = hasMore ? posts.slice(0, POSTS_PER_PAGE) : posts;
  const nextCursor = hasMore ? trimmedPosts[trimmedPosts.length - 1].id : null;

  // Build nested comment trees on the server
  const postsWithTrees: PostWithDetails[] = trimmedPosts.map((post) => ({
    ...post,
    comments: buildCommentTree(post.comments as unknown as (CommentWithReplies & { parentId: string | null })[]),
  }));

  return {
    posts: postsWithTrees,
    nextCursor,
    hasMore,
  };
}

// ─── createPost ───────────────────────────────────────────────────────────────
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const text = formData.get("text") as string;
  const visibility = (formData.get("visibility") as string) === "PRIVATE"
    ? "PRIVATE"
    : "PUBLIC";

  if (!text?.trim()) throw new Error("Post text is required");

  await prisma.post.create({
    data: {
      text: text.trim(),
      visibility,
      authorId: session.user.id,
    },
  });

  revalidatePath("/feed");
}

// ─── toggleLike ───────────────────────────────────────────────────────────────
// Used by optimistic UI — returns the NEW like count
export async function toggleLike(
  postId: string
): Promise<{ liked: boolean; count: number }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
  }

  const count = await prisma.like.count({ where: { postId } });

  revalidatePath("/feed");
  return { liked: !existing, count };
}

// ─── addComment ───────────────────────────────────────────────────────────────
export async function addComment(
  postId: string,
  text: string,
  parentId?: string
): Promise<CommentWithReplies> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!text.trim()) throw new Error("Comment text is required");

  const comment = await prisma.comment.create({
    data: {
      text: text.trim(),
      authorId: session.user.id,
      postId,
      ...(parentId ? { parentId } : {}),
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      postId: true,
      parentId: true,
      author: {
        select: { id: true, firstName: true, lastName: true, image: true },
      },
      likes: { select: { userId: true } },
      _count: { select: { likes: true } },
    },
  });

  revalidatePath("/feed");
  return { ...comment, replies: [] };
}

// ─── deletePost ───────────────────────────────────────────────────────────────
export async function deletePost(postId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/feed");
}