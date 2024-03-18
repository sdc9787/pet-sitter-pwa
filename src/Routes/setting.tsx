import { useEffect, useRef, useState } from "react";
import "./routes-Styles/setting.css";
import "../Styles/useClickAnimation.css";
import UseClickAnimation from "../Component/useClickAnimation";
import axios from "axios";

function Setting() {
  const url = "/mypage";
  axios
    .get(`${import.meta.env.VITE_APP_API_URL}${url}`, {
      headers: {
        Authorization: `${window.localStorage.getItem("access_token")}`,
      },
    })
    .then((r: any) => {
      console.log(r.data);
    });

  const profileImg: string = "/img/profile.png"; //프로필 이미지 주소 (백에서 받아오기)
  let profileName: string = "sdc9787"; //프로필 이름 (백에서 받아오기)

  //설정 목록
  let setting_menu = [
    //백에서 elemnet 받아오기
    { title: "최근 방문 목록", element: ["최근 방문 테스트1", "최근 방문  테스트2", "최근 방문  테스트3"], elementIcon: ["xi-pen-o", "xi-label-o", "xi-mail-o"] },
    { title: "나의 게시글 목록", element: ["게시글 테스트1", "게시글 테스트2", "게시글 테스트3"], elementIcon: ["xi-pen-o", "xi-label-o", "xi-mail-o"] },
    { title: "나의 거래 목록", element: ["거래 테스트1", "거래 테스트2", "거래 테스트3"], elementIcon: ["xi-pen-o", "xi-label-o", "xi-mail-o"] },
    { title: "나의 거래 목록", element: ["거래 테스트1", "거래 테스트2", "거래 테스트3"], elementIcon: ["xi-pen-o", "xi-label-o", "xi-mail-o"] },
    { title: "나의 거래 목록", element: ["거래 테스트1", "거래 테스트2", "거래 테스트3"], elementIcon: ["xi-pen-o", "xi-label-o", "xi-mail-o"] },
  ];

  //설정 버튼 애니메이션
  const buttonRef: any = [];
  let count = 0;
  setting_menu.forEach((i) => {
    i.element.forEach(() => {
      buttonRef.push(useRef<HTMLButtonElement>(null));
      UseClickAnimation(buttonRef[count++], {
        color: "gray",
        size: 50,
        duration: 500,
        effectName: "ripple",
      });
    });
  });
  count = 0;

  //프로필 버튼 애니메이션
  const buttonRefProfile = useRef<HTMLButtonElement>(null);
  UseClickAnimation(buttonRefProfile, {
    color: "gray",
    size: 50,
    duration: 500,
    effectName: "ripple",
  });

  //스크롤 이벤트
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });
  return (
    <>
      <div className="setting">
        <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
          <span className={scrollPosition < 1 ? "setting-setting-title-false" : "setting-setting-title-true"}>프로필</span>
          <i className="xi-cog xi-2x"></i>
        </div>
        <div className="setting-profile">
          <div className="setting-profile-icon-name">
            <img className="setting-profile-icon" src={profileImg} alt="프로필 아이콘" />
            <span className="setting-profile-name">{profileName}</span>
          </div>
          <button ref={buttonRefProfile} className="setting-profile-set">
            프로필 변경
          </button>
        </div>
        <div className="setting-menu">
          {setting_menu.map((a, i) => {
            return (
              <div key={i} className="setting-menu-title-element">
                <div className="setting-menu-title">{a.title}</div>
                {a.element.map((b, j) => {
                  return (
                    <button ref={buttonRef[count++]} key={j} className="setting-menu-element-icon">
                      <i className={a.elementIcon[j] + " xi-2x"}></i>
                      <div className="setting-menu-element">{b}</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Setting;
