import { useEffect, useRef, useState } from "react";
import "./home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faDog, faScissors, faHotel } from "@fortawesome/free-solid-svg-icons";
import MotionComponent from "../../Component/motion/motion";
import axios from "axios";

function Home() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* backapi 요청 보내기 */
  // useEffect(() => {
  //   axios
  //     .post(
  //       "https://port-0-swr-17xco2nlst8pr67.sel5.cloudtype.app/api/user",
  //       { user_name: "문", user_age: 25, user_email: "john@example.com", is_korean: true },
  //       {
  //         headers: { "Content-Type": `application/json`, "Content-Encoding": `charset=utf-8` },
  //       }
  //     )
  //     .then((response) => {
  //       console.log("200", response.data);

  //       if (response.status === 200) {
  //         console.log("true");
  //       }
  //     })
  //     .catch((error) => console.log(error.response));
  // });

  const handleLogin = () => {
    console.log(123);
    const formData = new FormData();
    formData.append("username", "tester10@naver.com");
    formData.append("password", "123456a");

    axios
      .post(`https://port-0-swr-17xco2nlst8pr67.sel5.cloudtype.app/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Content-Encoding": "charset=utf-8",
          "Access-Control-Allow-Origin": `https://teamswr.store`,
          "Access-Control-Allow-Credentials": "true",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleemail = () => {
    console.log(123);
    axios
      .post(
        `https://port-0-swr-17xco2nlst8pr67.sel5.cloudtype.app/join/email-check`,
        { email: "sdc9787@naver.com" },
        {
          headers: {
            "Content-Type": "application/json",
            "Content-Encoding": "charset=utf-8",
            "Access-Control-Allow-Origin": `https://teamswr.store`,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlenickname = () => {
    console.log(123);
    axios
      .post(
        `https://port-0-swr-17xco2nlst8pr67.sel5.cloudtype.app/join/step1`,
        { nickname: "sdc9787" },
        {
          headers: {
            "Content-Type": "application/json",
            "Content-Encoding": "charset=utf-8",
            "Access-Control-Allow-Origin": `https://teamswr.store`,
            "Access-Control-Allow-Credentials": "true",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RlcjEwQG5hdmVyLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MTQ5NDc4NzQsImV4cCI6MTcxNDk4Mzg3NH0.YUxomtNUO1ztrYmFC6tFZdkaHiptnrh2cndm6tzj-nU",
            refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3RlcjNAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfVVNFUiIsImlhdCI6MTcxNDkxNjkyOCwiZXhwIjoxNzE0OTE3NTMyfQ.K0zn5af3UTr4gs4QDDXm9AlDE57eEb9CwAWLBxWNai4",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //스크롤 이벤트
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });

  return (
    <>
      <MotionComponent>
        <div className="home">
          <div className={(scrollPosition < 1 ? "" : "home-navbar-shadow ") + " home-navbar"}>
            <div className="home-navbar-title">
              <i className="xi-bars xi-2x"></i>
            </div>
            <span className="home-navbar-logo">SWR</span>
          </div>
          <div className="home-main">
            <div className="home-main-service">
              <div className="home-main-service-title">
                <span>서비스 추천</span>
                <i className="xi-help-o xi-2x"></i>
              </div>
              <div className="home-main-service-content">
                <div onClick={handleLogin} className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faPaw} size="2x" />
                  <span>로그인</span>
                </div>
                <form action="https://port-0-swr-17xco2nlst8pr67.sel5.cloudtype.app/login" method="post" encType="multipart/form-data">
                  <input type="text" name="username" value="tester10@naver.com" />
                  <input type="password" name="password" value="123456a" />
                  <input type="submit" value="Submit" />
                </form>
                <div onClick={handleemail} className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faDog} size="2x" />
                  <span>이메일</span>
                </div>
                <div onClick={handlenickname} className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faScissors} size="2x" />
                  <span>닉네임</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionComponent>
    </>
  );
}

export default Home;
