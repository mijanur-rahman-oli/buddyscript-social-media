// components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile top header */}
      <div className="_header_mobile_menu" style={{ background: "var(--bs-bg-secondary)", borderBottom: "1px solid var(--bs-border)", padding: "12px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="_header_mobile_menu_logo">
                  <Link href="/feed">
                    <img src="/assets/images/logo.svg" alt="BuddyScript" style={{ height: "32px" }} />
                  </Link>
                </div>
                <div className="_header_mobile_menu_right">
                  <form className="_header_form_grp" role="search" style={{ margin: 0, padding: "6px 12px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                      <circle cx="7" cy="7" r="6" stroke="#666" />
                      <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                    </svg>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="_mobile_navigation_bottom_wrapper" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "var(--bs-bg-card)", borderTop: "1px solid var(--bs-border)", padding: "8px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul style={{ display: "flex", justifyContent: "space-around", alignItems: "center", listStyle: "none", padding: 0, margin: 0 }}>
                {/* Home */}
                <li>
                  <Link
                    href="/feed"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: isActive("/feed") ? "var(--bs-accent)" : "var(--bs-text-secondary)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 27">
                      <path fill="currentColor" fillOpacity=".6" stroke="currentColor" strokeWidth="1.5" d="M1 13.042c0-2.094 0-3.141.431-4.061.432-.92 1.242-1.602 2.862-2.965l1.571-1.321C8.792 2.232 10.256 1 12 1c1.744 0 3.208 1.232 6.136 3.695l1.572 1.321c1.62 1.363 2.43 2.044 2.86 2.965.432.92.432 1.967.432 4.06v6.54c0 2.908 0 4.362-.92 5.265-.921.904-2.403.904-5.366.904H7.286c-2.963 0-4.445 0-5.365-.904C1 23.944 1 22.49 1 19.581v-6.54z" />
                    </svg>
                  </Link>
                </li>

                {/* Friends */}
                <li>
                  <Link
                    href="/friend-request"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: isActive("/friend-request") ? "var(--bs-accent)" : "var(--bs-text-secondary)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 27 20">
                      <path fill="currentColor" fillOpacity=".6" fillRule="evenodd" d="M13.334 12.405h.138l.31.001c2.364.015 7.768.247 7.768 3.81 0 3.538-5.215 3.769-7.732 3.784h-.932c-2.364-.015-7.77-.247-7.77-3.805 0-3.543 5.405-3.774 7.77-3.789l.31-.001h.138zm9.742-2.27c2.967.432 3.59 1.787 3.59 2.849 0 .648-.261 1.83-2.013 2.48a.919.919 0 01-.858-.575.886.886 0 01.531-1.153c.83-.307.83-.647.83-.81 0-.522-.682-.886-2.027-1.082a.9.9 0 01-.772-1.017c.074-.488.54-.814 1.046-.75zm-18.439.75a.9.9 0 01-.773 1.017c-1.345.196-2.027.56-2.027 1.082 0 .163 0 .501.832.81a.886.886 0 01-.858 1.153.953.953 0 01-.327-.058C.262 16.6 0 15.418 0 14.77c0-1.06.623-2.417 3.592-2.85.506-.061.97.263 1.045.751zM13.334 0c3.086 0 5.596 2.442 5.596 5.442 0 3.001-2.51 5.443-5.596 5.443H13.3a5.616 5.616 0 01-3.943-1.603A5.308 5.308 0 017.74 5.439C7.739 2.442 10.249 0 13.334 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </li>

                {/* Notifications */}
                <li style={{ position: "relative" }}>
                  <Link
                    href="/notifications"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "var(--bs-text-secondary)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 25 27">
                      <path fill="currentColor" fillOpacity=".6" fillRule="evenodd" d="M10.17 23.46c.671.709 1.534 1.098 2.43 1.098.9 0 1.767-.39 2.44-1.099.36-.377.976-.407 1.374-.067.4.34.432.923.073 1.3-1.049 1.101-2.428 1.708-3.886 1.708h-.003c-1.454-.001-2.831-.608-3.875-1.71a.885.885 0 01.072-1.298 1.01 1.01 0 011.374.068zM12.663 0c5.768 0 9.642 4.251 9.642 8.22 0 2.043.549 2.909 1.131 3.827.576.906 1.229 1.935 1.229 3.88-.453 4.97-5.935 5.375-12.002 5.375-6.067 0-11.55-.405-11.998-5.296-.004-2.024.649-3.053 1.225-3.959l.203-.324c.501-.814.928-1.7.928-3.502C3.022 4.25 6.897 0 12.664 0z" clipRule="evenodd" />
                    </svg>
                    <span style={{ position: "absolute", top: -4, right: -8, background: "#ff4757", color: "#fff", fontSize: "10px", fontWeight: 700, minWidth: "16px", height: "16px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>6</span>
                  </Link>
                </li>

                {/* Chat */}
                <li style={{ position: "relative" }}>
                  <Link
                    href="/chat"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "var(--bs-text-secondary)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <path fill="currentColor" fillOpacity=".6" fillRule="evenodd" d="M12.002 0c3.208 0 6.223 1.239 8.487 3.489 4.681 4.648 4.681 12.211 0 16.86-2.294 2.28-5.384 3.486-8.514 3.486-1.706 0-3.423-.358-5.03-1.097-.474-.188-.917-.366-1.235-.366-.366.003-.859.171-1.335.334-.976.333-2.19.748-3.09-.142-.895-.89-.482-2.093-.149-3.061.164-.477.333-.97.333-1.342 0-.306-.149-.697-.376-1.259C-1 12.417-.032 7.011 3.516 3.49A11.96 11.96 0 0112.002 0z" clipRule="evenodd" />
                    </svg>
                    <span style={{ position: "absolute", top: -4, right: -8, background: "#ff4757", color: "#fff", fontSize: "10px", fontWeight: 700, minWidth: "16px", height: "16px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>2</span>
                  </Link>
                </li>

                {/* Menu */}
                <li>
                  <Link
                    href="/menu"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "var(--bs-text-secondary)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="none" viewBox="0 0 18 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M1 1h16M1 7h16M1 13h16" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}