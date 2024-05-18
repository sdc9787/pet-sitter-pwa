import { useNavigate } from "react-router-dom";
import ReservationMainCard from "./reservationMainCard";

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
          <ReservationMainCard navigateProps="/reservation/care" title="돌봄" description="LIVE 영상으로 돌봄 모습 확인" />
          <ReservationMainCard navigateProps="/reservation/walk" title="산책" description="GPS 경로와 함께 산책 모습 확인" />
          <div className="col-span-2">
            <ReservationMainCard navigateProps="/map" title="펫 플레이스" description="반려동물과 함께하는 모든 장소" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationMain;
