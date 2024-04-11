import { useEffect, useRef, useState } from "react";
import "./home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faDog, faScissors, faHotel } from "@fortawesome/free-solid-svg-icons";
import MotionComponent from "../../Component/motion/motion";

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
                <div className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faPaw} size="2x" />
                  <span>돌봄</span>
                </div>
                <div className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faDog} size="2x" />
                  <span>산책</span>
                </div>
                <div className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faScissors} size="2x" />
                  <span>미용</span>
                </div>
                <div className="home-main-service-content-item">
                  <FontAwesomeIcon icon={faHotel} size="2x" />
                  <span>숙소</span>
                </div>
              </div>
            </div>
            <div className="home-main-service">
              <div className="home-main-service-menu-title">
                <span>플레이스</span>
                <i className="xi-help-o xi-2x"></i>
              </div>
              <div className="home-main-service-menu">
                <div className="home-main-service-content-item">
                  <i className="xi-cafe xi-2x"></i>
                  <span>카페</span>
                </div>
                <div className="home-main-service-content-item">
                  <i className="xi-shop xi-2x"></i>
                  <span>식당</span>
                </div>
                <div className="home-main-service-content-item">
                  <i className="xi-hotel xi-2x"></i>
                  <span>호텔</span>
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
