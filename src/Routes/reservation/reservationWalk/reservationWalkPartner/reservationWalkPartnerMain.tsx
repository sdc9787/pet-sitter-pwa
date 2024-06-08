import { useEffect, useState, useRef } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useGeolocation } from "../../../../hook/useGeolocation/useGeolocation";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import Loading from "../../../../Component/loading/loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Store/store";

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
  walkerNickname: string;
  userProfile: string;
}

function ReservationWalkPartnerMain() {
  const [loading, setLoading] = useState<boolean>(true);
  const alertBox = useAlert();
  const navigate = useNavigate();
  const { latitude, longitude } = useGeolocation();
  const [page, setPage] = useState<number>(1);
  const [distance, setDistance] = useState<number>(5);
  const [walkList, setWalkList] = useState<WalkList[]>([]);
  const [applyList, setApplyList] = useState<WalkList[]>([]); // 신청한 산책 리스트
  const [matchingList, setMatchingList] = useState<WalkList>(); // 매칭된 산책 리스트
  const [selectedWalkId, setSelectedWalkId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingTimes, setRemainingTimes] = useState<number[]>([]);
  const [isAllTimersExpired, setIsAllTimersExpired] = useState<boolean>(false);
  // 0: 아무것도 아닌 상태, 1: 매칭만 완료(이용자가 수락버튼 누른상태), 2: 현재 산책중(파트너가 시작버튼 누른상태)
  const [matchingState, setMatchingState] = useState<number>(4);
  const [matchingTime, setMatchingTime] = useState<number>(0);
  const [matchingTimeRemaining, setMatchingTimeRemaining] = useState<number>(0); // New state for matchingTime remaining
  const matchingIntervalRef = useRef<NodeJS.Timeout | null>(null); // New ref for matchingTime interval
  const partnerLocation = useSelector((state: RootState) => state.walkLocation);
  const partnerLocationRef = useRef(partnerLocation);
  const [refreshKey, setRefreshKey] = useState<number>(0); // State for key refresh
  const mapInstance = useRef<kakao.maps.Map | null>(null);
  const [partnerMarker, setPartnerMarker] = useState<kakao.maps.Marker | null>(null);

  useEffect(() => {
    partnerLocationRef.current = partnerLocation;
  }, [partnerLocation]);

  // Fetch partner's location
  const fetchPartnerLocation = async () => {
    try {
      const response = await instanceJson.get("/partner/location");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch partner's location:", error);
    }
  };

  // Update partner's location on the map
  const updatePartnerLocation = (map: kakao.maps.Map, partnerMarker: kakao.maps.Marker) => {
    fetchPartnerLocation().then((location) => {
      if (location) {
        const newLatLng = new kakao.maps.LatLng(location.latitude, location.longitude);
        partnerMarker.setPosition(newLatLng);
        map.setCenter(newLatLng); // Optionally center the map to the new location
      }
    });
  };

  // 파트너가 산책글 작성했는지 확인
  useEffect(() => {
    instanceJson
      .get("/walk/myPost")
      .then(() => {
        navigate("/reservation/walk");
      })
      .catch((err) => {});
    instanceJson.get("/mypage/status").then((res) => {
      console.log(res.data);
      setLoading(false);
      const status = res.data.partnerWalk;
      //이용자가 매칭을 눌렀을때
      if (status === "산책매칭없음") setMatchingState(0);
      if (status === "매칭만완료") setMatchingState(1);
      //파트너가 산책 시작 버튼을 눌렀을때
      else if (status === "현재산책중") setMatchingState(2);
    });
  }, [refreshKey]);

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

  //뒤로가기 버튼때문에 만든 함수
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

  // 매칭상태에 따라 다른 api 호출
  useEffect(() => {
    if (latitude !== null && matchingState === 0) {
      reservationListApi();
      reservationList();
    } else if (matchingState !== 0) {
      instanceJson
        .get("/walk/myApply/progress")
        .then((res) => {
          console.log(res.data);
          setMatchingList(res.data);
          const now = new Date();
          const matchingTime = new Date(res.data.startTime);
          const diff2 = Math.floor((now.getTime() - matchingTime.getTime()) / 1000);
          setMatchingTime(diff2);
          setMatchingTimeRemaining(diff2); // Initialize matchingTimeRemaining
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [matchingState, distance, refreshKey]);

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
    if (latitude && longitude && walkList && matchingList) {
      const mapContainer = document.getElementById("map");
      if (mapContainer && matchingState === 0 && walkList) {
        const mapOption = {
          center: new kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        mapInstance.current = map;
        const userPosition = new kakao.maps.LatLng(latitude, longitude);
        const userMarker = new kakao.maps.Marker({ position: userPosition });
        userMarker.setMap(map);

        walkList.forEach((walk) => {
          const markerImage = new kakao.maps.MarkerImage("/img/marker1.webp", new kakao.maps.Size(64, 64), { alt: "Destination" });

          const markerPosition = new kakao.maps.LatLng(walk.latitude, walk.longitude);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });
          marker.setMap(map);
          kakao.maps.event.addListener(marker, "click", () => {
            setSelectedWalkId(walk.id);
          });
        });
      } else if (mapContainer && matchingState !== 0 && matchingList) {
        const mapOption = {
          center: new kakao.maps.LatLng(matchingList.latitude, matchingList.longitude),
          level: 3,
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        mapInstance.current = map;
        const markerImage = new kakao.maps.MarkerImage("/img/marker1.webp", new kakao.maps.Size(64, 64), { alt: "Partner Location" });

        const markerPosition = new kakao.maps.LatLng(matchingList.latitude, matchingList.longitude);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        marker.setMap(map);
      } else {
        console.error("Map container not found");
      }
    }
  }, [latitude, longitude, walkList, matchingList]);

  //마커 지우기
  useEffect(() => {
    if (mapInstance.current) {
      const partnerMarkerImageUrl = "/img/marker2.webp";
      const partnerMarkerImage = new kakao.maps.MarkerImage(partnerMarkerImageUrl, new kakao.maps.Size(64, 64), { alt: "Partner Location" });

      const newPartnerMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(partnerLocationRef.current.latitude, partnerLocationRef.current.longitude),
        map: mapInstance.current,
        image: partnerMarkerImage,
      });

      setPartnerMarker(newPartnerMarker);

      const updatePartnerMarker = () => {
        newPartnerMarker.setPosition(new kakao.maps.LatLng(partnerLocationRef.current.latitude, partnerLocationRef.current.longitude));
      };

      const partnerLocationInterval = setInterval(updatePartnerMarker, 5000);

      return () => {
        clearInterval(partnerLocationInterval);
        newPartnerMarker.setMap(null);
      };
    }
  }, [partnerLocation]);

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

  //산책 시작 버튼
  const handleWalkStart = () => {
    instanceJson
      .get(`/walk/start/${matchingList?.id}`)
      .then((res) => {
        alertBox("산책 시작");
        setMatchingState(2);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (matchingState >= 1 && matchingTime > 0) {
      matchingIntervalRef.current = setInterval(() => {
        setMatchingTimeRemaining((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (matchingIntervalRef.current) {
        clearInterval(matchingIntervalRef.current);
      }
    };
  }, [matchingState, matchingTime]);

  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistance(Number(e.target.value));
  };

  // 로딩페이지
  if (loading == true) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl={applyList[0]?.id ? "/reservation/walk/partner/list" : "/reservation"} title="산책 매칭" sendText={matchingState === 0 ? "재검색" : ""} sendFunction={() => setRefreshKey((oldKey) => oldKey + 1)}></Topbar>
      <div className="w-full h-screen bg-gray-100">
        {matchingState == 0 ? (
          <div className="z-10 absolute top-20 left-4 bg-main text-white font-semibold px-3 py-1 rounded-md text-sm shadow-md">
            검색범위
            <select value={distance} onChange={handleDistanceChange} className="ml-2 p-1 bg-main text-white font-semibold text-sm rounded">
              {[1, 2, 3, 4, 5].map((d) => (
                <option className="font-semibold text-sm" key={d} value={d}>
                  {d} km
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div></div>
        )}
        {isAllTimersExpired == true && matchingState == 0 ? (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-xl font-bold">주변에 산책 글이 없습니다</p>
          </div>
        ) : matchingState == 1 ? ( //매칭된 산책글이 있을때
          <div className="h-full flex flex-col justify-center items-center">
            <div id="map" className="w-full  rounded-3xl" style={{ flexGrow: 8 }}></div>
            <div className="w-full p-4 flex flex-col items-center justify-between relative bg-white rounded-lg" style={{ flexGrow: 2 }}>
              <img src={matchingList?.userProfile} className="w-12 h-12 rounded-full absolute -top-6 z-10 border border-white right-1/2 translate-x-1/2" alt="" />
              <h3 className="text-2xl font-bold text-main mt-10">{matchingList?.title}</h3>
              <p className="font-medium text-gray-700 ">{matchingList?.content}</p>
              <div className="w-full flex flex-col justify-center items-center gap-2 mb-4">
                <p className="font-medium text-gray-600">{matchingList?.address}</p>
                <p className="font-medium text-gray-600">{matchingList?.detailAddress}</p>
                <p className="font-medium text-gray-600">이용자 닉네임 : {matchingList?.userNickname}</p>
              </div>
              <p className="flex flex-col justify-center items-center gap-2 self-center font-semibold  mb-20">
                <span className="text-blue-500">
                  이용자 수락 완료 시작 대기중 <i className="xi-spinner-1 xi-spin"></i>
                </span>
                <span className="text-sm text-zinc-400">강이지를 인계 받은 후 시작 버튼을 눌러주세요</span>
              </p>
            </div>
          </div>
        ) : matchingState == 2 ? ( //산책중일때
          <div className="h-full flex flex-col justify-center items-center">
            <div id="map" className="w-full  rounded-3xl" style={{ flexGrow: 8 }}></div>
            <div className="w-full p-4 flex flex-col items-center justify-between relative bg-white rounded-lg" style={{ flexGrow: 2 }}>
              <img src={matchingList?.userProfile} className="w-12 h-12 rounded-full absolute -top-6 z-10 border border-white right-1/2 translate-x-1/2" alt="" />
              <h3 className="text-2xl font-bold text-main mt-10">{matchingList?.title}</h3>
              <p className="font-medium text-gray-700 ">{matchingList?.content}</p>
              <div className="w-full flex flex-col justify-center items-center gap-2 mb-4">
                <p className="font-medium text-gray-600">{matchingList?.address}</p>
                <p className="font-medium text-gray-600">{matchingList?.detailAddress}</p>
                <p className="font-medium text-gray-600">이용자 닉네임 : {matchingList?.walkerNickname}</p>
              </div>
              <p className="flex flex-col justify-center items-center gap-2 self-center font-semibold  mb-20">
                <p className="font-semibold text-blue-500">
                  <span>매칭 시간: {Math.floor(matchingTimeRemaining / 60)}분/</span>
                  <span>{matchingList?.walkTime}분</span>
                </p>
                <span className="font-extrabold text-red-500">산책을 안전하게 진행해 주세요</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <div id="map" className="w-full h-64 mb-4 shadow-lg rounded-lg"></div>
            <div className="px-4">
              {walkList.map((item, index) =>
                item.id !== applyList[index]?.id ? (
                  <div
                    key={item.id}
                    className={`mb-4 p-4 border ${selectedWalkId === item.id ? "border-blue-500 shadow-lg" : "border-zinc-400 shadow-md"} rounded-lg cursor-pointer`}
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
      {matchingState == 0 ? (
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
      ) : matchingState == 1 ? ( //이용자가 수락버튼을 눌렀을때
        <ActionBtn
          buttonCount={1}
          button1Props={{
            text: "산책 시작",
            color: "bg-main",
            onClick: () => {
              handleWalkStart();
            },
          }}></ActionBtn>
      ) : (
        // 파트너가 산책 시작 버튼을 눌렀을때
        <ActionBtn
          buttonCount={1}
          button1Props={{
            text: "산책진행중",
            color: "bg-zinc-400",
            onClick: () => {
              alertBox("산책이 진행중입니다");
            },
          }}></ActionBtn>
      )}
    </>
  );
}

export default ReservationWalkPartnerMain;
