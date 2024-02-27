import { useNavigate } from "react-router-dom";
import "./routes-Styles/login.css";

function Login(props: { tabState: number }) {
  const navigate = useNavigate(); //페이지 이동
  const tabStateNv = ["home", "pet", "map", "community", "setting"];

  return (
    <>
      <div className="login">
        <div className="login-center">
          <img src="/pet.webp" alt="펫아이콘" />
          <span className="login-center-title">간편하게 로그인하고</span>
          <span className="login-center-title">다양한 서비스를 이용해보세요.</span>
          <img
            onClick={() => {
              navigate("/" + tabStateNv[props.tabState]);
            }}
            src="/kakao_login_medium_wide.png"
            className="kakao-login-img"></img>
          <span className="other-login">다른 방법으로 로그인 하기</span>
        </div>
      </div>
    </>
  );
}

export default Login;
