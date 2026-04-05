// components/feed/FeedList.tsx
"use client";

import { useState, useTransition } from "react";
import { PostCard } from "./PostCard";
import { getFeedPosts } from "@/actions/feed.actions";
import type { PostWithDetails } from "@/types";

interface FeedListProps {
  initialPosts: PostWithDetails[];
  initialCursor: string | null;
  initialHasMore: boolean;
  currentUserId: string;
  currentUserImage?: string | null;
}

export function FeedList({
  initialPosts,
  initialCursor,
  initialHasMore,
  currentUserId,
  currentUserImage,
}: FeedListProps) {
  const [posts, setPosts] = useState<PostWithDetails[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  function loadMore() {
    if (!cursor) return;
    startTransition(async () => {
      try {
        const result = await getFeedPosts(cursor);
        setPosts((prev) => [...prev, ...result.posts]);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } catch (err) {
        console.error("Failed to load more posts:", err);
      }
    });
  }

  if (posts.length === 0) {
    return (
      <div
        className="_b_radious6 _feed_inner_area"
        style={{ padding: 48, textAlign: "center", color: "#666" }}
      >
        <p style={{ fontSize: 18, marginBottom: 8 }}>No posts yet</p>
        <p style={{ fontSize: 14 }}>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          currentUserImage={currentUserImage}
        />
      ))}

      {hasMore && (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <button
            onClick={loadMore}
            disabled={isPending}
            style={{
              background: "#377DFF",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "Loading..." : "Load more posts"}
          </button>
        </div>
      )}
    </>
  );
}