import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useEffect, useState } from "react";
import instanceJson from "../../../../Component/axios/axiosJson";
import Topbar from "../../../../Component/topbar/topbar";
import { useDispatch } from "react-redux";
import { setCareSelectedAvailablePet } from "../../../../Store/store";

function ReservationCareApplyPet() {
  const { id } = useParams();
  const navigator = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창
  const dispatch = useDispatch();

  //현재 연도
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [petProfile, setPetProfile] = useState([]); //펫 정보

  //펫 정보 가져오기
  useEffect(() => {
    instanceJson
      .get("/mypage/pet/list")
      .then((r: any) => {
        setPetProfile(r.data.petList);
      })
      .catch((error: any) => {
        alertBox("펫 정보를 가져오는데 실패했습니다");
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="w-full h-screen p-5">
        <Topbar title="반려동물 선택" backUrl={`/reservation/care/apply/date/${id}`}></Topbar>
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
                  dispatch(setCareSelectedAvailablePet(pet.id));
                  navigator(`/reservation/care/apply/post/${id}`);
                }}
                className="xi-angle-right-min xi-2x p-4"></i>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ReservationCareApplyPet;
