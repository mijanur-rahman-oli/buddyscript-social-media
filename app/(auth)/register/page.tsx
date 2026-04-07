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
      <div className="_social_login_left_logo">
        <img src="/assets/images/logo.svg" alt="BuddyScript" className="_left_logo" />
      </div>

      {/* Welcome Text */}
      <p className="_social_login_content_para">Get Started Now</p>
      <h4 className="_social_login_content_title">Create your account</h4>

      {/* Google Sign Up */}
      <button type="button" className="_social_login_content_btn">
        <img src="/assets/images/google.svg" alt="Google" className="_google_img" />
        <span>Register with google</span>
      </button>

      {/* Divider */}
      <div className="_social_login_content_bottom_txt">
        <span>Or</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="_auth_error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* First Name & Last Name Row */}
        <div className="row" style={{ marginBottom: 14 }}>
          <div className="col-6">
            <div className="_social_login_form_input">
              <label className="_social_login_label" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                disabled={isPending}
                placeholder="John"
                className="_social_login_input"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="_social_login_form_input">
              <label className="_social_login_label" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                disabled={isPending}
                placeholder="Doe"
                className="_social_login_input"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="_social_login_form_input">
          <label className="_social_login_label" htmlFor="email">
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
            className="_social_login_input"
          />
        </div>

        {/* Password */}
        <div className="_social_login_form_input">
          <label className="_social_login_label" htmlFor="password">
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
            className="_social_login_input"
          />
        </div>

        {/* Confirm Password */}
        <div className="_social_login_form_input">
          <label className="_social_login_label" htmlFor="confirmPassword">
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
            className="_social_login_input"
          />
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="_social_login_form_check" style={{ marginTop: 14 }}>
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
            className="_social_login_form_check_input"
          />
          <label htmlFor="terms" className="_social_login_form_check_label">
            I agree to terms & conditions
          </label>
        </div>

        {/* Submit Button */}
        <div className="_social_login_form_btn">
          <button
            type="submit"
            className="_social_login_form_btn_link"
            disabled={isPending || !agreeTerms}
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="_social_login_bottom_txt">
        <p className="_social_login_bottom_txt_para">
          Already have an account?{" "}
          <Link href="/login">Sign In</Link>
        </p>
      </div>
    </>
  );
}