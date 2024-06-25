import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import TabBar from "../../../Component/tabbar/tabbar";
import instanceJson from "../../../Component/axios/axiosJson";
import Loading from "../../../Component/loading/loading";

function ProfileMain() {
  const navigate = useNavigate(); //페이지 이동

  const [loading, setLoading] = useState<boolean>(true); //로딩
  const [profileName, setProfileName] = useState<string>(""); //프로필 이름
  const [point, setPoint] = useState<number>(0); //포인트
  const [review, setReview] = useState<number>(0); //리뷰
  //파트너가 받은 리뷰
  const [partnerReview, setPartnerReview] = useState<number>(0); //파트너가 받은 리뷰
  const [usage, setUsage] = useState<number>(0); //이용내역

  useEffect(() => {
    setProfileName(window.localStorage.getItem("nickname") || "");

    const fetchCoin = instanceJson.get("/mypage/coin");
    const fetchWalkReviews = instanceJson.get("/review/walk/myWrite");
    const fetchCareReviews = instanceJson.get("/review/care/myWrite");
    const fetchWalkUsage = instanceJson.get("/usageDetails/walk/list");
    const fetchCareUsage = instanceJson.get("/usageDetails/care/list");
    const fetchPartnerWalkUsage = localStorage.getItem("partnership") === "1" ? instanceJson.get("/usageDetails/walk/partner/list") : Promise.resolve({ data: { walkUsageList: [] } });
    const fetchPartnerCareUsage = localStorage.getItem("partnership") === "1" ? instanceJson.get("/usageDetails/care/partner/list") : Promise.resolve({ data: { careUsageList: [] } });
    const fetchPartnerWalkReviews = localStorage.getItem("partnership") === "1" ? instanceJson.get("/review/walk/partner/list") : Promise.resolve({ data: { walkReviewList: [] } });
    const fetchPartnerCareReviews = localStorage.getItem("partnership") === "1" ? instanceJson.get("/review/care/partner/list") : Promise.resolve({ data: { careReviewList: [] } });

    Promise.all([fetchCoin, fetchWalkReviews, fetchCareReviews, fetchWalkUsage, fetchCareUsage, fetchPartnerWalkUsage, fetchPartnerCareUsage, fetchPartnerWalkReviews, fetchPartnerCareReviews])
      .then((responses) => {
        setPoint(responses[0].data);
        setReview((prevReview) => prevReview + responses[1].data.walkReviewList.length + responses[2].data.careReviewList.length);
        setUsage((prevUsage) => prevUsage + responses[3].data.walkUsageList.length + responses[4].data.careUsageList.length + responses[5].data.walkUsageList.length + responses[6].data.careUsageList.length);
        setPartnerReview((prevPartnerReview) => prevPartnerReview + responses[7].data.walkReviewList.length + responses[8].data.careReviewList.length);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    instanceJson
      .get("/logout")
      .then(() => {
        window.localStorage.removeItem("Authorization");
        window.localStorage.removeItem("refresh_token");
        window.localStorage.removeItem("nickname");
        window.localStorage.removeItem("partnership");
      })
      .catch((error) => {
        console.error(error);
      });
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
      title: "파트너쉽 권한",
      icon: "xi-list-square",
      navigate: "/profile/partnerShip/step1",
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

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="w-full h-full pb-20 flex flex-col justify-center mt-24">
        <Topbar title="프로필"></Topbar>
        {/* 프로필 이름  */}
        <div className="text-center text-3xl font-bold mb-6">{profileName}</div>
        <div className="grid grid-rows-2 grid-cols-2 m-6 border-2 rounded-lg border-main p-4 bg-white">
          <div className="text-center font-bold text-lg">현재 남은 포인트 : </div>
          <div className="text-center font-bold text-lg">{point.toLocaleString()}</div>
          <button onClick={() => navigate("/tossPay/list")} className="bg-main text-white p-2 rounded-lg font-semibold mr-2">
            사용내역
          </button>
          <button onClick={() => navigate("/tossPay")} className="bg-main text-white p-2 rounded-lg font-semibold ml-2">
            충전
          </button>
        </div>

        {/* Todo - map으로 구현  */}
        {/* 내가 남긴 리뷰, 이용중인 서비스, 즐겨찾기 */}
        <div className="flex justify-center items-center">
          <div onClick={() => navigate("/profile/review")} className="flex flex-col justify-center items-center w-1/3">
            <div className="text-3xl font-bold mb-1">{review}</div>
            <span className="text-xs font-medium text-gray">내가 남긴 리뷰</span>
          </div>
          {localStorage.getItem("partnership") == "1" ? (
            <div onClick={() => navigate("/profile/review/partner")} className="flex flex-col justify-center items-center w-1/3">
              <div className="text-3xl font-bold mb-1">{partnerReview}</div>
              <span className="text-xs font-medium text-gray">내가 받은 리뷰</span>
            </div>
          ) : null}

          <div onClick={() => navigate("/profile/usage/user")} className="flex flex-col justify-center items-center w-1/3">
            <div className="text-3xl font-bold mb-1">{usage}</div>
            <span className="text-xs font-medium text-gray">이용내역</span>
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
                if (menu.onClick) menu.onClick();
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
      <TabBar></TabBar>
    </>
  );
}

export default ProfileMain;
