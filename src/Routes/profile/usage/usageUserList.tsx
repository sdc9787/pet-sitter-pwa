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
};

type CareUsageListType = {
  walkRecodeId: number;
  userNickname: string;
  userImage: string;
  walkerNickname: string;
  walkerImage: string;
  petName: string;
  walkTime: number;
  endTime: string;
  amount: number;

  // Add the fields for CareUsageListType based on your API response
};

function UsageUserList() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [selectedTab, setSelectedTab] = useState("산책");
  const [loading, setLoading] = useState(true);
  const [walkUsageList, setWalkUsageList] = useState<WalkUsageListType[]>([]);
  const [careUsageList, setCareUsageList] = useState<CareUsageListType[]>([]);

  useEffect(() => {
    const partnerShip = localStorage.getItem("partnership");

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
        }
        // else if (partnerShip === "1") {
        //   // Fetch Walk Partner Usage List
        //   res = await instanceJson.get("/usageDetails/walk/partner/list");
        //   setWalkUsageList(res.data.walkUsageList);
        //   console.log(res.data.walkUsageList);
        //   // Fetch Care Partner Usage List
        //   res = await instanceJson.get("/usageDetails/care/partner/list");
        //   setCareUsageList(res.data.careUsageList);
        //   console.log(res.data.careUsageList);
        // }
        else {
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Topbar backUrl="/profile" title="이용자 이용내역" />
      <div className="flex flex-col justify-start items-center w-full h-screen gap-4 overflow-x-hidden">
        <div className="relative w-full mt-18 h-12 bg-white  text-center flex justify-evenly items-center">
          <div className={`absolute top-0  h-full w-1/3 transition-transform duration-300 ${selectedTab === "산책" ? "transform -translate-x-2/3" : "transform translate-x-2/3"} bg-white border-b-4 border-black`} />
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "산책" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("산책")}>
            산책
          </div>
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10 ${selectedTab === "돌봄" ? "text-black" : "text-zinc-400"}`} onClick={() => handleTabClick("돌봄")}>
            돌봄
          </div>
        </div>
        <div className="relative mb-18 w-full h-full flex items-center justify-center overflow-x-hidden ">
          <div className={`absolute top-0 text-center w-full h-full transition-transform duration-300 ${selectedTab === "산책" ? "transform translate-x-0" : "transform -translate-x-full"}`}>
            {walkUsageList.length > 0 ? (
              walkUsageList.map((usage) => (
                <div key={usage.walkRecodeId} className="flex flex-col bg-gray-800 p-4 my-2 rounded-lg shadow-md">
                  <div className="flex items-center mb-2">
                    <img src={usage.userImage} alt="User" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <div className="text-lg font-bold">{usage.userNickname}</div>
                      <div className="text-gray-400">{new Date(usage.endTime).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <img src={usage.walkerImage} alt="Walker" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <div className="text-lg font-bold">{usage.walkerNickname}</div>
                      <div className="text-gray-400">Pet: {usage.petName}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Walk Time: {usage.walkTime} minutes</div>
                    <div className="text-lg font-bold">{usage.amount > 0 ? `${usage.amount.toLocaleString()}원` : "취소"}</div>
                  </div>
                  {isWithin24Hours(usage.endTime) && <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">리뷰 작성</button>}
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">이용내역이 없어요</span>
              </div>
            )}
          </div>
          <div className={`absolute top-0 text-center w-full h-full transition-transform duration-300 ${selectedTab === "돌봄" ? "transform translate-x-0" : "transform translate-x-full"}`}>
            {careUsageList.length > 0 ? (
              careUsageList.map((usage, index) => (
                <div key={index} className="flex flex-col bg-gray-800 p-4 my-2 rounded-lg shadow-md">
                  {/* Replace the following divs with the actual fields from careUsageList */}
                  <div className="flex items-center mb-2">
                    <img src={usage.userImage} alt="User" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <div className="text-lg font-bold">{usage.userNickname}</div>
                      <div className="text-gray-400">{new Date(usage.endTime).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <img src={usage.walkerImage} alt="Walker" className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <div className="text-lg font-bold">{usage.walkerNickname}</div>
                      <div className="text-gray-400">Pet: {usage.petName}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400">Walk Time: {usage.walkTime} minutes</div>
                    <div className="text-lg font-bold">{usage.amount > 0 ? `${usage.amount.toLocaleString()}원` : "취소"}</div>
                  </div>
                  {isWithin24Hours(usage.endTime) && <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">리뷰 작성</button>}
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
      <div className="fixed bottom-0 left-3 right-3 bg-white h-16 rounded-lg"></div>
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
    </>
  );
}

export default UsageUserList;
