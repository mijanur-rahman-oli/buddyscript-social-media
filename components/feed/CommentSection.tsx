// components/feed/CommentSection.tsx
"use client";

import { useState, useTransition, useOptimistic } from "react";
import { addComment, toggleCommentLike, getCommentLikes } from "@/actions/feed.actions";
import type { CommentWithReplies } from "@/types";
import Link from "next/link";

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

// ─── Single Comment Node ───────────────────────────────────────────────────────
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

  const [replies, addOptimisticReply] = useOptimistic(
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

    const optimisticReply: CommentWithReplies = {
      id: `optimistic-${Date.now()}`,
      text: replyText,
      createdAt: new Date(),
      postId,
      parentId: comment.id,
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
              alt={`${localComment.author.firstName} ${localComment.author.lastName}`}
              className="_comment_img1"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div
              className="_comment_img1"
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#377DFF", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 14,
              }}
            >
              {localComment.author.firstName[0]}
            </div>
          )}
        </div>

        <div className="_comment_area" style={{ flex: 1 }}>
          <div className="_comment_details" style={{ background: "var(--bs-input-bg)", borderRadius: 12, padding: "10px 14px" }}>
            <div className="_comment_details_top">
              <div className="_comment_name">
                <Link href={`/profile/${localComment.author.id}`}>
                  <h4 className="_comment_name_title" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    {localComment.author.firstName} {localComment.author.lastName}
                  </h4>
                </Link>
              </div>
            </div>
            <div className="_comment_status">
              <p className="_comment_status_text" style={{ fontSize: 13, margin: 0 }}>
                {localComment.text}
              </p>
            </div>
            <div className="_total_reactions" style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <div className="_total_react">
                <button
                  onClick={handleLike}
                  disabled={isPending}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  {isLiked ? "❤️" : "🤍"}
                </button>
                {localComment._count.likes > 0 && (
                  <button
                    onClick={handleShowLikes}
                                    className="_total"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--bs-text-muted)" }}
                  >
                    {localComment._count.likes}
                  </button>
                )}
              </div>
              {depth < 3 && (
                <div className="_comment_reply">
                  <div className="_comment_reply_num">
                    <ul className="_comment_reply_list" style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
                      <li>
                        <button
                          onClick={() => setShowReply((p) => !p)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--bs-text-muted)" }}
                        >
                          Reply.
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <span className="_time_link" style={{ fontSize: 11, color: "var(--bs-text-muted)" }}>
                {formatRelativeTime(localComment.createdAt)}
              </span>
            </div>
          </div>

          {/* Reply input */}
          {showReply && (
            <form onSubmit={handleSubmitReply} style={{ marginTop: 8 }}>
              <div className="_feed_inner_comment_box_content" style={{ display: "flex", gap: 10 }}>
                <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder={`Reply to ${localComment.author.firstName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={1}
                    style={{
                      width: "100%",
                      background: "var(--bs-input-bg)",
                      border: "1px solid var(--bs-border)",
                      borderRadius: 20,
                      padding: "8px 16px",
                      fontSize: 13,
                      resize: "none",
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitReply(e as any);
                      }
                    }}
                  />
                </div>
              </div>
            </form>
          )}

          {/* Nested replies */}
          {replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>

      {/* Likes Modal for Comment */}
      {showLikesModal && (
        <div
          onClick={() => setShowLikesModal(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bs-bg-card)",
              borderRadius: 16,
              width: "90%",
              maxWidth: 400,
              maxHeight: "80%",
              overflow: "auto",
              padding: 24
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Liked by</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            {isLoadingLikes ? (
              <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>
            ) : likesList.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20 }}>No likes yet</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {likesList.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.id}`}
                    style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
                    onClick={() => setShowLikesModal(false)}
                  >
                    {user.image ? (
                      <img src={user.image} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#377DFF", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        {user.firstName[0]}
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--bs-text-primary)" }}>
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Comment Section ──────────────────────────────────────────────────────────
interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
  currentUserId: string;
  currentUserImage?: string | null;
}

export function CommentSection({
  postId,
  initialComments,
  currentUserId,
  currentUserImage,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [comments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newComment: CommentWithReplies) => [...state, newComment]
  );

  // Show only 1 comment by default, or all if toggled
  const visibleComments = showAllComments ? comments : comments.slice(0, 1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    const optimisticComment: CommentWithReplies = {
      id: `optimistic-${Date.now()}`,
      text: commentText,
      createdAt: new Date(),
      postId,
      parentId: null,
      author: {
        id: currentUserId,
        firstName: "You",
        lastName: "",
        image: currentUserImage ?? null,
      },
      replies: [],
      likes: [],
      _count: { likes: 0 },
    };

    const text = commentText;
    setCommentText("");

    startTransition(async () => {
      addOptimisticComment(optimisticComment);
      try {
        await addComment(postId, text);
      } catch (err) {
        console.error("Failed to add comment:", err);
      }
    });
  }

  return (
    <div className="_feed_inner_timeline_cooment_area" style={{ padding: "0 24px", marginTop: 8 }}>
      {/* Comment input */}
      <div className="_feed_inner_comment_box" style={{ marginBottom: 8 }}>
        <form onSubmit={handleSubmit}>
          <div className="_feed_inner_comment_box_content" style={{ display: "flex", gap: 10 }}>
            <div className="_feed_inner_comment_box_content_image">
              {currentUserImage ? (
                <img
                  src={currentUserImage}
                  alt="You"
                  className="_comment_img"
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div className="_comment_img" style={{
                  width: 32, height: 32, borderRadius: "50%", background: "#377DFF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 600, fontSize: 14,
                }}>Y</div>
              )}
            </div>
            <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isPending}
                rows={1}
                style={{
                  width: "100%",
                  background: "var(--bs-input-bg)",
                  border: "1px solid var(--bs-border)",
                  borderRadius: 20,
                  padding: "8px 16px",
                  fontSize: 13,
                  resize: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Comment list */}
      <div className="_timline_comment_main">
        {comments.length > 1 && !showAllComments && (
          <div className="_previous_comment" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => setShowAllComments(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--bs-accent)",
              }}
            >
              View {comments.length - 1} previous comment{comments.length - 1 !== 1 ? "s" : ""}
            </button>
          </div>
        )}

        {comments.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--bs-text-muted)", padding: "12px 0" }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          visibleComments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
            />
          ))
        )}

        {showAllComments && comments.length > 1 && (
          <div className="_previous_comment" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => setShowAllComments(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--bs-text-muted)",
              }}
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </div>
  );
}