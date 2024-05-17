import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAlert } from "../../../Component/alertText/alertText";
import { useDispatch } from "react-redux";
import { selectedTab } from "../../../Store/store";

function Login() {
  const navigate = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창
  const dispatch = useDispatch(); //리덕스 디스패치
  const [email, setEmail] = useState<string>(""); //이메일
  const [password, setPassword] = useState<string>(""); //비밀번호

  useEffect(() => {
    window.localStorage.removeItem("Authorization");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("nickname");
    window.localStorage.removeItem("partnership");
  }, []);

  // todo api 주소 변경
  //로그인 버튼 클릭시
  const handleLogin = () => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Encoding": "charset=UTF-8",
        },
      })
      .then((res) => {
        console.log(res.headers);
        localStorage.setItem("Authorization", res.headers.authorization); //토큰 저장
        localStorage.setItem("refresh_token", res.headers.refresh_token); //리프레시 토큰 저장
        localStorage.setItem("nickname", res.headers.nickname); //닉네임 저장
        localStorage.setItem("partnership", res.headers.partnership); //파트너십 저장
        dispatch(selectedTab(0)); //탭바 초기화

        //회원가입 추가 정보가 있는지 확인
        if (res.headers.joindetails == "true") {
          navigate("/home");
        } else {
          navigate("/oauth/signup/additionSignUp");
        }
      })
      .catch((error) => {
        console.error(error);
        alertBox("아이디 또는 비밀번호가 일치하지 않습니다");
      });
  };

  return (
    <div className="z-50 flex flex-col items-center justify-center min-h-screen bg-white ">
      <div className="p-6 bg-white w-screen flex flex-col items-center">
        {/* 로그인 폼*/}
        {/* <img className=" w-64" src="/img/logo.webp" alt="로고" /> */}
        <div className="text-main font-black text-center text-6xl  mb-20">SWR</div>
        <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="이메일" className="border-2 border-bdgray rounded-lg p-3 w-full mb-3" />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" className="border-2 border-bdgray rounded-lg p-3 w-full mb-4" />
        <button onClick={handleLogin} className="bg-main text-white rounded-lg p-3 w-full mb-4 h-15">
          로그인
        </button>
        <div className="text-center flex justify-center items-center text-xs font-bold text-gray-500 mb-3">
          <span>비밀번호 찾기</span>
          <div className="h-3 m-3 border border-black"></div>
          <span onClick={() => navigate("/oauth/signup/default")}>이메일로 회원가입</span>
        </div>
        {/* 카카오 로그인 버튼*/}
        <button
          onClick={() => {
            location.href = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + import.meta.env.VITE_APP_CLIEND_ID + "&redirect_uri=" + import.meta.env.VITE_APP_REDIRECT_URI;
          }}
          className="bg-[#FEE500] text-[#452c2a] rounded-lg p-3  w-full flex justify-center items-center font-bold mb-4">
          <i className="xi-kakaotalk xi-2x mr-1"></i>
          <span>카카오계정으로 시작</span>
        </button>
        <p className="text-xs text-center text-gray-500 ">
          문의 및 도움이 필요하신 경우 070-1234-5678
          <br />
          이용약관 관련 문의 1234-5678
        </p>
      </div>
    </div>
  );
}

export default Login;
