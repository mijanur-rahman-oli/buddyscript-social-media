// app/(main)/profile/[userId]/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/feed/PostCard";
import type { Metadata } from "next";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true },
  });
  if (!user) return { title: "User not found — BuddyScript" };
  return { title: `${user.firstName} ${user.lastName} — BuddyScript` };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const currentUserId = session.user.id;
  const isOwnProfile = userId === currentUserId;

  const profileUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      image: true,
      createdAt: true,
      _count: { select: { posts: true, likes: true } },
    },
  });

  if (!profileUser) notFound();

  // Fetch posts: own profile sees all, others only see PUBLIC
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
      ...(isOwnProfile ? {} : { visibility: "PUBLIC" }),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      text: true,
      imagePath: true,
      visibility: true,
      createdAt: true,
      author: { select: { id: true, firstName: true, lastName: true, image: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true, text: true, createdAt: true, postId: true, parentId: true,
          author: { select: { id: true, firstName: true, lastName: true, image: true } },
          likes: { select: { userId: true } },
          _count: { select: { likes: true } },
        },
      },
      likes: { select: { userId: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  const joinedYear = new Date(profileUser.createdAt).getFullYear();

  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap">
        {/* Profile header */}
        <div
          className="_b_radious6 _feed_inner_area _mar_b16"
          style={{ padding: 0, overflow: "hidden" }}
        >
          {/* Cover photo */}
          <div
            style={{
              height: 220,
              background: "linear-gradient(135deg, #377DFF 0%, #6c63ff 100%)",
              position: "relative",
            }}
          />

          {/* Avatar + info */}
          <div style={{ padding: "0 32px 24px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: -48, marginBottom: 16 }}>
              {profileUser.image ? (
                <img
                  src={profileUser.image}
                  alt={`${profileUser.firstName} ${profileUser.lastName}`}
                  style={{
                    width: 96, height: 96, borderRadius: "50%",
                    border: "4px solid var(--card-bg)",
                    objectFit: "cover", flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96, height: 96, borderRadius: "50%",
                    border: "4px solid var(--card-bg)",
                    background: "#377DFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: 36,
                    flexShrink: 0,
                  }}
                >
                  {profileUser.firstName[0]}
                </div>
              )}

              <div style={{ flex: 1, paddingBottom: 4 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
                  {profileUser.firstName} {profileUser.lastName}
                </h1>
                <p style={{ color: "var(--muted-color)", fontSize: 14, margin: "4px 0 0" }}>
                  Member since {joinedYear}
                </p>
              </div>

              {!isOwnProfile && (
                <div style={{ display: "flex", gap: 10, paddingBottom: 4 }}>
                  <button
                    type="button"
                    className="_right_info_btn_link _right_info_btn_link_active"
                    style={{ padding: "8px 20px" }}
                  >
                    Follow
                  </button>
                  <button type="button" className="_right_info_btn_link" style={{ padding: "8px 20px" }}>
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { label: "Posts", value: profileUser._count.posts },
                { label: "Likes received", value: profileUser._count.likes },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 12, color: "var(--muted-color)", margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-md-12">
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
              {isOwnProfile ? "Your Posts" : "Posts"}
            </h2>

            {posts.length === 0 ? (
              <div
                className="_b_radious6 _feed_inner_area"
                style={{ padding: 48, textAlign: "center", color: "var(--muted-color)" }}
              >
                No posts yet.
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post as any}
                  currentUserId={currentUserId}
                  currentUserImage={session.user.image ?? null}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}