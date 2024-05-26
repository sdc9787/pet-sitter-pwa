import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setLocation } from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useGeolocationWithAddress } from "../../../hook/useGeolocation/useGeolocation";

function ReservationWalkLocate() {
  const dispatch = useDispatch();
  const locate = useSelector((state: RootState) => state.reservation);
  const navigate = useNavigate();
  const alertBox = useAlert();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { latitude, longitude, address, error } = useGeolocationWithAddress();
  const [centerLatLng, setCenterLatLng] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (error) {
      alertBox(error);
    } else if (latitude && longitude) {
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

  useEffect(() => {
    if (latitude && longitude) {
      const mapContainer = document.getElementById("map"); // 지도를 표시할 div

      if (!mapContainer) return;
      const mapOption = {
        center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표를 geolocation으로 설정
        level: 3, // 지도의 확대 레벨
      };

      const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      // 지도가 이동, 확대, 축소로 인해 중심좌표가 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "center_changed", function () {
        // 디바운싱을 위해 기존 타임아웃을 제거합니다
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        // 새로운 타임아웃을 설정합니다
        debounceTimeout.current = setTimeout(() => {
          // 지도의 중심좌표를 얻어옵니다
          const latlng = map.getCenter();
          setCenterLatLng({ latitude: latlng.getLat(), longitude: latlng.getLng() });

          const message = `<p>지도 레벨은 ${map.getLevel()} 이고</p><p>중심 좌표는 위도 ${latlng.getLat()}, 경도 ${latlng.getLng()}입니다</p>`;
          const resultDiv = document.getElementById("result");
          if (resultDiv) {
            resultDiv.innerHTML = message;
          }
        }, 1000); // 1000ms의 딜레이를 줍니다
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (centerLatLng) {
      const { latitude, longitude } = centerLatLng;
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(Number(longitude), Number(latitude), (res: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK && res[0].road_address) {
          dispatch(
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: res[0].road_address.address_name,
              detailAddress: locate.detailAddress,
            })
          );
        } else if (status === window.kakao.maps.services.Status.OK && res[0].address) {
          dispatch(
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: res[0].address.address_name,
              detailAddress: locate.detailAddress,
            })
          );
        } else {
          alertBox("주소를 가져오는데 실패했습니다.");
        }
      });
    }
  }, [centerLatLng]);

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setLocation({
        latitude: latitude || 0,
        longitude: longitude || 0,
        address: address || "",
        detailAddress: e.target.value,
      })
    );
  };

  return (
    <>
      <Topbar title="위치 선택" backUrl="/reservation/walk/time" sendText="다음" sendFunction={() => (locate.detailAddress === "" ? alertBox("상세 주소를 입력해주세요") : navigate("/reservation/walk/pet"))}></Topbar>

      <div className="w-full h-screen flex flex-col justify-start mt-16 ">
        <div id="map" style={{ width: "100%", height: "350px", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)", zIndex: 30 }}>
            <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" alt="marker" />
          </div>
        </div>

        <div className="p-6 flex flex-col justify-center items-start">
          <h2 className="text-lg font-bold">현재 주소를 확인해 주세요</h2>
          <div className="w-full mt-2 font-medium text-zinc-600 p-4 border-2 border-zinc-400 rounded-xl">
            <div className={locate.address === "" ? "text-zinc-400" : "text-zinc-600"}>{locate.address === "" ? "[현재 주소를 가져오지 못했습니다]" : locate.address}</div>
            <div className={locate.detailAddress === "" ? "text-zinc-400" : "text-zinc-600"}>{locate.detailAddress === "" ? "[상세 주소를 입력해주세요]" : locate.detailAddress}</div>
          </div>
        </div>
        {/* 상세 주소입력 */}
        <div className="p-6">
          <h2 className="text-lg font-bold">상세 주소</h2>
          <input className="w-full mt-2 font-medium text-zinc-600 p-4 border-2 border-zinc-400 rounded-xl" type="text" placeholder="상세 주소를 입력해주세요" value={locate.detailAddress} onChange={handleDetailAddress} />
        </div>

        <span className="p-6 text-zinc-400 text-sm">주소가 다르다면 여기를 터치해주세요(미구현)</span>
      </div>
    </>
  );
}

export default ReservationWalkLocate;
