import "./Styles/App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import TabBar from "./Component/tabbar/tabbar";
import { AlertText } from "./hook/useAlert/useAlert";
import Profile from "./Routes/profile/profile";
import Community from "./Routes/community/community";
import Oauth from "./Routes/oauth/oauth";
import { useEffect } from "react";
import KakaoMap from "./Routes/map/map";
import Reservation from "./Routes/reservation/reservation";
import ReservationUtils from "./Routes/reservationUtils/reservationUtils";
import TossPay from "./Routes/tosspay/tosspay";

function App() {
  const navigate = useNavigate(); //페이지 이동

  useEffect(() => {
    if (localStorage.getItem("Authorization")) {
      // navigate("/reservation");
    } else {
      navigate("/oauth/login");
    }
  }, []);

  return (
    <>
      <div className="w-screen flex justify-center items-start font-custom">
        <Routes>
          {/* 로그인, 회원가입 페이지 */}
          <Route path="/oauth/*" element={<Oauth />} />
          {/* 프로필 */}
          <Route path="/profile/*" element={<Profile></Profile>}></Route>
          {/* 커뮤니티 */}
          <Route path="/community/*" element={<Community></Community>}></Route>
          {/* 예약(홈) */}
          <Route path="/reservation/*" element={<Reservation></Reservation>}></Route>
          {/* 예약 내역*/}
          <Route path="/reservationUtils/*" element={<ReservationUtils></ReservationUtils>}></Route>
          {/* 지도 */}
          <Route path="/map" element={<KakaoMap></KakaoMap>}></Route>
          {/*토스페이*/}
          <Route path="/tossPay/*" element={<TossPay></TossPay>}></Route>
        </Routes>
      </div>
      {/* 알림창 */}
      <AlertText />
    </>
  );
}

export default App;
