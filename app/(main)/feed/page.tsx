// app/(main)/feed/page.tsx
import { auth } from "@/auth";
import { getFeedPosts } from "@/actions/feed.actions";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { FeedList } from "@/components/feed/FeedList";
import { StoryBar } from "@/components/feed/StoryBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Feed — BuddyScript" };
export const revalidate = 60;

function FeedSkeleton() {
  return (
    <>
      {[1, 2].map((i) => (
        <div key={i} className="_feed_inner_timeline_post_area _b_radious6 _mar_b16" style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bs-input-bg)", animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, width: "40%", background: "var(--bs-input-bg)", borderRadius: 6, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: 11, width: "25%", background: "var(--bs-input-bg)", borderRadius: 6, animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
          <div style={{ height: 200, background: "var(--bs-input-bg)", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      ))}
    </>
  );
}

async function FeedContent({ userId, userImage }: { userId: string; userImage: string | null }) {
  const { posts, nextCursor, hasMore } = await getFeedPosts();
  return (
    <FeedList
      initialPosts={posts}
      initialCursor={nextCursor}
      initialHasMore={hasMore}
      currentUserId={userId}
      currentUserImage={userImage}
    />
  );
}

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = session.user.id;
  const userImage = session.user.image ?? null;
  const userName = session.user.name ?? null;

  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap">
        <div className="row">
          {/* Left Sidebar - Hidden on mobile, visible on desktop */}
          <div className="col-xl-3 col-lg-3 d-none d-lg-block">
            <LeftSidebar />
          </div>
          
          {/* Middle Column - Feed content (appears FIRST on mobile) */}
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 order-1 order-lg-2">
            <div className="_layout_middle_wrap">
              <div className="_layout_middle_inner">
                <StoryBar />
                <CreatePostForm userImage={userImage} userName={userName} />
                <Suspense fallback={<FeedSkeleton />}>
                  <FeedContent userId={userId} userImage={userImage} />
                </Suspense>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Appears SECOND on mobile */}
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 order-2 order-lg-3">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}