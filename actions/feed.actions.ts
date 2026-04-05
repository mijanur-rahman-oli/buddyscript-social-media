// actions/feed.actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import type { CommentWithReplies, FeedResult, PostWithDetails } from "@/types";

const POSTS_PER_PAGE = 10;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Recursive comment builder ────────────────────────────────────────────────
function buildCommentTree(
  comments: (CommentWithReplies & { parentId: string | null })[]
): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  for (const comment of comments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

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

// ─── Upload image to Cloudinary ───────────────────────────────────────────────
export async function uploadImage(formData: FormData): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("image") as File;
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "buddyscript/posts",
        transformation: [{ width: 1200, height: 1200, crop: "limit" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  return (result as any).secure_url;
}

// ─── createPost with image support ────────────────────────────────────────────
export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const text = formData.get("text") as string;
  const visibility = (formData.get("visibility") as string) === "PRIVATE" ? "PRIVATE" : "PUBLIC";
  const imageFile = formData.get("image") as File;

  if (!text?.trim() && !imageFile) throw new Error("Post text or image is required");

  let imagePath: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const imageFormData = new FormData();
    imageFormData.append("image", imageFile);
    imagePath = await uploadImage(imageFormData);
  }

  const post = await prisma.post.create({
    data: {
      text: text?.trim() || null,
      imagePath,
      visibility,
      authorId: session.user.id,
    },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, image: true },
      },
      _count: { select: { comments: true, likes: true } },
    },
  });

  revalidatePath("/feed");
  return { success: true, post };
}

// ─── getFeedPosts ─────────────────────────────────────────────────────────────
export async function getFeedPosts(cursor?: string): Promise<FeedResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const posts = await prisma.post.findMany({
    take: POSTS_PER_PAGE + 1,
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

  const postsWithTrees: PostWithDetails[] = trimmedPosts.map((post) => ({
    ...post,
    comments: buildCommentTree(post.comments as any),
  }));

  return {
    posts: postsWithTrees,
    nextCursor,
    hasMore,
  };
}

// ─── toggleLike - Returns updated state for instant UI update ─────────────────
export async function toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
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

// ─── toggleCommentLike - For comments and replies ─────────────────────────────
export async function toggleCommentLike(commentId: string): Promise<{ liked: boolean; count: number }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_commentId: { userId, commentId } },
    });
  } else {
    await prisma.like.create({
      data: { userId, commentId },
    });
  }

  const count = await prisma.like.count({ where: { commentId } });

  revalidatePath("/feed");
  return { liked: !existing, count };
}

// ─── addComment - Returns created comment for instant UI update ───────────────
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

// ─── getPostLikes - Get users who liked a post ────────────────────────────────
export async function getPostLikes(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const likes = await prisma.like.findMany({
    where: { postId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, image: true },
      },
    },
    take: 50,
  });

  return likes.map(like => like.user);
}

// ─── getCommentLikes - Get users who liked a comment ──────────────────────────
export async function getCommentLikes(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const likes = await prisma.like.findMany({
    where: { commentId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, image: true },
      },
    },
    take: 50,
  });

  return likes.map(like => like.user);
}