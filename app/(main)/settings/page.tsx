// app/(main)/settings/page.tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap" style={{ maxWidth: 680, margin: "0 auto" }}>
        <div className="_b_radious6 _feed_inner_area" style={{ padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32 }}>Settings</h1>

          {/* Appearance */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "var(--muted-color)", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 12 }}>
              Appearance
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Dark Mode</p>
                <p style={{ fontSize: 13, color: "var(--muted-color)", margin: "4px 0 0" }}>
                  Switch between light and dark themes
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  background: theme === "dark" ? "#377DFF" : "#ccc",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
                aria-checked={theme === "dark"}
                role="switch"
                aria-label="Toggle dark mode"
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: theme === "dark" ? 25 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          </section>

          {/* Account */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, color: "var(--muted-color)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Account
            </h2>
            {[
              { label: "Change Password", desc: "Update your account password" },
              { label: "Email Notifications", desc: "Manage notification preferences" },
              { label: "Privacy Settings", desc: "Control who can see your posts" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 13, color: "var(--muted-color)", margin: "4px 0 0" }}>{desc}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10">
                  <path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5" />
                </svg>
              </div>
            ))}
          </section>

          <button
            type="button"
            onClick={handleSave}
            style={{
              background: "#377DFF",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 32px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}