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
  const [applyList, setApplyList] = useState<WalkList[]>([]); // 신청한 산책 리스트
  const [selectedWalkId, setSelectedWalkId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTimes, setRemainingTimes] = useState<number[]>([]);
  const [isAllTimersExpired, setIsAllTimersExpired] = useState<boolean>(true);

  // 파트너가 산책글 작성했는지 확인
  useEffect(() => {
    instanceJson
      .get("/walk/myPost")
      .then(() => {
        navigate("/reservation/walk");
      })
      .catch((err) => {
        if (err.response.status === 400) {
        }
      });
  }, [navigate]);

  // 예약 리스트 불러오기
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

  const reservationList = () => {
    instanceJson
      .post("/walk/myApply", { now_latitude: latitude, now_longitude: longitude })
      .then((res) => {
        console.log(res.data);
        setApplyList(res.data);
        const times = res.data.map((walk: WalkList) => {
          const createdDate = new Date(walk.createDate);
          const now = new Date();
          return Math.floor((createdDate.getTime() + 5 * 60 * 1000 - now.getTime()) / 1000);
        });
        setRemainingTimes(times);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          navigate("/reservation/walk/partner");
        }
      });
  };

  // 위치정보가 있을 때만 실행
  useEffect(() => {
    if (latitude !== null) {
      reservationListApi();
      reservationList();
    }
  }, [latitude]);

  // 1초마다 시간 감소(타이머)
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

  // 카카오맵
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

  // 예약 신청
  const requestReservation = () => {
    if (selectedWalkId) {
      instanceJson
        .get(`walk/apply/${selectedWalkId}`)
        .then((res) => {
          alertBox("예약 신청이 완료되었습니다");
          navigate("/reservation/walk/partner/list");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      alertBox("예약할 산책을 선택해주세요");
    }
  };

  // Check if there are any visible walk list items
  useEffect(() => {
    const visibleWalkList = walkList.filter((item, index) => item.id !== applyList[index]?.id);
    if (visibleWalkList.length === 0) {
      setIsAllTimersExpired(true);
    }
  }, [walkList, applyList, remainingTimes]);

  return (
    <>
      <Topbar backUrl={applyList[0]?.id ? "/reservation/walk/partner/list" : "/reservation"} title="산책 매칭"></Topbar>
      <div className="w-full h-screen bg-gray-100">
        {isAllTimersExpired ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-xl font-bold">주변에 산책 글이 없습니다</p>
          </div>
        ) : (
          <div className="h-full">
            <div id="map" className="w-full h-64 mb-4 shadow-lg rounded-lg"></div>
            <div className="px-4">
              {walkList.map((item, index) =>
                item.id !== applyList[index]?.id ? (
                  <div
                    key={item.id}
                    className={`mb-4 p-4 border ${selectedWalkId === item.id ? "border-blue-500 shadow-lg" : "border-gray-300 shadow-md"} rounded-lg cursor-pointer`}
                    onClick={() => {
                      if (selectedWalkId === item.id) {
                        setSelectedWalkId(null); // 선택을 취소합니다.
                      } else {
                        setSelectedWalkId(item.id); // 새로운 항목을 선택합니다.
                      }
                    }}>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm">{item.address}</p>
                    <p className="text-sm">{item.detailAddress}</p>
                    <p className="text-sm text-red-500">남은 시간: {remainingTimes[index]}초</p>
                  </div>
                ) : null
              )}
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
            requestReservation();
          },
        }}></ActionBtn>
    </>
  );
}

export default ReservationWalkPartnerMain;
