import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useDispatch } from "react-redux";
import { selectedTab } from "../../../../Store/store";

const KakaoRedirect = () => {
  const code: string = window.location.search;

  const url: string = "/callback";
  const alertBox = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch(); //리덕스 디스패치
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}${url}${code}`, {
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "charset=UTF-8",
        },
      })
      .then((res) => {
        console.log(res.headers);
        localStorage.setItem("Authorization", res.headers.authorization); //토큰 저장
        localStorage.setItem("refresh_token", res.headers.refresh_token); //리프레시 토큰 저장
        localStorage.setItem("nickname", res.headers.nickname); //닉네임 저장
        localStorage.setItem("partnership", res.headers.partnership); //파트너십 저장
        localStorage.setItem("email", res.headers.email); //이메일 저장
        dispatch(selectedTab(0)); //탭바 초기화

        //회원가입 추가 정보가 있는지 확인
        if (res.headers.joindetails == "true") {
          navigate("/reservation");
        } else {
          navigate("/oauth/signup/additionSignUp");
        }
      })
      .catch((error) => {
        if (error.response.status === 400 && error.response.data === "일반로그인") {
          alertBox("이미 계정이 존재합니다");
          navigate("/oauth/login");
        }
        console.error(error);
        alertBox("아이디 또는 비밀번호가 일치하지 않습니다");
      });
  }, []);
  return <div>로그인 중입니다.</div>;
};

export default KakaoRedirect;
