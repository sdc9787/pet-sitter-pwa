import { useEffect, useState } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";

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

type ConfirmedApplier = {
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

function ReservationCarePartnerApplier() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [applierList, setApplierList] = useState<Applier[]>([]); // 신청자 리스트
  const [cfapplyList, setCfapplyList] = useState<ConfirmedApplier[]>([]); // 확정 신청자 리스트
  const [selectedTab, setSelectedTab] = useState("확정");

  useEffect(() => {
    // 신청자 리스트 가져오기
    instanceJson
      .get("/care/myPost/applier")
      .then((res) => {
        console.log(res.data);
        setApplierList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // 확정 신청자 리스트 가져오기
    instanceJson
      .get("/care/myPost/reservation")
      .then((res) => {
        console.log(res.data);
        setCfapplyList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAccept = (careMatchingId: number) => {
    instanceJson
      .get(`/care/accept?careMatchingId=${careMatchingId}`)
      .then((res) => {
        if (res.data) {
          alertBox("수락되었습니다.");
          setSelectedTab("확정");
          instanceJson
            .get("/care/myPost/reservation")
            .then((res) => {
              console.log(res.data);
              setCfapplyList(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <Topbar title="신청자 관리" backUrl="/reservation/care/partner"></Topbar>
      <div className="flex flex-col justify-start items-center w-full h-screen gap-4 overflow-x-hidden">
        <div className="relative w-full mt-18 h-12 bg-white text-center flex justify-evenly items-center">
          <div className={`absolute top-0 h-full w-1/3 transition-transform duration-300 ${selectedTab === "확정" ? "transform -translate-x-2/3" : "transform translate-x-2/3"} bg-white border-b-4 border-black`} />
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "확정" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("확정")}>
            확정
          </div>
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "신청자" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("신청자")}>
            신청자
          </div>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-start overflow-x-hidden">
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300 ${selectedTab === "확정" ? "transform translate-x-0" : "transform -translate-x-full"}`}>
            {cfapplyList.length > 0 ? (
              cfapplyList.map((applier) => (
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
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">확정된 이용자가 없어요</span>
              </div>
            )}
          </div>
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300 ${selectedTab === "신청자" ? "transform translate-x-0" : "transform translate-x-full"}`}>
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
                      handleAccept(applier.careMatchingId);
                    }}
                    className={"px-4 py-2 font-bold text-white rounded-lg w-full bg-main"}>
                    수락
                  </button>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">신청자가 없어요</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReservationCarePartnerApplier;
