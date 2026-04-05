// app/(auth)/AuthImage.tsx
"use client";

import { usePathname } from "next/navigation";

export default function AuthImage() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const imageSrc = isLoginPage ? "/assets/images/login.png" : "/assets/images/registration.png";
  const altText = isLoginPage ? "Login Illustration" : "Registration Illustration";

  return (
    <img
      src={imageSrc}
      alt={altText}
      style={{ 
        width: "100%", 
        maxWidth: "500px", 
        height: "auto",
        display: "block"
      }}
    />
  );
}