import { useNavigate } from "react-router-dom";
import ReservationMainCard from "./reservationMainCard";
import TabBar from "../../Component/tabbar/tabbar";

function ReservationMain() {
  const navigator = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="flex items-center justify-between p-6 bg-white">
        <div className="text-3xl font-black text-main">SWR</div>
        <button className="text-gray-600">이용 안내</button>
      </div>
      {/* 메인 카드 */}
      <div className="flex-grow p-4 bg-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <ReservationMainCard navigateProps={Number(localStorage.getItem("partnership")) === 0 ? "/reservation/care" : "/reservation/care/partner"} title="돌봄" description="인증 받은 파트너가 돌봐드려요" />
          <ReservationMainCard navigateProps={Number(localStorage.getItem("partnership")) === 0 ? "/reservation/walk" : "/reservation/walk/partner/list"} title="산책" description="GPS 경로와 함께 산책 모습 확인" />
          <ReservationMainCard navigateProps="/map" title="펫 플레이스" description="반려동물과 함께하는 모든 장소" />
          <ReservationMainCard navigateProps="/community" title="커뮤니티" description="애견인들의 정보공유 공간" />
        </div>
      </div>
      <TabBar></TabBar>
    </div>
  );
}

export default ReservationMain;
