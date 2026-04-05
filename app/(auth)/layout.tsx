// app/(auth)/layout.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AuthImage from "./AuthImage";

export const metadata: Metadata = {
  title: "BuddyScript — Sign In",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user) redirect("/feed");

  return (
    <section style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center",
      background: "var(--bs-bg-primary)",
      position: "relative",
      padding: "20px"
    }}>
      {/* Background shapes */}
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}>
        <img src="/assets/images/shape1.svg" alt="" />
        <img src="/assets/images/dark_shape.svg" alt="" style={{ display: "var(--dark-display, none)" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0, zIndex: 0 }}>
        <img src="/assets/images/shape2.svg" alt="" />
        <img src="/assets/images/dark_shape1.svg" alt="" style={{ display: "var(--dark-display, none)" }} />
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0 }}>
        <img src="/assets/images/shape3.svg" alt="" />
        <img src="/assets/images/dark_shape2.svg" alt="" style={{ display: "var(--dark-display, none)" }} />
      </div>

      {/* Main content - Flex row for left and right sections */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        position: "relative",
        zIndex: 1,
        flexWrap: "wrap"
      }}>
        {/* Left side - Image (changes based on login/register) */}
        <div style={{ 
          flex: "1.5", 
          minWidth: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <AuthImage />
        </div>

        {/* Right side - Form */}
        <div style={{ 
          flex: "1", 
          minWidth: "380px",
          maxWidth: "480px"
        }}>
          <div style={{ 
            background: "var(--bs-bg-card)", 
            borderRadius: "16px", 
            padding: "40px",
            boxShadow: "var(--bs-shadow-md)",
            border: "1px solid var(--bs-border)"
          }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}