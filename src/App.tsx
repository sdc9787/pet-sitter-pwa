import { useEffect, useState } from "react";
import "./Styles/App.css";
import TabBar from "./Component/tabbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Setting from "./Routes/setting/setting";
import Home from "./Routes/home/home";
import Pet from "./Routes/pet/pet";
import Map from "./Routes/map";
import Community from "./Routes/community/community";
import Login from "./Routes/login";
import KakaoRedirect from "./Routes/oauth/callback/kakao/kakaoRedirect";
import axios from "axios";
import Signup from "./Routes/signup/signup";
import PinCheck from "./Routes/setting/pincheck/pincheck";
import EditInfo from "./Routes/setting/edit-info/edit-info";
import SignUpPinNumber from "./Routes/signup/signup-pinnumber";
import { useSelector } from "react-redux";
import CommunityDetail from "./Routes/community/communityDetail";
import CommunityCreate from "./Routes/community/communityCreate";
import CommunityEdit from "./Routes/community/communityEdit";

function App() {
  const navigate = useNavigate(); //페이지 이동
  let tabbarState = useSelector((state: any) => state.tabbar); //tabbar state

  // 토큰 유효성 검사
  useEffect(() => {
    checkTokenValidity();
    if (window.localStorage.getItem("access_token") === null) {
      navigate("/login");
    } else {
      navigate("/home");
    }
  }, []);

  //tabState가 바뀔때마다 토큰 유효성 검사
  const checkTokenValidity = async () => {
    const expiresAtUnix = JSON.parse(window.localStorage.getItem("access_token_expires_in") as string);
    const refreshTokenExpiresIn = JSON.parse(window.localStorage.getItem("refresh_token_expires_in") as string);
    const currentTimeUnix = Math.floor(Date.now() / 1000);
    console.log(currentTimeUnix);
    const url = "/refresh";
    if (currentTimeUnix >= expiresAtUnix) {
      if (currentTimeUnix >= refreshTokenExpiresIn) {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("access_token_expires_in");
        window.localStorage.removeItem("refresh_token");
        window.localStorage.removeItem("refresh_token_expires_in");
        return 0;
      }
      axios
        .post(`${import.meta.env.VITE_APP_API_URL}${url}`, {
          refresh_token: window.localStorage.getItem("refresh_token"),
        })
        .then((r: any) => {
          r.data?.access_token === undefined ? null : window.localStorage.setItem("access_token", r.data.access_token);
          r.data?.expires_at_unix === undefined ? null : window.localStorage.setItem("expires_at_unix", r.data.expires_at_unix);
          r.data?.refresh_token === undefined ? null : window.localStorage.setItem("refresh_token", r.data.refresh_token);
          r.data?.refresh_token_expires_in === undefined ? null : window.localStorage.setItem("refresh_token_expires_in", r.data.refresh_token_expires_in);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  };
  useEffect(() => {
    checkTokenValidity();
  }, [tabbarState.state]);

  return (
    <>
      <div className="main-frame-routes">
        <Routes>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signup/pin-number" element={<SignUpPinNumber></SignUpPinNumber>}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route path="/pet" element={<Pet></Pet>}></Route>
          <Route path="/map" element={<Map></Map>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/community/create" element={<CommunityCreate></CommunityCreate>}></Route>
          <Route path="/community/edit" element={<CommunityEdit></CommunityEdit>}></Route>
          <Route path="/community/detail" element={<CommunityDetail></CommunityDetail>}></Route>
          <Route path="/setting" element={<Setting></Setting>}></Route>
          <Route path="/setting/pincheck" element={<PinCheck></PinCheck>}></Route>
          <Route path="/setting/edit-info" element={<EditInfo></EditInfo>}></Route>
          <Route path="/oauth/callback/kakao" element={<KakaoRedirect></KakaoRedirect>}></Route>
          <Route path="*" element={<div>접근할 수 없는 페이지입니다.</div>}></Route>
        </Routes>
      </div>
      <div className="TabBar">
        <TabBar></TabBar>
      </div>
    </>
  );
}

export default App;
