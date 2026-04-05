// app/(main)/find-friends/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Find Friends — BuddyScript" };

interface FindFriendsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function FindFriendsPage({ searchParams }: FindFriendsPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
      ...(query
        ? {
            OR: [
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      image: true,
      _count: { select: { posts: true } },
    },
    take: 24,
    orderBy: { firstName: "asc" },
  });

  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="_b_radious6 _feed_inner_area" style={{ padding: 32, marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Find Friends</h1>

          <form method="GET" style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 17 17"
              >
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search by name or email..."
                className="form-control _inpt1"
                style={{ paddingLeft: 40 }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: "#377DFF",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0 24px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>
        </div>

        {users.length === 0 ? (
          <div
            className="_b_radious6 _feed_inner_area"
            style={{ padding: 48, textAlign: "center", color: "var(--muted-color)" }}
          >
            {query ? `No users found for "${query}"` : "No users yet."}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {users.map((user) => (
              <div
                key={user.id}
                className="_b_radious6 _feed_inner_area"
                style={{ padding: 20, textAlign: "center" }}
              >
                <Link href={`/profile/${user.id}`}>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      style={{
                        width: 72, height: 72, borderRadius: "50%",
                        objectFit: "cover", marginBottom: 12,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "#377DFF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 28,
                        margin: "0 auto 12px",
                      }}
                    >
                      {user.firstName[0]}
                    </div>
                  )}
                  <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>
                    {user.firstName} {user.lastName}
                  </h4>
                </Link>
                <p style={{ fontSize: 13, color: "var(--muted-color)", marginBottom: 14 }}>
                  {user._count.posts} post{user._count.posts !== 1 ? "s" : ""}
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button type="button" className="_right_info_btn_link" style={{ fontSize: 13 }}>
                    Ignore
                  </button>
                  <button
                    type="button"
                    className="_right_info_btn_link _right_info_btn_link_active"
                    style={{ fontSize: 13 }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}