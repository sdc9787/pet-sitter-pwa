import { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";

//appltList
// [
//   {
//       "careMatchingId": 13,
//       "petName": "떄철이",
//       "petImage": "https://storage.googleapis.com/swr-bucket/c35a9083-0606-4613-a017-18375fd13236",
//       "petGender": "male",
//       "petBirthYear": 2014,
//       "species": "시골잡종",
//       "weight": 10.5,
//       "neutering": true,
//       "vaccination": false,
//       "etc": "없음",
//       "amount": 40000,
//       "reservationStartDate": "2024-06-30 19:00:00",
//       "reservationEndDate": "2024-06-30 22:00:00",
//       "requestMessage": "요청사항없음"
//   }
// ]

type Applier = {
  careMatchingId: number;
  petName: string;
  petImage: string;
  petGender: string;
  petBirthYear: number;
  species: string;
  weight: number;
  neutering: boolean;
  vaccination: boolean;
  etc: string;
  amount: number;
  reservationStartDate: string;
  reservationEndDate: string;
  requestMessage: string;
};

function ReservationCareApplyList() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [selectedTab, setSelectedTab] = useState("확정");
  const [applyList, setApplyList] = useState<Applier[]>([]); //확정된 신청중 리스트
  const [applierList, setApplierList] = useState<Applier[]>([]); // 신청중 리스트

  useEffect(() => {
    instanceJson
      .get("/care/myReservation/apply")
      .then((res) => {
        console.log(res.data);
        setApplierList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    instanceJson
      .get("/care/myReservation/confirmed")
      .then((res) => {
        console.log(res.data);
        setApplyList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (applierList.length > 0) {
      setSelectedTab("신청중");
    } else if (applyList.length > 0) {
      setSelectedTab("확정");
    }
  }, [applyList, applierList]);

  //예약 확정자의 예약 취소
  const handleApplyCancel = (careMatchingId: number) => {
    instanceJson
      .get(`/care/cancel/reservation?careMatchingId=${careMatchingId}`)
      .then((res) => {
        console.log(res.data);
        alertBox("신청이 취소되었습니다.");
        navigate("/reservation/care/list");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleApplierCancel = (careMatchingId: number) => {
    instanceJson
      .get(`/care/cancel/apply?careMatchingId=${careMatchingId}`)
      .then((res) => {
        console.log(res.data);
        alertBox("신청이 취소되었습니다.");
        navigate("/reservation/care/list");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Topbar title="돌봄 예약 신청 목록" backUrl="/reservation/care/list"></Topbar>
      <div className="flex flex-col justify-start items-center w-full h-screen gap-4 overflow-x-hidden">
        <div className="relative w-full mt-18 h-12 bg-white text-center flex justify-evenly items-center">
          <div className={`absolute top-0 h-full w-1/3 transition-transform duration-300 ${selectedTab === "확정" ? "transform -translate-x-2/3" : "transform translate-x-2/3"} bg-white border-b-4 border-black`} />
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "확정" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("확정")}>
            시작 대기중
          </div>
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "신청중" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("신청중")}>
            수락 대기중
          </div>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-start overflow-x-hidden">
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300 ${selectedTab === "확정" ? "transform translate-x-0" : "transform -translate-x-full"}`}>
            {applyList.length > 0 ? (
              applyList.map((applier) => (
                <div key={applier.careMatchingId} className="flex flex-col gap-1 items-start bg-gray-800 p-4 m-2 rounded-lg shadow-md">
                  <img src={applier.petImage} alt="Care" className="border border-zinc-400  w-full h-40 object-cover rounded-lg mb-2" />
                  <div className="text-white font-bold">{applier.petName}</div>
                  <div className="">성별: {applier.petGender === "male" ? "남자" : "여자"}</div>
                  <div className="">나이: {applier.petBirthYear}</div>
                  <div className="">견종: {applier.species}</div>
                  <div className="">몸무게: {applier.weight}kg</div>
                  <div className="">중성화 여부: {applier.neutering ? "했어요" : "안했어요"}</div>
                  <div className="">예방접종: {applier.vaccination ? applier.vaccination : "안했어요"}</div>
                  <div className="">가격: {applier.amount.toLocaleString()} 원</div>
                  <div className="">
                    <h1>예약기간</h1>
                    <div>시작날짜 : {new Date(applier.reservationStartDate).toLocaleString()} </div>
                    <div>종료날짜 : {new Date(applier.reservationEndDate).toLocaleString()} </div>
                  </div>
                  <button
                    onClick={() => {
                      handleApplyCancel(applier.careMatchingId);
                    }}
                    className={"px-4 py-2 font-bold text-white rounded-lg w-full bg-red-500"}>
                    예약 취소
                  </button>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">확정된 이용자가 없어요</span>
              </div>
            )}
          </div>
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300 ${selectedTab === "신청중" ? "transform translate-x-0" : "transform translate-x-full"}`}>
            {applierList.length > 0 ? (
              applierList.map((applier) => (
                <div key={applier.careMatchingId} className="flex flex-col items-start bg-gray-800 p-4 m-2 rounded-lg shadow-md">
                  <img src={applier.petImage} alt="Care" className="border border-zinc-400  w-full h-40 object-cover rounded-lg mb-2" />
                  <div className="text-white font-bold">{applier.petName}</div>
                  <div className="">성별: {applier.petGender === "male" ? "남자" : "여자"}</div>
                  <div className="">나이: {applier.petBirthYear}</div>
                  <div className="">견종: {applier.species}</div>
                  <div className="">몸무게: {applier.weight}kg</div>
                  <div className="">중성화 여부: {applier.neutering ? "했어요" : "안했어요"}</div>
                  <div className="">예방접종: {applier.vaccination ? applier.vaccination : "안했어요"}</div>
                  <div className="">가격: {applier.amount.toLocaleString()} 원</div>
                  <div className="">
                    <h1>예약기간</h1>
                    <div>시작날짜 : {new Date(applier.reservationStartDate).toLocaleString()} </div>
                    <div>종료날짜 : {new Date(applier.reservationEndDate).toLocaleString()} </div>
                  </div>
                  <div className="text-white mt-2">Request Message: {applier.requestMessage}</div>
                  <button
                    onClick={() => {
                      handleApplierCancel(applier.careMatchingId);
                    }}
                    className={"px-4 py-2 font-bold text-white rounded-lg w-full bg-red-500"}>
                    예약 취소
                  </button>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">신청중가 없어요</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReservationCareApplyList;
