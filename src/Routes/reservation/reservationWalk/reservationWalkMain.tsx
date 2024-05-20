import { useEffect, useState, useRef } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    instanceJson
      .get("/walk/myPost")
      .then((res) => {
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

  useEffect(() => {
    if (remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime <= 0 && !walkListBool) {
      setWalkListBool(true);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [remainingTime, walkListBool]);

  return (
    <>
      <Topbar title="산책 예약" backUrl="/reservation"></Topbar>
      <div className="w-full h-screen">
        {walkListBool ? (
          <div className="h-full flex flex-col gap-5 justify-center items-center">
            <span className="text-xl font-semibold">아직 예약이 없습니다</span>
            <span>지금 바로 예약해보세요</span>
            <button onClick={() => navigate("/reservation/walk/time")} className="mb-20 px-20 py-4 bg-main text-white text-lg font-bold rounded-full">
              산책 예약
            </button>
          </div>
        ) : (
          <div className="h-full">
            <div id="map" style={{ width: "100%", height: "400px" }}></div>
            {walkData && (
              <div className="p-4">
                <div className="mb-4 p-4 border rounded shadow">
                  <h3 className="text-xl font-bold">{walkData.title}</h3>
                  <p>{walkData.address}</p>
                  <p>{walkData.detailAddress}</p>
                  <p>남은 시간: {remainingTime}초</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ReservationWalkMain;
