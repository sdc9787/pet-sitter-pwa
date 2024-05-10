import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoRedirect = () => {
  const code: string = window.location.search;

  const url: string = "/callback";
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}${url}${code}`).then((r: any) => {
      // console.log(r.data);
      window.localStorage.setItem("access_token", r.data.access_token); // 엑세스 토큰 저장
      window.localStorage.setItem("refresh_token", r.data.refresh_token); // 만료 시간 저장

      r.data.login_or_sign === "회원가입" ? navigate("/signup") : navigate("/home");
      // navigate("/signup");
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/mypage`, {
          headers: {
            Authorization: `${window.localStorage.getItem("access_token")}`,
          },
        })
        .then((r: any) => {
          console.log(r.data);
          window.localStorage.setItem("nickname", r.data.nickname); // 닉네임 저장
          window.localStorage.setItem("email", r.data.email); // 이메일 저장
        });
    });
  }, []);
  return <div>로그인 중입니다.</div>;
};

export default KakaoRedirect;
