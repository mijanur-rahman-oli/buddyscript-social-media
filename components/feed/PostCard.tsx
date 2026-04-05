// components/feed/PostCard.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toggleLike, deletePost, getPostLikes } from "@/actions/feed.actions";
import { CommentSection } from "./CommentSection";
import type { PostWithDetails } from "@/types";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  return new Date(date).toLocaleDateString();
}

interface PostCardProps {
  post: PostWithDetails;
  currentUserId: string;
  currentUserImage?: string | null;
}

export function PostCard({ post: initialPost, currentUserId, currentUserImage }: PostCardProps) {
  const [post, setPost] = useState(initialPost);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState<Array<{ id: string; firstName: string; lastName: string; image: string | null }>>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = post.author.id === currentUserId;
  const isLiked = post.likes.some((l) => l.userId === currentUserId);
  const likeCount = post._count.likes;

  // Get unique reaction images based on actual likes (max 3)
  const reactionImages = [
    "/assets/images/react_img1.png",
    "/assets/images/react_img2.png", 
    "/assets/images/react_img3.png",
    "/assets/images/react_img4.png",
    "/assets/images/react_img5.png",
  ].slice(0, Math.min(likeCount, 5));

  const handleLike = () => {
    startTransition(async () => {
      const result = await toggleLike(post.id);
      setPost((prev) => ({
        ...prev,
        likes: result.liked
          ? [...prev.likes, { userId: currentUserId }]
          : prev.likes.filter((like) => like.userId !== currentUserId),
        _count: { ...prev._count, likes: result.count },
      }));
    });
  };

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setIsDeleting(true);
    try {
      await deletePost(post.id);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setIsDeleting(false);
    }
  }

  async function handleShowLikes() {
    setShowLikesModal(true);
    setIsLoadingLikes(true);
    try {
      const likes = await getPostLikes(post.id);
      setLikesList(likes);
    } catch (err) {
      console.error("Failed to load likes:", err);
    } finally {
      setIsLoadingLikes(false);
    }
  }

  if (isDeleting) return null;

  return (
    <>
      <div className="_feed_inner_timeline_post_area _b_radious6 _feed_inner_area _mar_b16" style={{ padding: "24px 0" }}>
        <div className="_feed_inner_timeline_content" style={{ padding: "0 24px" }}>
          {/* Post header */}
          <div className="_feed_inner_timeline_post_top" style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div className="_feed_inner_timeline_post_box" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="_feed_inner_timeline_post_box_image">
                <Link href={`/profile/${post.author.id}`}>
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="_post_img"
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="_post_img" style={{
                      width: 44, height: 44, borderRadius: "50%", background: "#377DFF",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: 16,
                    }}>
                      {post.author.firstName[0]}
                    </div>
                  )}
                </Link>
              </div>
              <div className="_feed_inner_timeline_post_box_txt">
                <Link href={`/profile/${post.author.id}`}>
                  <h4 className="_feed_inner_timeline_post_box_title" style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                    {post.author.firstName} {post.author.lastName}
                  </h4>
                </Link>
                <p className="_feed_inner_timeline_post_box_para" style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>
                  {formatRelativeTime(post.createdAt)} .{" "}
                  <a href="#" style={{ color: "var(--bs-accent)", textDecoration: "none" }}>
                    {post.visibility === "PUBLIC" ? "Public" : "Private"}
                  </a>
                </p>
              </div>
            </div>

            <div className="_feed_inner_timeline_post_box_dropdown">
              <div className="_feed_timeline_post_dropdown" style={{ position: "relative" }}>
                <button
                  className="_feed_timeline_post_dropdown_link"
                  onClick={() => setDropdownOpen((p) => !p)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="_feed_timeline_dropdown _timeline_dropdown" style={{
                    position: "absolute", right: 0, top: "100%", width: 200,
                    background: "var(--bs-bg-card)", border: "1px solid var(--bs-border)",
                    borderRadius: 10, boxShadow: "var(--bs-shadow-md)", zIndex: 50, padding: 6
                  }}>
                    <ul className="_feed_timeline_dropdown_list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      <li className="_feed_timeline_dropdown_item">
                        <button className="_feed_timeline_dropdown_link" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, borderRadius: 6 }}>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                              <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"/>
                            </svg>
                          </span>
                          Save Post
                        </button>
                      </li>
                      {isOwner && (
                        <li className="_feed_timeline_dropdown_item">
                          <button
                            onClick={handleDelete}
                            className="_feed_timeline_dropdown_link"
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, borderRadius: 6 }}
                          >
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"/>
                              </svg>
                            </span>
                            Delete Post
                          </button>
                        </li>
                      )}
                      <li className="_feed_timeline_dropdown_item">
                        <button className="_feed_timeline_dropdown_link" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, borderRadius: 6 }}>
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                              <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"/>
                            </svg>
                          </span>
                          Hide
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post content */}
          {post.text && <h4 className="_feed_inner_timeline_post_title" style={{ marginBottom: 12, fontWeight: 500 }}>{post.text}</h4>}
          
          {post.imagePath && (
            <div className="_feed_inner_timeline_image" style={{ marginTop: 12, borderRadius: 10, overflow: "hidden" }}>
              <img src={post.imagePath} alt="Post" className="_time_img" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          )}
        </div>

        {/* Reaction counts - Dynamic based on actual likes */}
        <div className="_feed_inner_timeline_total_reacts" style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px", borderTop: "1px solid var(--bs-border)", borderBottom: "1px solid var(--bs-border)", marginTop: 16 }}>
          <div className="_feed_inner_timeline_total_reacts_image" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {likeCount > 0 && reactionImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt="Reaction" 
                className={idx === 0 ? "_react_img1" : "_react_img"} 
                style={{ 
                  width: 20, height: 20, borderRadius: "50%", 
                  border: "2px solid var(--bs-bg-card)",
                  marginLeft: idx > 0 ? -4 : 0
                }} 
              />
            ))}
            {likeCount > 0 && (
              <button
                onClick={handleShowLikes}
                className="_feed_inner_timeline_total_reacts_para"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--bs-text-muted)", marginLeft: 4 }}
              >
                {likeCount}+
              </button>
            )}
          </div>
          <div className="_feed_inner_timeline_total_reacts_txt" style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => setShowComments(!showComments)}
              className="_feed_inner_timeline_total_reacts_para1"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--bs-text-secondary)" }}
            >
              <span style={{ fontWeight: 700, color: "var(--bs-text-primary)" }}>{post._count.comments}</span> Comment{post._count.comments !== 1 ? "s" : ""}
            </button>
            <p className="_feed_inner_timeline_total_reacts_para2" style={{ fontSize: 12, color: "var(--bs-text-secondary)", margin: 0 }}>
              <span style={{ fontWeight: 700, color: "var(--bs-text-primary)" }}>0</span> Share
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="_feed_inner_timeline_reaction" style={{ display: "flex", gap: 4, padding: "4px 24px" }}>
          <button
            onClick={handleLike}
            className={`_feed_reaction ${isLiked ? "_feed_reaction_active" : ""}`}
            style={{
              flex: 1, display: "flex", justifyContent: "center", alignItems: "center",
              background: "none", border: "none", borderRadius: 8, padding: 8, cursor: "pointer",
              gap: 6
            }}
          >
            <span className="_feed_inner_timeline_reaction_link" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: isLiked ? "var(--bs-accent)" : "var(--bs-text-secondary)" }}>
              {isLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                  <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"/>
                  <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                  <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"/>
                  <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                  <circle cx="9.5" cy="9.5" r="9" stroke="#666" strokeWidth="1"/>
                  <path fill="#666" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"/>
                </svg>
              )}
              {isLiked ? "Liked" : "Like"}
            </span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="_feed_inner_timeline_reaction_comment _feed_reaction"
            style={{
              flex: 1, display: "flex", justifyContent: "center", alignItems: "center",
              background: "none", border: "none", borderRadius: 8, padding: 8, cursor: "pointer"
            }}
          >
            <span className="_feed_inner_timeline_reaction_link" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--bs-text-secondary)" }}>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="currentColor" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
              </svg>
              Comment
            </span>
          </button>

          <button className="_feed_inner_timeline_reaction_share _feed_reaction" style={{
            flex: 1, display: "flex", justifyContent: "center", alignItems: "center",
            background: "none", border: "none", borderRadius: 8, padding: 8, cursor: "pointer"
          }}>
            <span className="_feed_inner_timeline_reaction_link" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--bs-text-secondary)" }}>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="currentColor" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
              </svg>
              Share
            </span>
          </button>
        </div>

        {/* Comments Section - Toggle visibility */}
        {showComments && (
          <CommentSection
            postId={post.id}
            initialComments={post.comments}
            currentUserId={currentUserId}
            currentUserImage={currentUserImage}
          />
        )}
      </div>

      {/* Likes Modal */}
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