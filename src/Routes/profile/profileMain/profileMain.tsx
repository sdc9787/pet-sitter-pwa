import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { stringify } from "querystring";
import Topbar from "../../../Component/topbar/topbar";

function ProfileMain() {
  const navigate = useNavigate(); //페이지 이동
  const [profileName, setProfileName] = useState<string>(""); //프로필 이름
  const [point, setPoint] = useState<number>(2000); //포인트

  useEffect(() => {
    setProfileName(window.localStorage.getItem("nickname") || "");
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("Authorization");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("nickname");
    window.localStorage.removeItem("email");
  };

  //설정 목록
  let setting_menu = [
    {
      title: "계정 정보 관리",
      icon: "xi-user-o",
      navigate: "/profile/pincheck",
    },
    {
      title: "비밀번호 수정",
      icon: "xi-key",
      navigate: "/profile/editpassword",
    },
    {
      title: "알림 설정",
      icon: "xi-bell-o",
      navigate: "/profile/notification",
    },
    {
      title: "진행중인 이벤트",
      icon: "xi-gift-o",
      navigate: "/profile/event",
    },
    {
      title: "결제 정보",
      icon: "xi-credit-card",
      navigate: "/profile/payment-info",
    },
    {
      title: "서비스 이용 내역",
      icon: "xi-list-square",
      navigate: "/profile/service-history",
    },
    {
      title: "고객센터",
      icon: "xi-headset",
      navigate: "/profile/customer-center",
    },
    {
      title: "설정",
      icon: "xi-cog",
      navigate: "/profile/profile",
    },
    {
      title: "공지사항",
      icon: "xi-volume-up",
      navigate: "/profile/notice",
    },
    {
      title: "버전 정보",
      icon: "xi-bars",
      navigate: "/profile/version",
    },
    {
      title: "로그아웃",
      icon: "xi-log-out",
      navigate: "/oauth/login",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <div className="w-full h-full pb-20 flex flex-col justify-center mt-24">
        <Topbar title="프로필"></Topbar>
        {/* 프로필 이름  */}
        <div className="text-center text-3xl font-bold mb-6">{profileName}</div>
        <div className="grid grid-rows-2 grid-cols-2 m-6 border-2 rounded-lg border-main p-4 bg-white">
          <div className="text-center font-bold text-lg">현재 남은 포인트 : </div>
          <div className="text-center font-bold text-lg">{point}p</div>
          <button className="bg-main text-white p-2 rounded-lg font-semibold mr-2">사용내역</button>
          <button className="bg-main text-white p-2 rounded-lg font-semibold ml-2">충전</button>
        </div>

        {/* Todo - map으로 구현  */}
        {/* 내가 남긴 리뷰, 이용중인 서비스, 즐겨찾기 */}
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-1/3">
            <div className="text-3xl font-bold mb-1">0</div>
            <span className="text-xs font-medium text-gray">내가 남긴 리뷰</span>
          </div>
          <div className="flex flex-col justify-center items-center w-1/3">
            <div className="text-3xl font-bold mb-1">0</div>
            <span className="text-xs font-medium text-gray">이용중인 서비스</span>
          </div>
          <div className="flex flex-col justify-center items-center w-1/3">
            <div className="text-3xl font-bold mb-1">0</div>
            <span className="text-xs font-medium text-gray">즐겨찾기</span>
          </div>
        </div>

        {/* 반려동물 프로필 */}
        <div
          className="text-center text-xl font-bold m-6 border-2 border-main rounded-lg p-2 text-main"
          onClick={() => {
            navigate("/profile/petProfile");
          }}>
          <span className="setting-pet-info-title">반려동물 프로필</span>
        </div>

        {/* 설정 목록 */}
        {setting_menu.map((menu, index) => {
          return (
            <div
              key={menu.icon}
              onClick={() => {
                navigate(menu.navigate);
              }}
              className="ml-6 mb-7 flex justify-start items-center">
              <i className={menu.icon + " xi-2x mr-4"}></i>
              <div key={index} className="text-left text-lg font-bold ">
                {menu.title}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProfileMain;
