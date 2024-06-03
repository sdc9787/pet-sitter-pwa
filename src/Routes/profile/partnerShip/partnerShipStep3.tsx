import { useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import YouTubeVideo from "../../../Component/youtube/youtube";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";

function PartnerShipStep3() {
  //0,1,2 총 33개의 영상이 있음
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [videoIdStep, setVideoIdStep] = useState(0);

  const videoIdList = ["Poqn7w7zEeY", "DgYtDv2ewX4", "m-KQHIUxXng"];

  const progressPercentage = ((videoIdStep + 1) / videoIdList.length) * 100;

  return (
    <>
      <Topbar backUrl="/profile" title="교육 영상"></Topbar>
      <div className="w-full flex flex-col items-center">
        <YouTubeVideo videoId={videoIdList[videoIdStep]} />
        <div className="flex justify-center items-center gap-4 mt-4 px-4 w-full">
          <button
            className={`flex-1 font-bold text-white py-3 rounded-lg bg-main ${videoIdStep === 0 ? " opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (videoIdStep > 0) {
                setVideoIdStep(videoIdStep - 1);
              }
            }}
            disabled={videoIdStep === 0}>
            이전
          </button>
          <button
            className={`flex-1 font-bold text-white py-3 rounded-lg bg-main ${videoIdStep === videoIdList.length - 1 ? " opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (videoIdStep < videoIdList.length - 1) {
                setVideoIdStep(videoIdStep + 1);
              }
            }}
            disabled={videoIdStep === videoIdList.length - 1}>
            다음
          </button>
        </div>
        <span className="mt-4 font-bold">진행률({videoIdStep + 1}/3)</span>
        <div className="w-full bg-gray-200 h-4 rounded-full mt-2 px-4">
          <div className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "퀴즈 풀기",
          color: "bg-main",
          onClick: () => {
            if (videoIdStep === 2) {
              navigate("/profile/partnerShip/step4");
            } else {
              alertBox("영상을 모두 시청해주세요.");
            }
          },
        }}></ActionBtn>
    </>
  );
}

export default PartnerShipStep3;
