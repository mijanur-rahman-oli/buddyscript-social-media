// components/layout/LeftSidebar.tsx
import Link from "next/link";

const exploreItems = [
  {
    href: "/learning",
    label: "Learning",
    badge: "New",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21zm-1.233 4.65l.104.01c.188.028.443.113.668.203 1.026.398 3.033 1.746 3.8 2.563l.223.239.08.092a1.16 1.16 0 01.025 1.405c-.04.053-.086.105-.19.215l-.269.28c-.812.794-2.57 1.971-3.569 2.391-.277.117-.675.25-.865.253a1.167 1.167 0 01-1.07-.629c-.053-.104-.12-.353-.171-.586l-.051-.262c-.093-.57-.143-1.437-.142-2.347l.001-.288c.01-.858.063-1.64.157-2.147.037-.207.12-.563.167-.678.104-.25.291-.45.523-.575a1.15 1.15 0 01.58-.14z" />
      </svg>
    ),
  },
  {
    href: "/insights",
    label: "Insights",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972zm-7.924 7.63c-.323 0-.59.263-.632.604l-.006.094v6.382c0 .385.285.697.638.697.323 0 .59-.262.632-.603l.006-.094v-6.382c0-.385-.286-.697-.638-.697zm3.97-3.053c-.323 0-.59.262-.632.603l-.006.095v9.435c0 .385.285.697.638.697.323 0 .59-.262.632-.603l.006-.094V7.274c0-.386-.286-.698-.638-.698zm3.905 6.426c-.323 0-.59.262-.632.603l-.006.094v3.01c0 .385.285.697.638.697.323 0 .59-.262.632-.603l.006-.094v-3.01c0-.385-.286-.697-.638-.697z" />
      </svg>
    ),
  },
  {
    href: "/find-friends",
    label: "Find friends",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M9.032 14.456l.297.002c4.404.041 6.907 1.03 6.907 3.678 0 2.586-2.383 3.573-6.615 3.654l-.589.005c-4.588 0-7.203-.972-7.203-3.68 0-2.704 2.604-3.659 7.203-3.659zm0 1.5l-.308.002c-3.645.038-5.523.764-5.523 2.157 0 1.44 1.99 2.18 5.831 2.18 3.847 0 5.832-.728 5.832-2.159 0-1.44-1.99-2.18-5.832-2.18zm8.53-8.037c.347 0 .634.282.679.648l.006.102v1.255h1.185c.38 0 .686.336.686.75 0 .38-.258.694-.593.743l-.093.007h-1.185v1.255c0 .414-.307.75-.686.75-.347 0-.634-.282-.68-.648l-.005-.102-.001-1.255h-1.183c-.379 0-.686-.336-.686-.75 0-.38.258-.694.593-.743l.093-.007h1.183V8.669c0-.414.308-.75.686-.75zM9.031 2c2.698 0 4.864 2.369 4.864 5.319 0 2.95-2.166 5.318-4.864 5.318-2.697 0-4.863-2.369-4.863-5.318C4.17 4.368 6.335 2 9.032 2zm0 1.5c-1.94 0-3.491 1.697-3.491 3.819 0 2.12 1.552 3.818 3.491 3.818 1.94 0 3.492-1.697 3.492-3.818 0-2.122-1.551-3.818-3.492-3.818z" />
      </svg>
    ),
  },
  {
    href: "/bookmarks",
    label: "Bookmarks",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M13.704 2c2.8 0 4.585 1.435 4.585 4.258V20.33c0 .443-.157.867-.436 1.18-.279.313-.658.489-1.063.489a1.456 1.456 0 01-.708-.203l-5.132-3.134-5.112 3.14c-.615.36-1.361.194-1.829-.405l-.09-.126-.085-.155a1.913 1.913 0 01-.176-.786V6.434C3.658 3.5 5.404 2 8.243 2h5.46z" />
      </svg>
    ),
  },
  {
    href: "/groups",
    label: "Group",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/gaming",
    label: "Gaming",
    badge: "New",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
        <path fill="#666" d="M7.625 2c.315-.015.642.306.645.69.003.309.234.558.515.558h.928c1.317 0 2.402 1.169 2.419 2.616v.24h2.604c2.911-.026 5.255 2.337 5.377 5.414.005.12.006.245.004.368v4.31c.062 3.108-2.21 5.704-5.064 5.773-.117.003-.228 0-.34-.005a199.325 199.325 0 01-7.516 0c-2.816.132-5.238-2.292-5.363-5.411a6.262 6.262 0 01-.004-.371V11.87c-.03-1.497.48-2.931 1.438-4.024.956-1.094 2.245-1.714 3.629-1.746a3.28 3.28 0 01.342.005l3.617-.001v-.231c-.008-.676-.522-1.23-1.147-1.23h-.93c-.973 0-1.774-.866-1.785-1.937-.003-.386.28-.701.631-.705zm1.292 9.585c-.341 0-.623.273-.667.626l-.007.098-.001 1.016h-.945c-.372 0-.674.325-.674.725 0 .366.253.669.582.717l.092.006h.945v1.017c0 .4.301.724.673.724.34 0 .622-.273.667-.626l.006-.098v-1.017h.946c.372 0 .673-.324.673-.723 0-.367-.253-.67-.582-.718l-.091-.006h-.946v-1.017c0-.4-.301-.724-.673-.724zm7.058 3.428c.372 0 .674.324.674.724 0 .366-.254.67-.582.717l-.091.007h-.09c-.373 0-.674-.324-.674-.724 0-.367.253-.67.582-.717l.091-.007h.09zm-1.536-3.322c.372 0 .673.324.673.724 0 .367-.253.67-.582.718l-.091.006h-.09c-.372 0-.674-.324-.674-.724 0-.366.254-.67.582-.717l.092-.007h.09z" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path fill="#666" d="M12.616 2c.71 0 1.388.28 1.882.779.495.498.762 1.17.74 1.799l.009.147c.017.146.065.286.144.416.152.255.402.44.695.514.292.074.602.032.896-.137l.164-.082c1.23-.567 2.705-.117 3.387 1.043l.613 1.043c.017.027.03.056.043.085l.057.111a2.537 2.537 0 01-.884 3.204l-.257.159a1.093 1.093 0 00-.447 1.203c.078.287.27.53.56.695l.166.105c.505.346.869.855 1.028 1.439.18.659.083 1.36-.272 1.957l-.66 1.077-.1.152c-.774 1.092-2.279 1.425-3.427.776l-.136-.069a1.19 1.19 0 00-.435-.1 1.128 1.128 0 00-1.143 1.154l-.008.171C15.12 20.971 13.985 22 12.616 22h-1.235c-1.449 0-2.623-1.15-2.622-2.525l-.008-.147a1.045 1.045 0 00-.148-.422 1.125 1.125 0 00-.688-.519c-.29-.076-.6-.035-.9.134l-.177.087a2.674 2.674 0 01-1.794.129 2.606 2.606 0 01-1.57-1.215l-.637-1.078-.085-.16a2.527 2.527 0 011.03-3.296l.104-.065c.309-.21.494-.554.494-.923 0-.401-.219-.772-.6-.989l-.156-.097a2.542 2.542 0 01-.764-3.407l.65-1.045a2.646 2.646 0 013.552-.96l.134.07c.135.06.283.093.425.094.626 0 1.137-.492 1.146-1.124l.009-.194a2.54 2.54 0 01.752-1.593A2.642 2.642 0 0111.381 2h1.235zm-.613 7.732c-1.842 0-3.336 1.463-3.336 3.268 0 1.805 1.494 3.268 3.336 3.268 1.842 0 3.336-1.463 3.336-3.268 0-1.805-1.494-3.268-3.336-3.268z" />
      </svg>
    ),
  },
  {
    href: "/bookmarks",
    label: "Save post",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
];

const suggestedPeople = [
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png" },
  { name: "Ryan Roslansky", role: "CEO of LinkedIn", img: "/assets/images/people2.png" },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png" },
];

const events = [
  { date: "10", month: "Jul", title: "No more terrorism no more cry", going: 17 },
  { date: "24", month: "Aug", title: "Tech Summit 2025 — Connect & Grow", going: 43 },
];

export function LeftSidebar() {
  return (
    <div className="_layout_left_sidebar_wrap">

      {/* ── Explore ── */}
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            {exploreItems.map(({ href, label, badge, svg }) => (
              <li
                key={label}
                className={`_left_inner_area_explore_item${badge ? " _explore_item" : ""}`}
              >
                <Link href={href} className="_left_inner_area_explore_link">
                  {svg}
                  {label}
                </Link>
                {badge && (
                  <span className="_left_inner_area_explore_link_txt">{badge}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Suggested People ── */}
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
            <span className="_left_inner_area_suggest_content_txt">
              <Link className="_left_inner_area_suggest_content_txt_link" href="/find-friends">
                See All
              </Link>
            </span>
          </div>

          {suggestedPeople.map(({ name, role, img }) => (
            <div key={name} className="_left_inner_area_suggest_info">
              <div className="_left_inner_area_suggest_info_box">
                <div className="_left_inner_area_suggest_info_image">
                  <Link href="/profile">
                    <img src={img} alt={name} className="_info_img" />
                  </Link>
                </div>
                <div className="_left_inner_area_suggest_info_txt">
                  <Link href="/profile">
                    <h4 className="_left_inner_area_suggest_info_title">{name}</h4>
                  </Link>
                  <p className="_left_inner_area_suggest_info_para">{role}</p>
                </div>
              </div>
              <div className="_left_inner_area_suggest_info_link">
                <button className="_info_link" style={{ background: "none", border: "none", cursor: "pointer" }}>Connect</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Events ── */}
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_event_content">
            <h4 className="_left_inner_event_title _title5">Events</h4>
            <Link href="/events" className="_left_inner_event_link">See all</Link>
          </div>

          {events.map(({ date, month, title, going }) => (
            <div key={title} className="_left_inner_event_card_link">
              <div className="_left_inner_event_card">
                <Link href="/event-single" style={{ textDecoration: "none", display: "block" }}>
                  <div className="_left_inner_event_card_iamge">
                    <img src="/assets/images/feed_event1.png" alt="Event" className="_card_img" />
                  </div>
                  <div className="_left_inner_event_card_content">
                    <div className="_left_inner_card_date">
                      <p className="_left_inner_card_date_para">{date}</p>
                      <p className="_left_inner_card_date_para1">{month}</p>
                    </div>
                    <div className="_left_inner_card_txt">
                      <h4 className="_left_inner_event_card_title">{title}</h4>
                    </div>
                  </div>
                </Link>
                <hr className="_underline" />
                <div className="_left_inner_event_bottom">
                  <p className="_left_iner_event_bottom">{going} People Going</p>
                  <button className="_left_iner_event_bottom_link" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    Going
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}