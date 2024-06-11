import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState, setWalkTime } from "../../../Store/store";
import ActionBtn from "../../../Component/actionBtn/actionBtn";

function ReservationWalkTime() {
  const dispatch = useDispatch();
  const walkTime = useSelector((state: RootState) => state.reservationWalk.walkTime);
  const navigate = useNavigate();

  const handleTimeChange = (index: number) => {
    dispatch(setWalkTime({ walkTime: timeList[index], amount: priceList[index] }));
  };

  const timeList = [30, 60, 90, 120];
  const priceList = [15000, 25000, 30000, 35000];
  const textList = [
    ["가벼운 산책이 필요한 강아지에게 추천", "노견이거나 실외 배변이 필요한 경우", "산책 후 간단한 배식, 환경 정리만 요청 가능"],
    ["적당한 산책 시간이 필요한 강아지에게 추천", "활동적인 강아지에게 적절한 시간", "산책 후 배식, 놀이, 배변, 환경 정리 요청 가능"],
    ["보다 긴 산책 시간이 필요한 강아지에게 추천", "강아지의 에너지를 충분히 발산할 수 있는 시간", "산책 후 배식, 놀이, 배변, 환경 정리 요청 가능"],
    ["많은 활동량이 필요한 강아지에게 추천", "장시간 산책이 필요한 경우", "산책 후 배식, 놀이, 배변, 환경 정리 요청 가능"],
  ];

  return (
    <>
      <Topbar title="시간 선택" backUrl="/reservation/walk"></Topbar>
      <div className="w-full h-screen flex flex-col justify-start p-6 ">
        <span className="mt-20 text-lg mb-5 font-bold">산책 시간</span>
        <div className="flex justify-around items-center">
          {timeList.map((time, index) => {
            return (
              <div key={index} className="flex flex-col justify-center items-center">
                <div onClick={() => handleTimeChange(index)} key={index} className={`font-bold w-20 h-20 flex justify-center items-center border border-zinc-300 rounded-full border-gray-300 ${walkTime === time ? "bg-main border-main text-white" : "text-zinc-400"}`}>
                  {time}분
                </div>
                <span className="text-sm mt-2">{priceList[index].toLocaleString()}원</span>
              </div>
            );
          })}
        </div>
        <div className="h-auto bg-bdgray rounded-lg mt-7 p-5">
          {textList[walkTime / 30 - 1].map((text, index) => {
            return (
              <div key={index} className="py-1">
                <span className="font-medium text-zinc-500 text-sm">- {text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => navigate("/reservation/walk/locate"),
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationWalkTime;
