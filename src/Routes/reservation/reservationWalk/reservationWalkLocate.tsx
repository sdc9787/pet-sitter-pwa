import { useDispatch, useSelector } from "react-redux";
import { RootState, setLocation } from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../hook/useAlert/useAlert";
import useGeolocation from "../../../hook/useGeolocation/useGeolocation";
import { useEffect } from "react";

function ReservationWalkLocate() {
  const dispatch = useDispatch();
  const locate = useSelector((state: RootState) => state.reservation);
  const navigate = useNavigate();
  const alertBox = useAlert();

  const { latitude, longitude, city, district, road, error } = useGeolocation();

  useEffect(() => {
    if (error) {
      alertBox("위치를 가져오는데 실패했습니다.");
    } else {
      dispatch(
        setLocation({
          latitude: latitude,
          longitude: longitude,
          address: `${city} ${district} ${road}`,
          detailAddress: locate.detailAddress,
        })
      );
    }
  }, [latitude, longitude, city, district, road, error]);

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setLocation({
        latitude: latitude,
        longitude: longitude,
        address: `${city} ${district} ${road}`,
        detailAddress: e.target.value,
      })
    );
  };

  return (
    <>
      <Topbar title="위치 선택" backUrl="/reservation/walk" sendText="다음" sendFunction={() => navigate("/reservation/walk/locate")}></Topbar>
      <div className="w-full h-screen flex flex-col justify-start p-6 ">
        <div className="mt-20 flex flex-col justify-center items-start">
          <h2 className="text-lg font-bold">현재 주소를 확인해 주세요</h2>
          <div className="w-full mt-2 font-medium text-zinc-600 p-4 border-2 border-zinc-400 rounded-xl">
            <div>{locate.address}</div>
            <div className={locate.detailAddress === "" ? "text-zinc-400" : "text-zinc-600"}>{locate.detailAddress === "" ? "[상세 주소를 입력해주세요]" : locate.detailAddress}</div>
          </div>
        </div>
        {/* 상세 주소입력*/}
        <div className="mt-5">
          <h2>상세 주소를 입력해주세요</h2>
          <input className="w-full  border border-gray-300 rounded-lg px-4 py-3" type="text" placeholder="상세 주소를 입력해주세요." onChange={handleDetailAddress} />
        </div>
      </div>
    </>
  );
}

export default ReservationWalkLocate;
