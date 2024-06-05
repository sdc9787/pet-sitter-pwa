import { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import { useNavigate, useParams } from "react-router-dom";
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

function WalkReviewListView() {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [selectedTab, setSelectedTab] = useState("산책");
  const [walkReviewList, setWalkReviewList] = useState<WalkReviewListType[]>([]);

  //리뷰 리스트 가져오기
  useEffect(() => {
    //산책 리뷰 리스트 가져오기
    instanceJson
      .get(`/review/walk/list?partner_id=${id}`)
      .then((res) => {
        setWalkReviewList(res.data.walkReviewList);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl="/reservation/walk" title={walkReviewList[0].walkerNickname + "님의 리뷰 목록"} />
      <div className="flex flex-col justify-start items-center w-full h-screen gap-4 overflow-x-hidden">
        <div className="relative w-full mt-18 h-12 bg-white text-center flex justify-evenly items-center">
          <div className={`absolute top-0 h-full w-1/2 transition-transform duration-300 bg-white border-b-4 border-black`} />
          <div className={`text-xl transition-all ease-in-out duration-300 font-bold w-1/3 py-3 z-10`}>산책</div>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-start overflow-x-hidden">
          <div className={`absolute top-0 left-0 w-full transition-transform duration-300`}>
            {walkReviewList.length > 0 ? (
              walkReviewList.map((review) => (
                <div key={review.id} className="flex flex-col gap-1 items-start bg-gray-800 p-4 m-2 rounded-lg shadow-md">
                  <img src={review.imgUrl} alt="Walk" className="w-full h-40 object-cover rounded-lg mb-2" />
                  <div className="text-zinc-500 font-semibold">{new Date(review.reviewDate).toLocaleString()}</div>
                  <div className="font-bold">이용자 : {review.userNickname}</div>
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
        </div>
      </div>
    </>
  );
}

export default WalkReviewListView;
