import { useNavigate } from "react-router-dom";
import "./routes-Styles/login.css";

function Login() {
  const navigate = useNavigate(); //페이지 이동

  return (
    <>
      <div className="login">
        <div className="login-center">
          <img src="/img/pet.webp" alt="펫아이콘" />
          <span className="login-center-title">간편하게 로그인하고</span>
          <span className="login-center-title">다양한 서비스를 이용해보세요.</span>

          <img
            onClick={() => {
              location.href = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + import.meta.env.VITE_APP_CLIEND_ID + "&redirect_uri=" + import.meta.env.VITE_APP_REDIRECT_URI;
            }}
            src="/img/kakao_login_medium_wide.png"
            className="kakao-login-img"></img>

          <span className="other-login">다른 방법으로 로그인 하기</span>
        </div>
      </div>
    </>
  );
}

export default Login;
