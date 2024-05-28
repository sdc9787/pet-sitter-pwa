import { useEffect, useState, useRef } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useDispatch } from "react-redux";
import { setWalkDataAll, setWalkTime } from "../../../Store/store";
import ActionBtn from "../../../Component/actionBtn/actionBtn";

interface Walk {
  id: number;
  petId: number;
  userNickname: string;
  walkTime: number;
  title: string;
  content: string;
  distance: number;
  address: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  createDate: string;
  startTime: string; // Added to match response structure
}

function ReservationWalkMain() {
  const [walkData, setWalkData] = useState<Walk>({
    id: 0,
    petId: 0,
    userNickname: "",
    walkTime: 0,
    title: "",
    content: "",
    distance: 0,
    address: "",
    detailAddress: "",
    latitude: 0,
    longitude: 0,
    createDate: "",
    startTime: "",
  });
  const [walkListBool, setWalkListBool] = useState(true);
  const [remainingTime, setRemainingTime] = useState(300);
  const [matchingTime, setMatchingTime] = useState<number>(0);
  const [matchingTimeRemaining, setMatchingTimeRemaining] = useState<number>(0); // New state for matchingTime remaining
  const [userState, setUserState] = useState<number>(0);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const matchingIntervalRef = useRef<NodeJS.Timeout | null>(null); // New ref for matchingTime interval
  const alertBox = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    instanceJson
      .get("/walk/myPost")
      .then((res) => {
        setUserState(res.data.status);
        dispatch(setWalkDataAll(res.data));
        console.log(res.data);
        setWalkListBool(false);
        setWalkData(res.data);
        const createdDate = new Date(res.data.createDate);
        const now = new Date();
        const diff = Math.floor((createdDate.getTime() + 5 * 60 * 1000 - now.getTime()) / 1000);
        setRemainingTime(diff);
        const matchingTime = new Date(res.data.startTime);
        const diff2 = Math.floor((now.getTime() - matchingTime.getTime()) / 1000);
        setMatchingTime(diff2);
        setMatchingTimeRemaining(diff2); // Initialize matchingTimeRemaining
      })
      .catch((err) => {
        if (err.response.data === "작성한 게시글이 없습니다") setWalkListBool(true);
      });
  }, []);

  useEffect(() => {
    if (walkData.latitude && walkData.longitude) {
      const mapContainer = document.getElementById("map");

      if (mapContainer) {
        const mapOption = {
          center: new kakao.maps.LatLng(walkData.latitude, walkData.longitude),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);

        const markerPosition = new kakao.maps.LatLng(walkData.latitude, walkData.longitude);
        const marker = new kakao.maps.Marker({ position: markerPosition });
        marker.setMap(map);
      } else {
        console.error("Map container not found");
      }
    }
  }, [walkData]);

  // Timer for remaining time
  useEffect(() => {
    if (remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime <= 0 && !walkListBool && userState == 0) {
      alertBox("산책 시간이 종료되었습니다");
      setWalkListBool(true);
      navigate("/reservation");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [remainingTime, walkListBool]);

  // Timer for matching time
  useEffect(() => {
    if (userState === 2 && matchingTime > 0) {
      matchingIntervalRef.current = setInterval(() => {
        setMatchingTimeRemaining((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (matchingIntervalRef.current) {
        clearInterval(matchingIntervalRef.current);
      }
    };
  }, [userState, matchingTime]);

  //산책글 취소
  function cancelWalk() {
    instanceJson
      .get(`/walk/delete/${walkData.id}`)
      .then((res) => {
        alertBox("산책 매칭이 취소되었습니다");
        setWalkListBool(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //산책 완료 버튼
  function completeWalk() {
    instanceJson
      .get(`/walk/complete/${walkData.id}`)
      .then((res) => {
        alertBox("산책이 완료되었습니다");
        navigate("/reservation");
        setWalkListBool(true);
      })
      .catch((err) => {
        alertBox(err.response.data);
      });
  }

  //문제 이용시 문의 버튼
  function reportWalk() {
    instanceJson
      .post(`/walk/incomplete/${walkData.id}`, { reason: "문제신고" })
      .then((res) => {
        alertBox("문제가 신고되었습니다");
      })
      .catch((err) => {
        alertBox(err.response.data);
      });
  }

  return (
    <>
      <Topbar title="산책 예약" sendText={userState == 0 && !walkListBool ? "취소" : ""} sendFunction={cancelWalk} backUrl={Number(localStorage.getItem("partnership")) === 0 ? "/reservation" : walkListBool ? "/reservation/walk/partner" : "/reservation"}></Topbar>
      <div className="w-full h-screen bg-gray-100">
        {walkListBool == true && !matchingTimeRemaining ? (
          <div className="h-full flex flex-col gap-5 justify-center items-center">
            <span className="text-xl font-semibold">아직 예약이 없습니다</span>
            <span>지금 바로 예약해보세요</span>
            <button onClick={() => navigate("/reservation/walk/time")} className="mb-20 px-20 py-4 bg-main text-white text-lg font-bold rounded-full">
              산책 예약
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center">
            <div id="map" className="w-full shadow-topbar" style={{ flexGrow: 8 }}></div>
            <div className="w-full p-4 flex flex-col items-start justify-between relative bg-white shadow-lg rounded-lg" style={{ flexGrow: 2 }}>
              <h3 className="text-2xl font-bold text-main mb-2">{walkData.title}</h3>
              <p className="font-medium text-gray-700 mb-4">{walkData.content}</p>
              <div className="w-full flex flex-col justify-center items-start gap-2 mb-4">
                <p className="font-medium text-gray-600">현재 주소: {walkData.address}</p>
                <p className="font-medium text-gray-600">상세 주소: {walkData.detailAddress}</p>
              </div>

              {userState == 2 ? (
                <p className="font-semibold text-blue-500 mb-20">
                  <span>매칭 시간: {Math.floor(matchingTimeRemaining / 60)}분/</span>
                  <span>{walkData.walkTime}분</span>
                </p>
              ) : userState == 0 ? (
                <p className="font-semibold text-red-500 mb-20">남은 시간: {remainingTime}초</p>
              ) : (
                <p className="font-semibold text-blue-500 mb-20">파트너 수락 대기중...</p>
              )}
              {userState == 0 ? (
                <ActionBtn
                  buttonCount={2}
                  button1Props={{
                    text: "수정",
                    onClick: () => navigate(`/reservation/walk/edit/time/${walkData.id}`),
                    color: "bg-zinc-400",
                  }}
                  button2Props={{
                    text: "신청내역확인",
                    onClick: () => navigate(`/reservation/walk/applier/${walkData.id}`),
                    color: "bg-main",
                  }}
                />
              ) : userState == 1 ? (
                <ActionBtn
                  buttonCount={1}
                  button1Props={{
                    text: "파트너 산책 시작 대기중",
                    onClick: () => reportWalk(),
                    color: "bg-zinc-400",
                  }}></ActionBtn>
              ) : (
                <ActionBtn
                  buttonCount={2}
                  button1Props={{
                    text: "문제신고",
                    onClick: () => reportWalk(),
                    color: "bg-red-500",
                  }}
                  button2Props={{
                    text: "인계완료",
                    onClick: () => completeWalk(),
                    color: "bg-main",
                  }}></ActionBtn>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReservationWalkMain;
