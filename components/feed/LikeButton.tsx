// components/feed/LikeButton.tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/actions/feed.actions";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  currentUserId: string;
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  currentUserId,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, addOptimistic] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (state, action: "toggle") => {
      if (action === "toggle") {
        return {
          liked: !state.liked,
          count: state.liked ? state.count - 1 : state.count + 1,
        };
      }
      return state;
    }
  );

  function handleLike() {
    startTransition(async () => {
      addOptimistic("toggle");
      try {
        await toggleLike(postId);
      } catch (error) {
        // Optimistic update will revert automatically on error
        console.error("Failed to toggle like:", error);
      }
    });
  }

  return (
    <button
      className={`_feed_inner_timeline_reaction_emoji _feed_reaction${
        optimisticState.liked ? " _feed_reaction_active" : ""
      }`}
      onClick={handleLike}
      disabled={isPending}
      aria-label={optimisticState.liked ? "Unlike post" : "Like post"}
      aria-pressed={optimisticState.liked}
    >
      <span className="_feed_inner_timeline_reaction_link">
        <span>
          {optimisticState.liked ? (
            // Filled heart when liked
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
              <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
              <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
              <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
              <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
            </svg>
          ) : (
            // Outlined emoji when not liked
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
              <circle cx="9.5" cy="9.5" r="9" stroke="#ccc" strokeWidth="1"/>
              <path fill="#ccc" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
            </svg>
          )}
          {optimisticState.liked ? "Liked" : "Like"}
          {optimisticState.count > 0 && (
            <span style={{ marginLeft: 4, fontSize: 12, opacity: 0.7 }}>
              {optimisticState.count}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}