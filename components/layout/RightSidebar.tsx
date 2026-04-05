// components/layout/RightSidebar.tsx
import Link from "next/link";

interface RightSidebarProps {
  currentUserId: string;
}

// In a real app these would be fetched from DB based on mutual connections etc.
const suggestedFollows = [
  { id: "1", name: "Radovan SkillArena", role: "Founder & CEO at Trophy", img: "/assets/images/Avatar.png" },
];

const friends = [
  { id: "1", name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, lastSeen: "5 minutes ago" },
  { id: "2", name: "Ryan Roslansky", role: "CEO of LinkedIn", img: "/assets/images/people2.png", online: true },
  { id: "3", name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { id: "4", name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, lastSeen: "1 hour ago" },
  { id: "5", name: "Ryan Roslansky", role: "CEO of LinkedIn", img: "/assets/images/people2.png", online: true },
  { id: "6", name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
];

export function RightSidebar({ currentUserId }: RightSidebarProps) {
  return (
    <div className="_layout_right_sidebar_wrap">
      {/* You Might Like */}
      <div className="_layout_right_sidebar_inner">
        <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_right_inner_area_info_content _mar_b24">
            <h4 className="_right_inner_area_info_content_title _title5">
              You Might Like
            </h4>
            <span className="_right_inner_area_info_content_txt">
              <Link className="_right_inner_area_info_content_txt_link" href="/find-friends">
                See All
              </Link>
            </span>
          </div>
          <hr className="_underline" />

          {suggestedFollows.map(({ id, name, role, img }) => (
            <div key={id} className="_right_inner_area_info_ppl">
              <div className="_right_inner_area_info_box">
                <div className="_right_inner_area_info_box_image">
                  <Link href="/profile">
                    <img src={img} alt={name} className="_ppl_img" />
                  </Link>
                </div>
                <div className="_right_inner_area_info_box_txt">
                  <Link href="/profile">
                    <h4 className="_right_inner_area_info_box_title">{name}</h4>
                  </Link>
                  <p className="_right_inner_area_info_box_para">{role}</p>
                </div>
              </div>
              <div className="_right_info_btn_grp">
                <button type="button" className="_right_info_btn_link">
                  Ignore
                </button>
                <button type="button" className="_right_info_btn_link _right_info_btn_link_active">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Friends */}
      <div className="_layout_right_sidebar_inner">
        <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_feed_top_fixed">
            <div className="_feed_right_inner_area_card_content _mar_b24">
              <h4 className="_feed_right_inner_area_card_content_title _title5">
                Your Friends
              </h4>
              <span className="_feed_right_inner_area_card_content_txt">
                <Link
                  className="_feed_right_inner_area_card_content_txt_link"
                  href="/find-friends"
                >
                  See All
                </Link>
              </span>
            </div>
            <form className="_feed_right_inner_area_card_form" role="search">
              <svg
                className="_feed_right_inner_area_card_form_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 17 17"
              >
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input
                className="form-control me-2 _feed_right_inner_area_card_form_inpt"
                type="search"
                placeholder="Search friends..."
                aria-label="Search friends"
              />
            </form>
          </div>

          <div className="_feed_bottom_fixed">
            {friends.map(({ id, name, role, img, online, lastSeen }) => (
              <div
                key={id + name}
                className={`_feed_right_inner_area_card_ppl${
                  !online ? " _feed_right_inner_area_card_ppl_inactive" : ""
                }`}
              >
                <div className="_feed_right_inner_area_card_ppl_box">
                  <div className="_feed_right_inner_area_card_ppl_image">
                    <Link href="/profile">
                      <img src={img} alt={name} className="_box_ppl_img" />
                    </Link>
                  </div>
                  <div className="_feed_right_inner_area_card_ppl_txt">
                    <Link href="/profile">
                      <h4 className="_feed_right_inner_area_card_ppl_title">{name}</h4>
                    </Link>
                    <p className="_feed_right_inner_area_card_ppl_para">{role}</p>
                  </div>
                </div>
                <div className="_feed_right_inner_area_card_ppl_side">
                  {online ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 14 14"
                      aria-label="Online"
                    >
                      <rect
                        width="12"
                        height="12"
                        x="1"
                        y="1"
                        fill="#0ACF83"
                        stroke="#fff"
                        strokeWidth="2"
                        rx="6"
                      />
                    </svg>
                  ) : (
                    <span>{lastSeen}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}