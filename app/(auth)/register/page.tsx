// app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { register } from "@/actions/auth.actions";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError("Please agree to the terms & conditions");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    startTransition(async () => {
      const result = await register(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/login?registered=true");
      }
    });
  }

  return (
    <>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <img src="/assets/images/logo.svg" alt="BuddyScript" style={{ height: "36px" }} />
      </div>

      {/* Welcome Text */}
      <p style={{ fontSize: "13px", color: "var(--bs-text-muted)", textAlign: "center", marginBottom: "6px" }}>
        Get Started Now
      </p>
      <h4 style={{ fontSize: "20px", fontWeight: 700, color: "var(--bs-text-primary)", textAlign: "center", marginBottom: "28px" }}>
        Create your account
      </h4>

      {/* Google Sign Up */}
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
        <span>Register with google</span>
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* First Name & Last Name Row */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "12px", 
          marginBottom: "14px" 
        }}>
          {/* First Name */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              disabled={isPending}
              placeholder="John"
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

          {/* Last Name */}
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              disabled={isPending}
              placeholder="Doe"
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
        </div>

        {/* Email */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isPending}
            placeholder="you@example.com"
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
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            disabled={isPending}
            placeholder="Min. 6 characters"
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

        {/* Confirm Password */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "var(--bs-text-secondary)", marginBottom: "6px" }} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            disabled={isPending}
            placeholder="Repeat password"
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

        {/* Terms & Conditions Checkbox */}
        <div style={{ marginTop: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="terms" style={{ fontSize: "12px", color: "var(--bs-text-secondary)", cursor: "pointer" }}>
              I agree to terms & conditions
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "25px", marginBottom: "35px" }}>
          <button
            type="submit"
            disabled={isPending || !agreeTerms}
            style={{
              width: "100%",
              background: "var(--bs-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: (isPending || !agreeTerms) ? "not-allowed" : "pointer",
              opacity: (isPending || !agreeTerms) ? 0.7 : 1,
              transition: "background 0.15s"
            }}
            onMouseEnter={(e) => {
              if (!isPending && agreeTerms) e.currentTarget.style.background = "var(--bs-accent-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bs-accent)";
            }}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      {/* Sign In Link */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--bs-text-muted)", margin: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--bs-accent)", fontWeight: 600, textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}