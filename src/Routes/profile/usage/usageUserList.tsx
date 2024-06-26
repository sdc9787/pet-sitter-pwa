import { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Loading from "../../../Component/loading/loading";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import { useNavigate } from "react-router-dom";

type WalkUsageListType = {
  walkRecodeId: number;
  userNickname: string;
  userImage: string;
  walkerNickname: string;
  walkerImage: string;
  petName: string;
  walkTime: number;
  endTime: string;
  amount: number;
  review: boolean;
  status: number;
};

type CareUsageListType = {
  careRecodeId: number;
  userNickname: string;
  userImage: string;
  caregiverNickname: string;
  caregiverImage: string;
  petName: string;
  startDate: string;
  amount: number;
  review: boolean;
  status: number;
};

function UsageUserList() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [selectedTab, setSelectedTab] = useState("산책");
  const [loading, setLoading] = useState(true);
  const [walkUsageList, setWalkUsageList] = useState<WalkUsageListType[]>([]);
  const [careUsageList, setCareUsageList] = useState<CareUsageListType[]>([]);
  const partnerShip = localStorage.getItem("partnership");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (partnerShip === "0" || partnerShip === "1") {
          // Fetch Walk Usage List
          res = await instanceJson.get("/usageDetails/walk/list");
          setWalkUsageList(res.data.walkUsageList);
          console.log(res.data.walkUsageList);
          // Fetch Care Usage List
          res = await instanceJson.get("/usageDetails/care/list");
          setCareUsageList(res.data.careUsageList);
          console.log(res.data.careUsageList);
        } else {
          alertBox("정보를 불러오는데 실패했습니다");
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isWithin24Hours = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = now.getTime() - end.getTime();
    return diff <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric", weekday: "short" };
    return date.toLocaleDateString("ko-KR", options);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Topbar backUrl="/profile" title="이용자 이용내역" />
      <div className="flex flex-col justify-start items-center w-full h-screen gap-4 overflow-x-hidden">
        <div className="relative w-full mt-18 h-12 bg-white text-center flex justify-evenly items-center">
          <div className={`absolute top-0 h-full w-1/3 transition-transform duration-300 ${selectedTab === "산책" ? "transform -translate-x-2/3" : "transform translate-x-2/3"} bg-white border-b-4 border-black`} />
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "산책" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("산책")}>
            산책
          </div>
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "돌봄" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("돌봄")}>
            돌봄
          </div>
        </div>
        <div className="relative w-full h-full flex items-center justify-center overflow-x-hidden">
          {/* 산책 이용내역 */}
          <div className={`absolute top-0 text-center w-full h-full transition-transform duration-300 ${selectedTab === "산책" ? "transform translate-x-0" : "transform -translate-x-full"}`}>
            {walkUsageList.length > 0 ? (
              walkUsageList.map((usage) => (
                <div key={usage.walkRecodeId} className="flex flex-col items-start justify-center gap-2 bg-gray-800 p-4 my-2 rounded-lg shadow-md">
                  <div className="w-full flex justify-between items-center">
                    <div className="gap-2 flex justify-start items-end">
                      <div className="font-semibold">{formatDate(usage.endTime)}</div>
                      <div className={"text-sm font-semibold " + (usage.review == false && usage.status == 4 ? "text-red-500" : "text-main")}>{usage.review == false && usage.status == 4 ? "취소" : "산책완료"}</div>
                    </div>
                    <div onClick={() => navigate(`/profile/usage/walk/detail/${usage.walkRecodeId}`)} className="p-1 px-2 text-xs font-semibold border border-zinc-500 rounded-full">
                      상세내역
                    </div>
                  </div>
                  <div className="w-full flex items-center mb-2">
                    <img src={usage.walkerImage} alt="User" className="w-16 h-16 rounded-full mr-4" />
                    <div className="w-full flex flex-col items-start justify-center gap-1">
                      <div className="text-lg font-bold">{usage.walkerNickname}</div>
                      <div className="w-full flex flex-col justify-center items-start mb-2">
                        <div className="font-semibold">펫 이름 : {usage.petName}</div>
                        <div className="font-semibold">산책 시간 : {usage.walkTime} 분</div>
                        <div className="font-semibold">{usage.review == false && usage.status == 4 ? "" : "결제 포인트 : " + usage.amount.toLocaleString() + " P"}</div>
                      </div>
                    </div>
                  </div>
                  {isWithin24Hours(usage.endTime) && usage.status == 3 && (
                    <button
                      onClick={() => {
                        if (usage?.review) {
                          alertBox("이미 리뷰를 작성하셨습니다");
                          return;
                        }
                        navigate(`/profile/review/walk/create/${usage.walkRecodeId}`);
                      }}
                      className={"mt-2 px-4 py-2 font-bold text-white rounded-lg w-full " + (usage?.review ? "bg-zinc-400" : "bg-main")}>
                      {usage?.review ? "리뷰 작성 완료" : "리뷰 작성"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">이용내역이 없어요</span>
              </div>
            )}
          </div>

          {/* 돌봄 이용내역 */}
          <div className={`absolute top-0 text-center w-full h-full transition-transform duration-300 ${selectedTab === "돌봄" ? "transform translate-x-0" : "transform translate-x-full"}`}>
            {careUsageList.length > 0 ? (
              careUsageList.map((usage) => (
                <div key={usage.careRecodeId} className="flex flex-col items-start justify-center gap-2 bg-gray-800 p-4 my-2 rounded-lg shadow-md">
                  <div className="w-full flex justify-between items-center">
                    <div className="gap-2 flex justify-start items-end">
                      <div className="font-semibold">{formatDate(usage.startDate)}</div>
                      <div className={"text-sm font-semibold " + (usage.review == false && usage.status == 4 ? "text-red-500" : "text-main")}>{usage.review == false && usage.status == 4 ? "취소" : "돌봄완료"}</div>
                    </div>
                    <div onClick={() => navigate(`/profile/usage/care/detail/${usage.careRecodeId}`)} className="p-1 px-2 text-xs font-semibold border border-zinc-500 rounded-full">
                      상세내역
                    </div>
                  </div>
                  <div className="w-full flex items-center mb-2">
                    <img src={usage.caregiverImage} alt="User" className="w-16 h-16 rounded-full mr-4" />
                    <div className="w-full flex flex-col items-start justify-center gap-1">
                      <div className="text-lg font-bold">{usage.caregiverNickname}</div>
                      <div className="w-full flex flex-col justify-center items-start mb-2">
                        <div className="font-semibold">펫 이름 : {usage.petName}</div>
                        <div className="font-semibold">{usage.review == false && usage.status == 4 ? "" : "결제 포인트 : " + usage.amount.toLocaleString() + " P"}</div>
                      </div>
                    </div>
                  </div>
                  {isWithin24Hours(usage.startDate) && usage.status == 3 && (
                    <button
                      onClick={() => {
                        if (usage?.review) {
                          alertBox("이미 리뷰를 작성하셨습니다");
                          return;
                        }
                        navigate(`/profile/review/care/create/${usage.careRecodeId}`);
                      }}
                      className={"mt-2 px-4 py-2 font-bold text-white rounded-lg w-full " + (usage?.review ? "bg-zinc-400" : "bg-main")}>
                      {usage?.review ? "리뷰 작성 완료" : "리뷰 작성"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">이용내역이 없어요</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {partnerShip === "0" ? (
        <div></div>
      ) : (
        <ActionBtn
          buttonCount={2}
          button1Props={{
            text: "이용자",
            onClick: () => {},
            color: "bg-main",
          }}
          button2Props={{
            text: "파트너",
            onClick: () => {
              navigate("/profile/usage/partner");
            },
            color: "bg-zinc-400",
          }}
        />
      )}
    </>
  );
}

export default UsageUserList;
