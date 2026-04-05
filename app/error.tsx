// app/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Something went wrong
      </h1>
      <p style={{ color: "var(--muted-color)", marginBottom: 28, maxWidth: 420 }}>
        An unexpected error occurred. Our team has been notified.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          background: "#377DFF",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "12px 28px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Try again
      </button>
    </div>
  );
}