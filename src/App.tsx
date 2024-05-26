import "./Styles/App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import TabBar from "./Component/tabbar/tabbar";
import { AlertText } from "./hook/useAlert/useAlert";
import Profile from "./Routes/profile/profile";
import Community from "./Routes/community/community";
import Oauth from "./Routes/oauth/oauth";
import { useEffect, useState } from "react";
import KakaoMap from "./Routes/map/map";
import Reservation from "./Routes/reservation/reservation";
import ReservationUtils from "./Routes/reservationUtils/reservationUtils";
import TossPay from "./Routes/tosspay/tosspay";
import { EventSourcePolyfill } from "event-source-polyfill";

type EventData = {
  // 이벤트 데이터의 타입을 정의하세요.
  // 예를 들어:
  id: number;
  message: string;
  // ...
};

function App() {
  const navigate = useNavigate(); //페이지 이동

  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    //토큰 유효성 검사
    const token = localStorage.getItem("Authorization");
    const refreshToken = localStorage.getItem("refresh_token");
    if (token) {
      // navigate("/reservation");
    } else {
      navigate("/oauth/login");
    }

    // // 이벤트 소스 연결
    // if (!token || !refreshToken) {
    //   // 토큰이 없는 경우 처리
    //   console.error("Missing token or refresh token");
    //   return;
    // }

    // // 이벤트 소스 연결
    // const eventSource = new EventSourcePolyfill(`${import.meta.env.VITE_APP_API_URL}/sse/match-events`, {
    //   headers: {
    //     Authorization: token,
    //     "X-Refresh-Token": refreshToken,
    //     "Content-Type": "application/json",
    //     "Content-Encoding": "charset=UTF-8",
    //   },
    // });

    // eventSource.onmessage = (event) => {
    //   const newEvent: EventData = JSON.parse(event.data);
    //   setEvents((prevEvents) => [...prevEvents, newEvent]);
    // };

    // eventSource.onerror = (err) => {
    //   console.error("EventSource failed:", err);
    //   eventSource.close();
    // };

    // return () => {
    //   eventSource.close();
    // };
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
          <Route path="/" element={<Reservation></Reservation>}></Route>
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
