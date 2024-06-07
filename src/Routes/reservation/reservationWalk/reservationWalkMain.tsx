import { useEffect, useState, useRef } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
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
  startTime: string;
  userProfile: string;
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
    userProfile: "",
  });
  const [walkListBool, setWalkListBool] = useState(true);
  const [remainingTime, setRemainingTime] = useState(300);
  const [matchingTime, setMatchingTime] = useState<number>(0);
  const [matchingTimeRemaining, setMatchingTimeRemaining] = useState<number>(0);
  const [userState, setUserState] = useState<number>(0);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const matchingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const alertBox = useAlert();
  const dispatch = useDispatch();
  const partnerLocation = useSelector((state: RootState) => state.walkLocation);

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
        setMatchingTimeRemaining(diff2);
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

        // 마커 이미지 설정
        const markerImageUrl = "/img/marker1.webp";
        const partnerMarkerImageUrl = "/img/marker2.webp";

        const markerImage = new kakao.maps.MarkerImage(markerImageUrl, new kakao.maps.Size(64, 64), { alt: "Destination" });

        const partnerMarkerImage = new kakao.maps.MarkerImage(partnerMarkerImageUrl, new kakao.maps.Size(64, 64), { alt: "Partner Location" });

        // 도착 지점 마커
        const markerPosition = new kakao.maps.LatLng(walkData.latitude, walkData.longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        marker.setMap(map);

        // 파트너 위치 마커
        const partnerMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(partnerLocation.latitude, partnerLocation.longitude),
          image: partnerMarkerImage,
        });
        partnerMarker.setMap(map);

        const updatePartnerMarker = () => {
          partnerMarker.setPosition(new kakao.maps.LatLng(partnerLocation.latitude, partnerLocation.longitude));
        };

        updatePartnerMarker();
        const partnerLocationInterval = setInterval(updatePartnerMarker, 10000);

        return () => {
          clearInterval(partnerLocationInterval);
        };
      } else {
        console.error("Map container not found");
      }
    }
  }, [walkData, partnerLocation]);

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

  function cancelWalk() {
    instanceJson
      .get(`/walk/delete/${walkData.id}`)
      .then((res) => {
        alertBox("산책 매칭이 취소되었습니다");
        setWalkListBool(true);
        setMatchingTimeRemaining(0);
      })
      .catch((err) => {
        console.error(err);
      });
  }

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

  function reportWalk() {
    instanceJson
      .post(`/walk/incomplete/${walkData.id}`, { reason: "문제신고" })
      .then((res) => {
        alertBox("문제가 신고되었습니다");
        navigate("/reservation");
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
            <div id="map" className="w-full shadow-md" style={{ flexGrow: 8 }}></div>
            <div className="p-4 w-full mt-2 mb-20">
              <div className=" w-full p-4 flex flex-col items-center justify-between relative bg-zinc00 shadow-lg rounded-lg border border-zinc-200" style={{ flexGrow: 2 }}>
                {/* <img className="z-10 w-12 h-12 rounded-full border border-white absolute -top-6 flex right-1/2 translate-x-1/2 " src={walkData.userProfile} alt="" /> */}
                <h3 className="text-2xl font-bold text-main mb-2">{walkData.title}</h3>
                <p className="font-medium text-gray-700 mb-4">{walkData.content}</p>
                <div className="w-full flex flex-col justify-center items-center gap-2 mb-4">
                  <p className="font-medium text-gray-600">{walkData.address}</p>
                  <p className="font-medium text-gray-600">{walkData.detailAddress}</p>
                </div>
                {userState == 2 ? (
                  <p className="font-semibold text-blue-500">
                    <span>매칭 시간: {Math.floor(matchingTimeRemaining / 60)}분/</span>
                    <span>{walkData.walkTime}분</span>
                  </p>
                ) : userState == 0 ? (
                  <div className="self-center w-full flex flex-col justify-center items-center gap-2">
                    <p className="font-semibold text-red-500">남은 시간: {remainingTime}초</p>
                    <div className="text-zinc-400 text-sm">5분이 경과하면 자동으로 매칭이 취소됩니다</div>
                  </div>
                ) : (
                  <p className="gap-2 font-semibold text-blue-500 self-center flex flex-col justify-center items-center">
                    <div>
                      파트너 시작 대기중<i className="ml-2 xi-spinner-1 xi-spin"></i>
                    </div>
                    <div className="text-zinc-400 text-sm">파트너에게 강아지를 인계해 주세요</div>
                  </p>
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
          </div>
        )}
      </div>
    </>
  );
}

export default ReservationWalkMain;
