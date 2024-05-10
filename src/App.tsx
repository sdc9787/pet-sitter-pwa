import "./Styles/App.css";
import { Route, Routes } from "react-router-dom";
import TabBar from "./Component/tabbar/tabbar";
import { AlertText } from "./Component/alertText/alertText";
import Profile from "./Routes/profile/profile";
import Community from "./Routes/community/community";
import Oauth from "./Routes/oauth/oauth";

function App() {
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
        </Routes>
      </div>
      <div className="TabBar font-custom">
        <TabBar></TabBar>
      </div>
      {/* 알림창 */}
      <AlertText />
    </>
  );
}

export default App;
