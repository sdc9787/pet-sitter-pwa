import { useEffect, useState, useRef } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useGeolocation } from "../../../../hook/useGeolocation/useGeolocation";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import Loding from "../../../../Component/loding/loding";

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

function ReservationWalkPartnerList() {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const [loding, setLoading] = useState<boolean>(true);
  const [applyList, setApplyList] = useState<WalkList[]>([]); // 신청한 산책 리스트
  const [selectedWalkId, setSelectedWalkId] = useState<number | null>(null);
  const [remainingTimes, setRemainingTimes] = useState<number[]>([]);
  const [noVisibleItems, setNoVisibleItems] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { latitude, longitude } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude) {
      instanceJson
        .post("/walk/myApply", { now_latitude: latitude, now_longitude: longitude })
        .then((res) => {
          setLoading(false);
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
    }
  }, [latitude, longitude]);

  // 1초마다 시간 감소(타이머)
  useEffect(() => {
    if (remainingTimes.some((time) => time > 0)) {
      intervalRef.current = setInterval(() => {
        setRemainingTimes((prevTimes) => {
          const updatedTimes = prevTimes.map((time) => time - 1);
          const allTimersExpired = updatedTimes.every((time) => time <= 0);

          // 타이머가 0 초가 되면 해당 항목을 applyList에서 제거합니다.
          if (allTimersExpired) {
            setApplyList((prevList) => prevList.filter((item, index) => updatedTimes[index] > 0));
          }

          setNoVisibleItems(updatedTimes.every((time) => time <= 0));
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

  // 예약취소
  const cancelReservation = () => {
    if (selectedWalkId) {
      instanceJson
        .get(`/walk/delete/apply/${selectedWalkId}`)
        .then((res) => {
          alertBox("예약이 취소되었습니다.");
          setApplyList(applyList.filter((item) => item.id !== selectedWalkId));
          setSelectedWalkId(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Topbar backUrl="/reservation" title="매칭 신청 내역"></Topbar>
      {loding ? (
        <Loding></Loding>
      ) : (
        <>
          <div className="w-full h-screen bg-gray-100">
            <div className="mt-20">
              <div className="px-4">
                {noVisibleItems ? (
                  <div className="text-center text-gray-500">신청 내역이 없습니다.</div>
                ) : (
                  applyList.map(
                    (item, index) =>
                      remainingTimes[index] > 0 && (
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
                      )
                  )
                )}
              </div>
            </div>
          </div>
          <ActionBtn
            buttonCount={2}
            button1Props={{
              text: "예약 취소",
              color: "bg-red-500",
              onClick: () => {
                cancelReservation();
              },
            }}
            button2Props={{
              text: "추가 예약하기",
              color: "bg-main",
              onClick: () => {
                navigate("/reservation/walk/partner");
              },
            }}></ActionBtn>
        </>
      )}
    </>
  );
}

export default ReservationWalkPartnerList;
