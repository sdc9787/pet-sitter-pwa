import { useEffect, useState, useRef } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useGeolocation } from "../../../../hook/useGeolocation/useGeolocation";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";

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
  const [isAllTimersExpired, setIsAllTimersExpired] = useState<boolean>(true);

  useEffect(() => {
    instanceJson
      .get("/walk/myPost")
      .then((res) => {
        navigate("/reservation/walk");
      })
      .catch((err) => {
        if (err.response.status === 400) {
        }
      });
  }, []);

  const reservationListApi = () => {
    instanceJson
      .post("/walk/list", { now_latitude: latitude, now_longitude: longitude, page: page, max_distance: distance })
      .then((res) => {
        console.log(res.data);
        setIsAllTimersExpired(false);
        setWalkList(res.data.content);
        const times = res.data.content.map((walk: WalkList) => {
          const createdDate = new Date(walk.createDate);
          const now = new Date();
          return Math.floor((createdDate.getTime() + 5 * 60 * 1000 - now.getTime()) / 1000);
        });
        setRemainingTimes(times);
        setIsAllTimersExpired(times.every((time: any) => time <= 0));
      })
      .catch((err) => {
        if (err.response.status === 403) {
          alertBox("파트너쉽 권한이 없습니다.");
        } else if (err.response.status === 400) {
          alertBox("주변에 산책 매칭이 없습니다.");
          setIsAllTimersExpired(true);
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
        setRemainingTimes((prevTimes) => {
          const updatedTimes = prevTimes.map((time) => time - 1);
          const allTimersExpired = updatedTimes.every((time) => time <= 0);
          setIsAllTimersExpired(allTimersExpired);
          return updatedTimes;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [remainingTimes]);

  useEffect(() => {
    if (latitude && longitude && walkList.length > 0) {
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
      <div className="w-full h-screen bg-gray-100">
        {isAllTimersExpired ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-xl font-bold">주변에 산책 글이 없습니다</p>
          </div>
        ) : (
          <div className="h-full">
            <div id="map" className="w-full h-64 mb-4 shadow-lg rounded-lg"></div>
            <div className="px-4">
              {walkList.map((item, index) => (
                <div key={item.id} className={`mb-4 p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${selectedWalkId === item.id ? "bg-main text-white" : "bg-white"}`} onClick={() => setSelectedWalkId(item.id)}>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm">{item.address}</p>
                  <p className="text-sm">{item.detailAddress}</p>
                  <p className="text-sm text-red-500">남은 시간: {remainingTimes[index]}초</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ActionBtn
        buttonCount={2}
        button1Props={{
          text: "신청글 작성",
          color: "bg-zinc-400",
          onClick: () => {
            navigate("/reservation/walk");
          },
        }}
        button2Props={{
          text: "예약 신청",
          color: "bg-main",
          onClick: () => {
            navigate("/reservation/walk");
          },
        }}></ActionBtn>
    </>
  );
}

export default ReservationWalkPartnerMain;
