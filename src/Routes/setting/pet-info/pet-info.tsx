import "./pet-info.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionComponent from "../../../Component/motion/motion";
import axios from "axios";

function PetInfo() {
  const navgite = useNavigate(); //페이지 이동
  const userName = localStorage.getItem("nickname"); //유저 이름

  const [petInfo, setPetInfo] = useState("등록된 반려동물이 없습니다.");

  //펫 정보 가져오기
  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/mypage/pet-info`,
        {},
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((r: any) => {
        setPetInfo(r.data.message);
        console.log(r.data);
      });
  }, []);

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
        <div className="pet-info">
          <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
            <i
              className="xi-angle-left-min xi-2x"
              onClick={() => {
                navgite("/setting");
              }}></i>
          </div>
          <div className="pet-info-title">{userName}님의 반려동물</div>
          {petInfo === "등록된 반려동물이 없습니다." ? (
            <div className="pet-info-content">
              <div className="pet-info-content-title">{petInfo}</div>
              <div className="pet-info-content-text">함께 키우시는 반려동물 프로필을</div>
              <div className="pet-info-content-text">등록하시면 빠른 서비스 이용이 가능합니다</div>
              <button
                className="pet-info-content-button"
                onClick={() => {
                  navgite("/setting/pet-register");
                }}>
                등록하기
              </button>
            </div>
          ) : null}
        </div>
      </MotionComponent>
    </>
  );
}

export default PetInfo;
