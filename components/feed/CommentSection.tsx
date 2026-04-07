"use client";

import { useState, useTransition, useOptimistic } from "react";
import { addComment, toggleCommentLike, getCommentLikes } from "@/actions/feed.actions";
import type { CommentWithReplies } from "@/types";
import Link from "next/link";

// ─── Helper for Relative Time ────────────────────────────────────────────────
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

// ─── Single Comment Node (Recursive) ─────────────────────────────────────────
function CommentNode({
  comment,
  postId,
  currentUserId,
  depth = 0,
}: {
  comment: CommentWithReplies;
  postId: string;
  currentUserId: string;
  depth?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState<Array<{ id: string; firstName: string; lastName: string; image: string | null }>>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  // Optimistic state for nested replies
  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    comment.replies,
    (state, newReply: CommentWithReplies) => [...state, newReply]
  );

  const [localComment, setLocalComment] = useState(comment);
  const isLiked = localComment.likes.some((like) => like.userId === currentUserId);

  const handleLike = () => {
    startTransition(async () => {
      const result = await toggleCommentLike(localComment.id);
      setLocalComment((prev) => ({
        ...prev,
        likes: result.liked
          ? [...prev.likes, { userId: currentUserId }]
          : prev.likes.filter((like) => like.userId !== currentUserId),
        _count: { ...prev._count, likes: result.count },
      }));
    });
  };

  const handleShowLikes = async () => {
    setShowLikesModal(true);
    setIsLoadingLikes(true);
    try {
      const likes = await getCommentLikes(localComment.id);
      setLikesList(likes);
    } catch (err) {
      console.error("Failed to load likes:", err);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Type-safe optimistic object (No updatedAt)
    const optimisticReply: CommentWithReplies = {
      id: `optimistic-${Date.now()}`,
      text: replyText,
      createdAt: new Date(),
      postId,
      parentId: comment.id,
      authorId: currentUserId,
      author: {
        id: currentUserId,
        firstName: "You",
        lastName: "",
        image: null,
      },
      replies: [],
      likes: [],
      _count: { likes: 0 },
    };

    const text = replyText;
    setReplyText("");
    setShowReply(false);

    startTransition(async () => {
      addOptimisticReply(optimisticReply);
      try {
        await addComment(postId, text, comment.id);
      } catch (err) {
        console.error("Failed to add reply:", err);
      }
    });
  }

  return (
    <>
      <div className="_comment_main" style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <div className="_comment_image">
          {localComment.author.image ? (
            <img
              src={localComment.author.image}
              alt={localComment.author.firstName}
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#377DFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 14 }}>
              {localComment.author.firstName[0]}
            </div>
          )}
        </div>

        <div className="_comment_area" style={{ flex: 1 }}>
          <div style={{ background: "var(--bs-input-bg)", borderRadius: 12, padding: "10px 14px" }}>
            <Link href={`/profile/${localComment.author.id}`} style={{ textDecoration: 'none' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: "var(--bs-text-primary)" }}>
                {localComment.author.firstName} {localComment.author.lastName}
              </h4>
            </Link>
            <p style={{ fontSize: 13, margin: 0, color: "var(--bs-text-secondary)" }}>{localComment.text}</p>
            
            <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
              <button onClick={handleLike} disabled={isPending} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {isLiked ? "❤️" : "🤍"}
              </button>
              {localComment._count.likes > 0 && (
                <button onClick={handleShowLikes} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--bs-text-muted)" }}>
                  {localComment._count.likes}
                </button>
              )}
              {depth < 3 && (
                <button onClick={() => setShowReply((p) => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--bs-text-muted)" }}>
                  Reply
                </button>
              )}
              <span style={{ fontSize: 11, color: "var(--bs-text-muted)" }}>
                {formatRelativeTime(localComment.createdAt)}
              </span>
            </div>
          </div>

          {showReply && (
            <form onSubmit={handleSubmitReply} style={{ marginTop: 8 }}>
              <textarea
                placeholder={`Reply to ${localComment.author.firstName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: "100%", background: "var(--bs-input-bg)", border: "1px solid var(--bs-border)", borderRadius: 20, padding: "8px 16px", fontSize: 13, resize: "none" }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply(e as any);
                  }
                }}
              />
            </form>
          )}

          {optimisticReplies.map((reply) => (
            <CommentNode key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId} depth={depth + 1} />
          ))}
        </div>
      </div>

      {showLikesModal && (
        <div onClick={() => setShowLikesModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bs-bg-card)", borderRadius: 16, width: "90%", maxWidth: 400, maxHeight: "80%", overflow: "auto", padding: 24 }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Liked by</h3>
                <button onClick={() => setShowLikesModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>×</button>
             </div>
            {isLoadingLikes ? <p>Loading...</p> : likesList.map(user => (
              <Link key={user.id} href={`/profile/${user.id}`} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, textDecoration: "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#377DFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  {user.image ? <img src={user.image} style={{width: '100%', borderRadius: '50%'}} /> : user.firstName[0]}
                </div>
                <span style={{ color: "var(--bs-text-primary)" }}>{user.firstName} {user.lastName}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Comment Section ─────────────────────────────────────────────────────
interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
  currentUserId: string;
  currentUserImage?: string | null;
}

export function CommentSection({ postId, initialComments, currentUserId, currentUserImage }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: CommentWithReplies) => [newComment, ...state]
  );

  const visibleComments = showAllComments ? optimisticComments : optimisticComments.slice(0, 1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentWithReplies = {
      id: `opt-${Date.now()}`,
      text: commentText,
      createdAt: new Date(),
      postId,
      parentId: null,
      authorId: currentUserId,
      author: { id: currentUserId, firstName: "You", lastName: "", image: currentUserImage ?? null },
      replies: [],
      likes: [],
      _count: { likes: 0 },
    };

    const text = commentText;
    setCommentText("");
    startTransition(async () => {
      addOptimisticComment(newComment);
      try {
        await addComment(postId, text);
      } catch (err) {
        console.error("Comment failed:", err);
      }
    });
  }

  return (
    <div className="_comment_section_container" style={{ padding: "0 24px", marginTop: 8 }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isPending}
          rows={1}
          style={{ width: "100%", background: "var(--bs-input-bg)", border: "1px solid var(--bs-border)", borderRadius: 20, padding: "8px 16px", fontSize: 13, resize: "none" }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
        />
      </form>

      {optimisticComments.length > 1 && !showAllComments && (
        <button onClick={() => setShowAllComments(true)} style={{ background: "none", border: "none", color: "var(--bs-accent)", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 10 }}>
          View {optimisticComments.length - 1} more comments
        </button>
      )}

      {visibleComments.map((comment) => (
        <CommentNode key={comment.id} comment={comment} postId={postId} currentUserId={currentUserId} />
      ))}
    </div>
  );
}