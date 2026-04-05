// components/feed/StoryBar.tsx
// Matches the original HTML exactly — desktop 4-col grid + mobile horizontal scroll

const desktopStories = [
  { id: "2", name: "Ryan Roslansky", img: "/assets/images/card_ppl2.png", mini: "/assets/images/mini_pic.png" },
  { id: "3", name: "Ryan Roslansky", img: "/assets/images/card_ppl3.png", mini: "/assets/images/mini_pic.png" },
  { id: "4", name: "Ryan Roslansky", img: "/assets/images/card_ppl4.png", mini: "/assets/images/mini_pic.png" },
];

const mobileStories = [
  { img: "/assets/images/mobile_story_img1.png", name: "Ryan...", active: true },
  { img: "/assets/images/mobile_story_img2.png", name: "Ryan...", active: false },
  { img: "/assets/images/mobile_story_img1.png", name: "Ryan...", active: true },
  { img: "/assets/images/mobile_story_img2.png", name: "Ryan...", active: false },
  { img: "/assets/images/mobile_story_img1.png", name: "Ryan...", active: true },
  { img: "/assets/images/mobile_story_img2.png", name: "Ryan...", active: false },
  { img: "/assets/images/mobile_story_img1.png", name: "Ryan...", active: true },
];

export function StoryBar() {
  return (
    <>
      {/* ── Desktop ── */}
      <div className="_feed_inner_ppl_card _mar_b16">
        <div className="_feed_inner_story_arrow">
          <button type="button" className="_feed_inner_story_arrow_btn" aria-label="Next stories">
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
              <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
            </svg>
          </button>
        </div>

        <div className="row">
          {/* Your Story */}
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
            <div className="_feed_inner_profile_story _b_radious6">
              <div className="_feed_inner_profile_story_image">
                <img src="/assets/images/card_ppl1.png" alt="Your story" className="_profile_story_img" />
                <div className="_feed_inner_story_txt">
                  <div className="_feed_inner_story_btn">
                    <button className="_feed_inner_story_btn_link" type="button" aria-label="Add story">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                        <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                      </svg>
                    </button>
                  </div>
                  <p className="_feed_inner_story_para">Your Story</p>
                </div>
              </div>
            </div>
          </div>

          {/* Friend stories */}
          {desktopStories.map(({ id, name, img, mini }, idx) => (
            <div
              key={id}
              className={[
                "col-xl-3 col-lg-3 col-md-4 col-sm-4",
                idx === 1 ? "_custom_mobile_none" : "",
                idx === 2 ? "_custom_none" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="_feed_inner_public_story _b_radious6">
                <div className="_feed_inner_public_story_image">
                  <img src={img} alt={name} className="_public_story_img" />
                  <div className="_feed_inner_pulic_story_txt">
                    <p className="_feed_inner_pulic_story_para">{name}</p>
                  </div>
                  <div className="_feed_inner_public_mini">
                    <img src={mini} alt="" className="_public_mini_img" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="_feed_inner_ppl_card_mobile _mar_b16">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list">
            {/* Your story */}
            <li className="_feed_inner_ppl_card_area_item">
              <a href="#0" className="_feed_inner_ppl_card_area_link">
                <div className="_feed_inner_ppl_card_area_story">
                  <img src="/assets/images/mobile_story_img.png" alt="" className="_card_story_img" />
                  <div className="_feed_inner_ppl_btn">
                    <button className="_feed_inner_ppl_btn_link" type="button" aria-label="Add story">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
              </a>
            </li>

            {mobileStories.map(({ img, name, active }, i) => (
              <li key={i} className="_feed_inner_ppl_card_area_item">
                <a href="#0" className="_feed_inner_ppl_card_area_link">
                  <div className={active ? "_feed_inner_ppl_card_area_story_active" : "_feed_inner_ppl_card_area_story_inactive"}>
                    <img src={img} alt={name} className="_card_story_img1" />
                  </div>
                  <p className="_feed_inner_ppl_card_area_txt">{name}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}