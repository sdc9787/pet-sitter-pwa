import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirection = () => {
  const code = window.location.search;
  const navigate = useNavigate();
  console.log(1);
  useEffect(() => {
    console.log(1);
    console.log(import.meta.env.VITE_APP_API_URL);
    console.log(`${import.meta.env.VITE_APP_API_URL}${code}`);
    axios.get(`${import.meta.env.VITE_APP_API_URL}${code}`).then((r: any) => {
      console.log(r.data);

      window.localStorage.setItem("access_token", r.data.access_token); // 엑세스 토큰 저장
      window.localStorage.setItem("nick_name", r.data.nick_name); // 닉네임 저장
      window.localStorage.setItem("expires_at_unix", r.expires_at_unix); // 만료 시간 저장

      navigate("/home");
    });
  }, []);

  return <div>로그인 중입니다.</div>;
};

export default Redirection;
