// app/(main)/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    id: session.user.id,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  };

  return (
    <div className="_layout _layout_main_wrapper">
      <ThemeSwitcher />
      <div className="_main_layout">
        {/* Desktop Navbar - hide on mobile */}
        <div className="d-none d-lg-block">
          <Navbar user={user} />
        </div>
        {/* Mobile Nav - show only on mobile */}
        <div className="d-lg-none">
          <MobileNav />
        </div>
        {children}
      </div>
    </div>
  );
}