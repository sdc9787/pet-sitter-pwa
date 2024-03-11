import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirection = () => {
  const code = window.location.search;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(import.meta.env.VITE_APP_API_URL);
    console.log(`${import.meta.env.VITE_APP_API_URL}${code}`);
    axios.get(`${import.meta.env.VITE_APP_API_URL}${code}`).then((r) => {
      console.log(r.data);

      // 토큰을 받아서 localStorage같은 곳에 저장하는 코드를 여기에 쓴다.
      localStorage.setItem("name", r.data.user_name); // 일단 이름만 저장했다.

      navigate("/loginSuccess");
    });
  }, []);

  return <div>로그인 중입니다.</div>;
};

export default Redirection;
