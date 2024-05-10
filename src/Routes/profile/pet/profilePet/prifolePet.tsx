import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../../../../Component/topbar/topbar";

function PetProfile() {
  const navigator = useNavigate(); //페이지 이동
  //현재 연도
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [petProfile, setPetProfile] = useState([]); //펫 정보

  //펫 정보 가져오기
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/mypage/pet/list`, {
        headers: {
          "Content-Type": "application/json",
          "Content-Encoding": "charset=UTF-8",
          Authorization: `${localStorage.getItem("Authorization")}`,
          refresh_token: `${localStorage.getItem("refresh_token")}`,
        },
      })
      .then((r: any) => {
        setPetProfile(r.data.petList);
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
      <div className="w-full h-screen p-5">
        <Topbar title="반려동물 프로필" backUrl="/profile"></Topbar>
        {/* 반려동물 정보 */}
        <div className="mt-16"></div>
        {petProfile.map((pet: any, index: number) => {
          return (
            <div key={index} onClick={() => {}} className="w-full h-32 bg-white flex justify-between items-center p-5 rounded-lg shadow-md mb-5">
              <div className="flex items-center">
                <img className="w-20 h-20 rounded-full" src={pet.petImage} alt="pet-profile" />
                <div className="ml-5">
                  <h1 className="font-extrabold">{pet.petName}</h1>
                  <div className="flex justify-center items-center">
                    <span className="text-gray-400 text-sm">{pet.species}&nbsp;/&nbsp;</span>
                    <span className="text-gray-400 text-sm">{pet.gender == "male" ? "남" : "여"}&nbsp;/&nbsp;</span>
                    <span className="text-gray-400 text-sm">{currentYear - pet.birthYear}살</span>
                  </div>
                </div>
              </div>
              <i
                onClick={() => {
                  navigator(`/profile/petProfile/detail/${pet.id}`);
                }}
                className="xi-angle-right-min xi-2x p-4"></i>
            </div>
          );
        })}

        {/* 반려동물 등록 버튼*/}
        <button
          className="flex justify-center items-center fixed right-4 bottom-24 rounded-full bg-main p-2 text-white"
          onClick={() => {
            navigator("/profile/petRegister");
          }}>
          <i className="z-30 xi-plus-min xi-x "></i>
          <span className="pr-2 font-bold text-sm">펫 등록</span>
        </button>
      </div>
    </>
  );
}

export default PetProfile;
