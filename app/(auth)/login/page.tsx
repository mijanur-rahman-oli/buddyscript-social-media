// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { login } from "@/actions/auth.actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/assets/images/logo.svg" alt="BuddyScript" style={{ height: "36px" }} />
      </div>

      {/* Welcome Text */}
      <p style={{ fontSize: "13px", color: "var(--bs-text-muted)", textAlign: "center", marginBottom: "4px" }}>
        Welcome back
      </p>
      <h4 style={{ fontSize: "20px", fontWeight: 700, color: "var(--bs-text-primary)", textAlign: "center", marginBottom: "30px" }}>
        Login to your account
      </h4>

      {/* Google Sign In */}
      <button 
        type="button" 
        style={{ 
          width: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "8px",
          background: "var(--bs-input-bg)",
          border: "1px solid var(--bs-border)",
          borderRadius: "8px",
          padding: "10px",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--bs-text-primary)",
          cursor: "pointer",
          marginBottom: "25px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bs-border)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bs-input-bg)";
        }}
      >
        <img src="/assets/images/google.svg" alt="Google" style={{ width: "18px", height: "18px" }} />
        <span>Or sign-in with google</span>
      </button>

      {/* Divider */}
      <div style={{ 
        position: "relative", 
        textAlign: "center", 
        marginBottom: "25px" 
      }}>
        <span style={{ 
          background: "var(--bs-bg-card)", 
          padding: "0 10px", 
          fontSize: "12px", 
          color: "var(--bs-text-muted)",
          position: "relative",
          zIndex: 1
        }}>Or</span>
        <div style={{ 
          position: "absolute", 
          top: "50%", 
          left: 0, 
          right: 0, 
          height: "1px", 
          background: "var(--bs-border)", 
          zIndex: 0 
        }} />
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: "rgba(255,71,87,.1)", 
          border: "1px solid rgba(255,71,87,.3)", 
          borderRadius: "6px", 
          padding: "8px 12px", 
          fontSize: "12px", 
          color: "#ff4757", 
          marginBottom: "16px" 
        }}>
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="login_email">
            Email
          </label>
          <input
            id="login_email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isPending}
            style={{
              width: "100%",
              background: "var(--bs-input-bg)",
              border: "1px solid var(--bs-border)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "var(--bs-text-primary)",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--bs-accent)";
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(55,125,255,.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--bs-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="login_password">
            Password
          </label>
          <input
            id="login_password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            disabled={isPending}
            style={{
              width: "100%",
              background: "var(--bs-input-bg)",
              border: "1px solid var(--bs-border)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "var(--bs-text-primary)",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--bs-accent)";
              e.currentTarget.style.boxShadow = "0 0 0 2px rgba(55,125,255,.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--bs-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={() => setRemember(!remember)}
              style={{ width: "14px", height: "14px", cursor: "pointer" }}
            />
            <label htmlFor="remember" style={{ fontSize: "12px", color: "var(--bs-text-secondary)", cursor: "pointer" }}>
              Remember me
            </label>
          </div>
          <div>
            <Link href="/forgot-password" style={{ fontSize: "12px", color: "var(--bs-accent)", textDecoration: "none", fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "25px", marginBottom: "30px" }}>
          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              background: "var(--bs-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.7 : 1,
              transition: "background 0.15s"
            }}
            onMouseEnter={(e) => {
              if (!isPending) e.currentTarget.style.background = "var(--bs-accent-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bs-accent)";
            }}
          >
            {isPending ? "Signing in..." : "Login now"}
          </button>
        </div>
      </form>

      {/* Sign Up Link */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--bs-text-muted)", margin: 0 }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--bs-accent)", fontWeight: 600, textDecoration: "none" }}>
            Create New Account
          </Link>
        </p>
      </div>
    </>
  );
}