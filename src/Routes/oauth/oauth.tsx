import { Route, Routes } from "react-router-dom";
import KakaoRedirect from "./callback/kakao/kakaoRedirect";
import Login from "./login/login";

import SignUpPinNumber from "./signup/signupPinNumber/signupPinNumber";
import SignUp from "./signup/default/signup";
import AdditionSignUp from "./signup/additionSignUp/additionSignUp";

function Oauth() {
  return (
    <>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup/default" element={<SignUp />} />
        {/* 카카오 회원가입 페이지 & 리다이렉트 페이지 */}
        <Route path="/signup/additionSignUp" element={<AdditionSignUp />} />
        <Route path="/callback/kakao" element={<KakaoRedirect></KakaoRedirect>}></Route>
        {/* 핀번호 페이지 */}
        <Route path="/signup/signupPinNumber" element={<SignUpPinNumber />} />
      </Routes>
    </>
  );
}

export default Oauth;
