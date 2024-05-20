import { useEffect, useState, useRef } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useGeolocation } from "../../../../hook/useGeolocation/useGeolocation";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";

interface WalkList {
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

function ReservationWalkPartnerMain() {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const { latitude, longitude } = useGeolocation();
  const [page, setPage] = useState<number>(1);
  const [distance, setDistance] = useState<number>(5);
  const [walkList, setWalkList] = useState<WalkList[]>([]);
  const [selectedWalkId, setSelectedWalkId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTimes, setRemainingTimes] = useState<number[]>([]);

  const reservationListApi = () => {
    instanceJson
      .post("/walk/list", { now_latitude: latitude, now_longitude: longitude, page: page, max_distance: distance })
      .then((res) => {
        setWalkList(res.data.content);
        const times = res.data.content.map((walk: WalkList) => {
          const createdDate = new Date(walk.createDate);
          const now = new Date();
          return Math.floor((createdDate.getTime() + 5 * 60 * 1000 - now.getTime()) / 1000);
        });
        setRemainingTimes(times);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          alertBox("파트너쉽 권한이 없습니다.");
        } else if (err.response.status === 400) {
          alertBox("주변에 산책 매칭이 없습니다.");
        }
        console.log(err);
      });
  };

  useEffect(() => {
    if (latitude !== null) {
      reservationListApi();
    }
  }, [latitude]);

  useEffect(() => {
    if (remainingTimes.some((time) => time > 0)) {
      intervalRef.current = setInterval(() => {
        setRemainingTimes((prevTimes) => prevTimes.map((time) => time - 1));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [remainingTimes]);

  useEffect(() => {
    if (latitude && longitude) {
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        const mapOption = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        const userPosition = new kakao.maps.LatLng(latitude, longitude);
        const userMarker = new kakao.maps.Marker({ position: userPosition });
        userMarker.setMap(map);

        walkList.forEach((walk) => {
          const markerPosition = new kakao.maps.LatLng(walk.latitude, walk.longitude);
          const marker = new kakao.maps.Marker({ position: markerPosition });
          marker.setMap(map);
          kakao.maps.event.addListener(marker, "click", () => {
            setSelectedWalkId(walk.id);
          });
        });
      } else {
        console.error("Map container not found");
      }
    }
  }, [latitude, longitude, walkList]);

  return (
    <>
      <Topbar backUrl="/reservation" title="산책 매칭"></Topbar>
      <div className="mt-20">
        <div id="map" style={{ width: "100%", height: "400px" }}></div>
        {walkList.map((item, index) => (
          <div key={item.id} className={`mb-4 p-4 border rounded shadow ${selectedWalkId === item.id ? "bg-main" : ""}`} onClick={() => setSelectedWalkId(item.id)}>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p>{item.address}</p>
            <p>{item.detailAddress}</p>
            <p>남은 시간: {remainingTimes[index]}초</p>
          </div>
        ))}
      </div>
      <button className="fixed right-3 bottom-24 rounded-full bg-main p-1 text-white" onClick={() => navigate("/reservation/walk")}>
        <i className="xi-plus-min xi-3x"></i>
      </button>
    </>
  );
}

export default ReservationWalkPartnerMain;
