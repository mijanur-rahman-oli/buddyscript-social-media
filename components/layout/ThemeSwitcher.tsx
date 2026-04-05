// components/layout/ThemeSwitcher.tsx
"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="_layout_mode_swithing_btn"
      style={{
        position: "fixed",
        bottom: "80px",
        right: "24px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        width: 44, // fixed width — nothing can shift horizontally
      }}
    >
      <button
        type="button"
        className="_layout_swithing_btn_link"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        aria-pressed={isDark}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px",
          width: 44,        // fixed — never resizes on toggle
          boxSizing: "border-box",
          background: "var(--bs-accent)",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: "var(--bs-shadow-md)",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {/* Fixed 20×20 icon wrapper — both icons centred, no layout shift */}
        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
            </svg>
          )}
        </div>

        {/* Toggle track */}
        <div
          style={{
            width: 20,
            height: 36,
            flexShrink: 0,
            background: "rgba(255,255,255,.25)",
            borderRadius: 10,
            position: "relative",
            overflow: "hidden",  // clip the circle cleanly
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              background: "#fff",
              borderRadius: "50%",
              position: "absolute",
              left: 2,
              top: 2,  // always anchored to top
              transform: `translateY(${isDark ? 16 : 0}px)`,  // move via transform only
              transition: "transform 0.2s ease",
              willChange: "transform",  // hint browser to composite this layer
            }}
          />
        </div>
      </button>

      {/* Label — fixed width matches button, text centred, never reflowes */}
      <span
        style={{
          display: "block",
          width: 44,           // same fixed width as button
          textAlign: "center",
          fontSize: 10,
          fontWeight: 500,
          color: "var(--bs-text-primary)",
          background: "var(--bs-bg-card)",
          padding: "2px 0",
          borderRadius: 12,
          border: "1px solid var(--bs-border)",
          boxSizing: "border-box",
        }}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </div>
  );
}