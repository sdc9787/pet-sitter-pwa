import { useEffect, useState, useRef } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useDispatch } from "react-redux";
import { setWalkDataAll, setWalkTime } from "../../../Store/store";
import ActionButtons from "../../../Component/actionBtn/actionBtn";
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
  });
  const [walkListBool, setWalkListBool] = useState(true);
  const [remainingTime, setRemainingTime] = useState(300);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alertBox = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    instanceJson
      .get("/walk/myPost")
      .then((res) => {
        dispatch(setWalkDataAll(res.data));
        console.log(res.data);
        setWalkListBool(false);
        setWalkData(res.data);
        const createdDate = new Date(res.data.createDate);
        const now = new Date();
        const diff = Math.floor((createdDate.getTime() + 5 * 60 * 1000 - now.getTime()) / 1000);
        setRemainingTime(diff);
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

  // 현재 매칭된 상태인지 체크후 실행
  // useEffect(() => {
  //   if (remainingTime > 0) {
  //     intervalRef.current = setInterval(() => {
  //       setRemainingTime((prevTime) => prevTime - 1);
  //     }, 1000);
  //   } else if (remainingTime <= 0 && !walkListBool) {
  //     alertBox("산책 시간이 종료되었습니다");
  //     setWalkListBool(true);
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [remainingTime, walkListBool]);

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
        setWalkListBool(true);
      })
      .catch((err) => {
        alertBox(err.response.data);
      });
  }

  return (
    <>
      <Topbar title="산책 예약" sendText={walkListBool ? "" : "취소"} sendFunction={cancelWalk} backUrl={Number(localStorage.getItem("partnership")) === 0 ? "/reservation" : walkListBool ? "/reservation/walk/partner" : "/reservation"}></Topbar>
      <div className="w-full h-screen bg-gray-100">
        {walkListBool ? (
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
              {/*테스트용 */}
              <button className="bg-main" onClick={() => completeWalk()}>
                산책완료
              </button>
              <h3 className="text-2xl font-bold text-main mb-2">{walkData.title}</h3>

              <p className="font-medium text-gray-700 mb-4">{walkData.content}</p>
              <div className="w-full flex flex-col justify-center items-start gap-2 mb-4">
                <p className="font-medium text-gray-600">현재 주소: {walkData.address}</p>
                <p className="font-medium text-gray-600">상세 주소: {walkData.detailAddress}</p>
              </div>
              <p className="font-semibold text-red-500 mb-20">남은 시간: {remainingTime}초</p>

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
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReservationWalkMain;
