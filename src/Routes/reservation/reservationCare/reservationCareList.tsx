import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { RootState } from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Loading from "../../../Component/loading/loading";

type CareList = {
  carePostId: number;
  caregiverNickname: string;
  caregiverRating: number;
  caregiverReviewCount: number;
  title: string;
  administrativeAddress1: string;
  administrativeAddress2: string;
  distance: number;
  careImages: string[];
};

function ReservationCareList() {
  const [loading1, setLoading1] = useState<boolean>(true); //로딩
  const [loading2, setLoading2] = useState<boolean>(true); //로딩

  const page = 1;
  const alertBox = useAlert();
  const locate = useSelector((state: RootState) => state.reservationCare);
  const navigate = useNavigate();
  const [careList, setCareList] = useState<CareList[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number[]>([]);
  const [progress, setProgress] = useState<boolean>(false);

  useEffect(() => {
    instanceJson
      .get("/mypage/status")
      .then((res) => {
        console.log(res.data);
        if (res.data["유저로서돌봄진행중수"]) {
          setProgress(true);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading1(false);
      });
  }, []);

  useEffect(() => {
    instanceJson
      .post("/care/list", {
        page: page,
        administrativeAddress1: locate.administrativeAddress1,
        administrativeAddress2: locate.administrativeAddress2,
        homeLatitude: locate.latitude,
        homeLongitude: locate.longitude,
      })
      .then((r: any) => {
        setCareList(r.data.posts.content);
        setCurrentImageIndex(new Array(r.data.posts.content.length).fill(0));
        console.log(r.data.posts.content);
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading2(false);
      });
  }, [locate]);

  const handlePreviousImage = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[index] = newIndexes[index] > 0 ? newIndexes[index] - 1 : newIndexes[index];
      return newIndexes;
    });
  };

  const handleNextImage = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[index] = newIndexes[index] < careList[index].careImages.length - 1 ? newIndexes[index] + 1 : newIndexes[index];
      return newIndexes;
    });
  };

  if (loading1 || loading2) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl="/reservation/care" title="돌봄 예약" />
      <div className="w-full h-screen">
        <div className="mt-20">
          {careList.map((care, index) => (
            <div onClick={() => navigate(`/reservation/care/detail/${care.carePostId}`)} key={index} className="flex flex-col p-4">
              <div className="relative w-full mt-3 flex items-center justify-center h-60 overflow-hidden ">
                <button onClick={(event) => handlePreviousImage(index, event)} className="absolute left-0 rounded-full p-2">
                  <i className="xi-angle-left-min xi-2x font-bold"></i>
                </button>
                <img src={care.careImages[currentImageIndex[index]]} alt="care" className="w-full h-full object-cover rounded-md" />
                <button onClick={(event) => handleNextImage(index, event)} className="absolute right-0 rounded-full p-2">
                  <i className="xi-angle-right-min xi-2x font-bold"></i>
                </button>
              </div>
              <div className="w-full mt-4">
                <div className="text-lg font-bold">{care.title}</div>
                <div className="flex justify-start items-center gap-1">
                  <div className="text-lg font-bold">{care.caregiverNickname}</div>
                  <div className="flex items-center justify-center ml-1">
                    <i className="xi-star text-main"></i>
                    <div className="text-base font-bold">{care.caregiverRating}</div>
                  </div>
                  <div className="text-base font-bold text-zinc-500 underline ml-1">리뷰 {care.caregiverReviewCount}개</div>
                  <div className="text-base font-semibold text-gray-600">{care.administrativeAddress1}</div>
                  <div className="text-base font-semibold text-gray-600">{care.administrativeAddress2}</div>
                  <div className="text-sm text-gray-600">{care.distance.toFixed(2)} km</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ActionBtn
        buttonCount={2}
        button1Props={{
          text: "진행중인 내역",
          onClick: () => {
            progress ? navigate("/reservation/care/progress") : alertBox("진행중인 돌봄이 없습니다.");
          },
          color: progress ? "bg-main" : "bg-zinc-400",
        }}
        button2Props={{
          text: "예약내역",
          onClick: () => navigate("/reservation/care/apply/list"),
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationCareList;
