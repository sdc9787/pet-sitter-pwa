import ReservationMainCard from "./reservationMainCard";

function ReservationMain() {
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
          <ReservationMainCard title="돌봄" description="LIVE 영상으로 돌봄 모습 확인" />
          <ReservationMainCard title="산책" description="GPS 경로와 함께 산책 모습 확인" />
          <ReservationMainCard title="장기 케어" description="반나절 또는 2일 이상 케어 제공" />
          <ReservationMainCard title="미용" description="전문 그루머" />
          <ReservationMainCard title="훈련" description="업계 최저가" />
          <ReservationMainCard title="펫 플레이스" description="반려동물과 함께하는 모든 장소" highlight="HOT" />
        </div>
      </div>
    </div>
  );
}

export default ReservationMain;
