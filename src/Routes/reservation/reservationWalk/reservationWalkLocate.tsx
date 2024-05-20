import { useDispatch, useSelector } from "react-redux";
import { RootState, setLocation } from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useEffect } from "react";
import useGeolocationWithAddress from "../../../hook/useGeolocation/useGeolocation";

function ReservationWalkLocate() {
  const dispatch = useDispatch();
  const locate = useSelector((state: RootState) => state.reservation);
  const navigate = useNavigate();
  const alertBox = useAlert();

  const { latitude, longitude, address, city, district, road, error } = useGeolocationWithAddress();

  console.log(city);
  console.log(district);
  console.log(road);
  useEffect(() => {
    if (error) {
      alertBox(error);
    } else {
      dispatch(
        setLocation({
          latitude: latitude,
          longitude: longitude,
          address: address,
          detailAddress: locate.detailAddress,
        })
      );
    }
  }, [latitude, longitude, address, error]);

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setLocation({
        latitude: latitude,
        longitude: longitude,
        address: address,
        detailAddress: e.target.value,
      })
    );
  };

  return (
    <>
      <Topbar title="위치 선택" backUrl="/reservation/walk/time" sendText="다음" sendFunction={() => (locate.detailAddress === "" ? alertBox("상세 주소를 입력해주세요") : navigate("/reservation/walk/pet"))}></Topbar>
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
          <h2 className="text-lg font-bold">상세 주소</h2>
          <input className="w-full mt-2 font-medium text-zinc-600 p-4 border-2 border-zinc-400 rounded-xl" type="text" placeholder="상세 주소를 입력해주세요" value={locate.detailAddress} onChange={handleDetailAddress} />
        </div>

        <span className="mt-8 text-zinc-400 text-sm">주소가 다르다면 여기를 터치해주세요(동작안함)</span>
      </div>
    </>
  );
}

export default ReservationWalkLocate;
