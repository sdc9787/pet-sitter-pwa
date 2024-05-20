import { useEffect, useState } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useGeolocation, useReverseGeoCoding, useGeolocationWithAddress } from "../../../../hook/useGeolocation/useGeolocation";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

function ReservationWalkPartnerMain() {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const location: GeolocationState = useGeolocation();
  const [page, setPage] = useState<number>(1);
  const [distance, setDistance] = useState<number>(5);

  const reservationListApi = () => {
    console.log(location);
    //예약 리스트 가져오기
    instanceJson
      .post("/walk/list", { now_latitude: location.latitude, now_longitude: location.longitude, page: page, max_distance: distance })
      .then((res) => {
        console.log(res);
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
    reservationListApi();
  }, [location]);

  return (
    <>
      <Topbar backUrl="/reservation" title="산책 매칭"></Topbar>
      <div>
        <button onClick={() => navigate("/reservation/walk/time")} className="mb-20 mt-20 px-20 py-4 bg-main text-white text-lg font-bold rounded-full">
          산책 예약
        </button>
      </div>
    </>
  );
}

export default ReservationWalkPartnerMain;
