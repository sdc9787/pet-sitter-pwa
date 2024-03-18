import { useEffect, useState } from "react";
import "./Styles/App.css";
import TabBar from "./Component/tabbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Setting from "./Routes/setting";
import Home from "./Routes/home";
import Pet from "./Routes/pet";
import Map from "./Routes/map";
import Community from "./Routes/community";
import Login from "./Routes/login";
import KakaoRedirect from "./Routes/oauth/callback/kakao/kakaoRedirect";

function App() {
  let [tabState, setTabState] = useState<number>(() => JSON.parse(window.localStorage.getItem("tabState") as string) || 0); //class 체크 저장
  const navigate = useNavigate(); //페이지 이동
  // useEffect(() => {
  //   if (window.localStorage.getItem("access_token") === null) {
  //     navigate("/login");
  //   } else navigate("/home");
  // }, []);

  return (
    <>
      <div className="main-frame-routes">
        <Routes>
          <Route path="/" element={<Login tabState={tabState}></Login>}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/pet" element={<Pet></Pet>}></Route>
          <Route path="/map" element={<Map></Map>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/setting" element={<Setting></Setting>}></Route>
          <Route path="/oauth/callback/kakao" element={<KakaoRedirect></KakaoRedirect>}></Route>
          <Route path="*" element={<div>접근할 수 없는 페이지입니다.</div>}></Route>
        </Routes>
      </div>
      <div className="TabBar">
        <TabBar tabState={tabState} setTabState={setTabState}></TabBar>
      </div>
    </>
  );
}

export default App;
