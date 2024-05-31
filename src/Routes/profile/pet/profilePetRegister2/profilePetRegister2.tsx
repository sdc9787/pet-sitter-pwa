import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../../../Component/topbar/topbar";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import instanceJson from "../../../../Component/axios/axiosJson";

const PetRegister2 = () => {
  const navigate = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창

  const { id } = useParams(); //파라미터값 가져오기
  const [weight, setWeight] = useState<string>(""); //몸무게
  const [neutering, setNeutering] = useState<boolean>(false); //중성화여부
  const [animalHospital, setAnimalHospital] = useState<string>(""); //동물병원
  const [vaccination, setVaccination] = useState<string>("접종하지 않았습니다"); //예방접종
  const [etc, setEtc] = useState<string>(""); //기타

  const [checkListState, setCheckListState] = useState<boolean>(false); //체크리스트 상태
  const [checkList, setCheckList] = useState([
    { id: 1, name: "광견병", checked: false },
    { id: 2, name: "코로나", checked: false },
    { id: 3, name: "켄넬코프", checked: false },
    { id: 4, name: "종합백신", checked: false },
    { id: 5, name: "접종하지 않았습니다", checked: false },
  ]); //체크리스트

  useEffect(() => {
    // 체크리스트 체크여부 확인
    const checkedItems = checkList
      .filter((list) => list.checked)
      .map((list) => list.name)
      .join(", ");

    setVaccination(checkedItems);
  }, [checkList]);
  useEffect(() => {
    console.log(vaccination);
  }, [vaccination]);
  //펫정보 등록api
  const handleSubmit = () => {
    console.log({ id, weight, neutering, animalHospital, vaccination, etc });
    //정보를 기입하지 않았을때
    if (weight === "" || animalHospital === "") {
      alertBox("몸무게와 동물병원을 기입해주세요.");
      return;
    }

    instanceJson
      .post("/mypage/pet/edit/step2", { id: id, weight: weight, neutering: neutering, animalHospital: animalHospital, vaccination: vaccination, etc: etc })
      .then((r: any) => {
        console.log(r.data);
        alertBox("펫 정보를 등록했습니다.");
        navigate("/profile/petProfile");
      })
      .catch((error: any) => {
        alertBox("펫 정보를 등록하지 못했습니다.");
        console.error(error);
      });
  };

  return (
    <>
      <Topbar backUrl="/profile/petProfile" title="펫 추가정보 등록" sendText="완료" sendFunction={handleSubmit}></Topbar>
      <div className="bg-white w-full h-screen flex flex-col justify-start items-center">
        <div className="flex flex-col justify-start items-start w-full gap-7">
          <div className="flex flex-col mt-20 w-full p-6 gap-7">
            {/*몸무게*/}
            <div className="ml-1 font-black">
              <span>몸무게</span>
              <input
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                placeholder="예) 4"
                className="mt-2 border-2 rounded-lg border-stone-400 w-full p-3 font-bold"
                type="text"
              />
            </div>
            {/*동물병원*/}
            <div className="ml-1 font-black">
              <span>동물병원</span>
              <input
                onChange={(e) => {
                  setAnimalHospital(e.target.value);
                }}
                placeholder="예) **동물병원 (**동)"
                className="mt-2 border-2 rounded-lg border-stone-400 w-full p-3 font-bold"
                type="text"
              />
            </div>
            {/*중성화 여부*/}
            <div className="ml-1 font-black flex justify-start items-center">
              <span className="mr-5">중성화 여부</span>
              <div className=" flex items-center gap-5">
                <label>
                  <input onChange={() => setNeutering(true)} checked={neutering === true} className="mr-1" type="radio" name="neutered" value="true" />
                  <span>했어요</span>
                </label>
                <label>
                  <input onChange={() => setNeutering(false)} checked={neutering === false} className="mr-1" type="radio" name="neutered" value="false" />
                  <span>안했어요</span>
                </label>
              </div>
            </div>

            {/*체크리스트*/}
            <div className="ml-1 font-black">
              <span>체크리스트</span>
              <div
                onClick={() => {
                  setCheckListState(true);
                }}
                className="bg-white shadow-button w-full rounded-md flex justify-between items-center px-6 py-4 mt-5">
                <div className="flex justify-center items-center">
                  <i className="xi-align-left xi-2x text-main mr-3"></i>
                  <span className="font-extrabold text-gray">예방접종 상태</span>
                </div>
                <i className="xi-angle-right-min xi-x text-zinc-400"></i>
              </div>
            </div>
            {/*기타*/}
            <div className="ml-1 font-black mb-20">
              <span>기타 참고사항</span>
              <textarea
                onChange={(e) => {
                  setEtc(e.target.value);
                }}
                className="mt-2 border-2 rounded-lg border-stone-400 w-full p-3 h-52 font-bold"
                placeholder="주의해야할 점이나 참고해야할 특이사항"></textarea>
            </div>
          </div>
        </div>
      </div>
      {/*체크리스트 모달*/}
      {checkListState ? (
        <>
          <div className="p-6 z-40 fixed top-0 bottom-0 right-0 left-0 w-fill h-screen bg-white flex flex-col justify-start items-start">
            <i
              onClick={() => {
                checkList.map((list: any) => {
                  list.checked = false;
                });
                setVaccination("접종하지 않았습니다");
                setCheckListState(false);
              }}
              className="fixed top-4 left-4 xi-angle-left-min xi-2x"></i>
            {/*체크리스트*/}
            <div className="mt-20 mb-2  flex justify-center items-center">
              <div className="mr-2 font-semibold text-gray text-base">예방접종 체크리스트</div>
              <span className="text-xs px-2 py-1  border text-zinc-400 font-black rounded-full">중복 선택 가능</span>
            </div>
            <div className="text-lg font-bold mb-10">필수 예방접종을 완료 하셨나요?</div>
            {checkList.map((list: any, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (index === 4) {
                      let temp = [...checkList];
                      temp.map((list: any) => {
                        list.checked = false;
                      });
                      temp[index].checked = !temp[index].checked;
                      setCheckList(temp);
                    } else {
                      let temp = [...checkList];
                      temp[4].checked = false;
                      temp[index].checked = !temp[index].checked;
                      setCheckList(temp);
                    }
                  }}
                  className={"mb-4 transition-all duration-300 ease-in-out w-full p-4 bg-white shadow-button rounded-md mt-2 flex justify-between border  items-center " + (list.checked ? " border-main text-main" : "border-white")}>
                  <span className="font-semibold">{list.name}</span>
                </div>
              );
            })}
            <button
              onClick={() => {
                setCheckListState(false);
              }}
              className="fixed bottom-2 left-2 right-2 bg-main text-white p-3 font-bold rounded-lg">
              저장및 완료
            </button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default PetRegister2;
