import "./pet-info.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionComponent from "../../../Component/motion/motion";

function PetInfo() {
  const navgite = useNavigate(); //페이지 이동
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
        <div className="pet-info"></div>
        <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
          <i
            className="xi-angle-left-min xi-2x"
            onClick={() => {
              navgite("/setting");
            }}></i>
        </div>
        <div className="pet-info-list">12asdasd</div>
      </MotionComponent>
    </>
  );
}

export default PetInfo;
