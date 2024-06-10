import { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Component/loading/loading";
import { useAlert } from "../../../hook/useAlert/useAlert";

type WalkReviewListType = {
  id: number;
  walkRecodeId: number;
  userNickname: string;
  walkerNickname: string;
  content: string;
  rating: number;
  reviewDate: string;
  walkTime: number;
  imgUrl: string;
};

type CareReviewListType = {
  id: number;
  careRecodeId: number;
  userNickname: string;
  caregiverNickname: string;
  content: string;
  rating: number;
  reviewDate: string;
  petSpecies: string;
  imgUrl: string;
};

function WalkReviewListMain() {
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [selectedTab, setSelectedTab] = useState("산책");
  const [careReviewList, setCareReviewList] = useState<CareReviewListType[]>([]);
  const [walkReviewList, setWalkReviewList] = useState<WalkReviewListType[]>([]);

  //리뷰 리스트 가져오기
  useEffect(() => {
    //산책 리뷰 리스트 가져오기
    instanceJson
      .get("/review/walk/myWrite")
      .then((res) => {
        setWalkReviewList(res.data.walkReviewList);
        console.log(res.data.walkReviewList);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    //돌봄 리뷰 리스트 가져오기
    instanceJson
      .get("/review/care/myWrite")
      .then((res) => {
        setCareReviewList(res.data.careReviewList);
        console.log(res.data.careReviewList);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //탭 상태 변경
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  // 별점 렌더링
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: rating }, (_, index) => (
          <i key={index} className="xi-star xi-x text-main"></i>
        ))}
      </div>
    );
  };

  const walkReviewDelete = (id: number) => {
    instanceJson
      .get(`/review/delete/walk?walk_review_id=${id}`)
      .then((res) => {
        alertBox("리뷰가 삭제되었습니다.");
        setWalkReviewList((prevList) => prevList.filter((review) => review.id !== id));
        console.log(res);
      })
      .catch((err) => {
        alertBox("리뷰 삭제에 실패했습니다.");
        console.log(err);
      });
  };

  const careReviewDelete = (id: number) => {
    instanceJson
      .get(`/review/delete/care?care_review_id=${id}`)
      .then((res) => {
        alertBox("리뷰가 삭제되었습니다.");
        setCareReviewList((prevList) => prevList.filter((review) => review.id !== id));
        console.log(res);
      })
      .catch((err) => {
        alertBox("리뷰 삭제에 실패했습니다.");
        console.log(err);
      });
  };

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl="/profile" title="내가 쓴 리뷰" />
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
        <div className="relative w-full h-full flex flex-col items-center justify-start overflow-x-hidden">
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300 ${selectedTab === "산책" ? "transform translate-x-0" : "transform -translate-x-full"}`}>
            {walkReviewList.length > 0 ? (
              walkReviewList.map((review) => (
                <div key={review.id} className="flex flex-col gap-1 items-start bg-gray-800 p-4 m-2 rounded-lg shadow-md">
                  {review.imgUrl ? <img src={review.imgUrl} alt="Walk" className="w-full h-40 object-cover rounded-lg mb-2" /> : null}

                  {/* <img src={review.imgUrl} alt="Walk" className="w-full h-40 object-cover rounded-lg mb-2" /> */}
                  <div className="w-full flex justify-between items-center">
                    <div className="text-zinc-500 font-semibold">{new Date(review.reviewDate).toLocaleString()}</div>
                    <i className="xi-close-min xi-x p-1 font-extrabold text-red-500" onClick={() => walkReviewDelete(review.id)}></i>
                  </div>
                  <div className="font-bold">산책러 : {review.walkerNickname}</div>
                  <div className="font-bold">산책시간: {review.walkTime}분</div>
                  <div className="mt-2">{renderRating(review.rating)}</div>
                  <div className="font-semibold mt-3">{review.content}</div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">리뷰 정보가 없어요</span>
              </div>
            )}
          </div>
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300 ${selectedTab === "돌봄" ? "transform translate-x-0" : "transform translate-x-full"}`}>
            {careReviewList.length > 0 ? (
              careReviewList.map((review) => (
                <div key={review.id} className="flex flex-col gap-1 items-start bg-gray-800 p-4 m-2 rounded-lg shadow-md">
                  <img src={review.imgUrl} alt="Care" className="w-full h-40 object-cover rounded-lg mb-2" />
                  <div className="w-full flex justify-between items-center">
                    <div className="text-zinc-500 font-semibold">{new Date(review.reviewDate).toLocaleString()}</div>
                    <i className="xi-close-min xi-x p-1 font-extrabold text-red-500" onClick={() => careReviewDelete(review.id)}></i>
                  </div>
                  <div className="font-bold">돌봄러 : {review.caregiverNickname}</div>
                  <div className="font-bold">펫 종류: {review.petSpecies}</div>
                  <div className="mt-2">{renderRating(review.rating)}</div>
                  <div className="font-semibold mt-3">{review.content}</div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-extrabold flex flex-col justify-center items-center gap-2 mt-52">
                <i className="xi-emoticon-sad-o xi-5x"></i>
                <span className="text-2xl">리뷰 정보가 없어요</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "리뷰 작성하러 가기",
          onClick: () => {
            navigate("/profile/usage/user");
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default WalkReviewListMain;
