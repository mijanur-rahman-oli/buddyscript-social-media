// app/not-found.tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 96, fontWeight: 800, margin: 0, lineHeight: 1, color: "#377DFF" }}>
        404
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: "16px 0 12px" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--muted-color)", marginBottom: 32, maxWidth: 380 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/feed"
        style={{
          background: "#377DFF",
          color: "#fff",
          textDecoration: "none",
          borderRadius: 10,
          padding: "12px 28px",
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Back to Feed
      </Link>
    </div>
  );
}