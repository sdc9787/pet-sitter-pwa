import { useNavigate } from "react-router";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState, setAddress } from "../../../Store/store";
import { useEffect, useRef, useState } from "react";
import { useGeolocationWithAddress } from "../../../hook/useGeolocation/useGeolocation";

function ReservationCareMain() {
  const dispatch = useDispatch();
  const locate = useSelector((state: RootState) => state.reservationCare);
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
        setAddress({
          administrativeAddress1: "",
          administrativeAddress2: "",
          streetNameAddress: address,
          detailAddress: locate.detailAddress,
          latitude: latitude,
          longitude: longitude,
        })
      );
      setCenterLatLng({ latitude, longitude });
    }
  }, [latitude, longitude, address, error]);

  useEffect(() => {
    if (centerLatLng) {
      const mapContainer = document.getElementById("map"); // 지도를 표시할 div

      if (!mapContainer) return;
      const mapOption = {
        center: new kakao.maps.LatLng(centerLatLng.latitude, centerLatLng.longitude), // 지도의 중심좌표를 centerLatLng으로 설정
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
  }, [centerLatLng]);

  useEffect(() => {
    if (centerLatLng) {
      const { latitude, longitude } = centerLatLng;
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(Number(longitude), Number(latitude), (res: any, status: any) => {
        console.log(res[0]);
        if (status === window.kakao.maps.services.Status.OK && res[0].road_address) {
          dispatch(
            setAddress({
              administrativeAddress1: res[0].road_address.address_name.split(" ")[0],
              administrativeAddress2: res[0].road_address.region_2depth_name,
              streetNameAddress: res[0].road_address.road_name + " " + res[0].road_address.main_building_no + " " + res[0].road_address?.sub_building_no,
              detailAddress: locate.detailAddress,
              latitude: latitude,
              longitude: longitude,
            })
          );
        } else if (status === window.kakao.maps.services.Status.OK && res[0].address) {
          dispatch(
            setAddress({
              administrativeAddress1: "",
              administrativeAddress2: "",
              streetNameAddress: "",
              detailAddress: locate.detailAddress,
              latitude: latitude,
              longitude: longitude,
            })
          );
        } else {
          alertBox("주소를 가져오는데 실패했습니다.");
        }
      });
    }
  }, [centerLatLng]);

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (centerLatLng) {
      const { latitude, longitude } = centerLatLng;
      dispatch(
        setAddress({
          administrativeAddress1: locate.administrativeAddress1,
          administrativeAddress2: locate.administrativeAddress2,
          streetNameAddress: locate.streetNameAddress,
          detailAddress: e.target.value,
          latitude,
          longitude,
        })
      );
    }
  };

  return (
    <>
      <Topbar title="위치 선택" backUrl="/reservation"></Topbar>

      <div className="w-full h-screen flex flex-col justify-start mt-16 ">
        <div id="map" style={{ width: "100%", height: "350px", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -100%)", zIndex: 30 }}>
            <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png" alt="marker" />
          </div>
        </div>

        <div className="p-6 flex flex-col justify-center items-start">
          <h2 className="text-lg font-bold">현재 주소를 확인해 주세요</h2>
          <div className="w-full mt-2 font-medium text-zinc-600 p-4 border-2 border-zinc-400 rounded-xl">
            <div className={locate.streetNameAddress === "" ? "text-zinc-400" : "text-zinc-600"}>{locate.streetNameAddress === "" ? "[현재 거주 공간으로 마커를 옮겨주세요]" : locate.administrativeAddress1 + " " + locate.administrativeAddress2 + " " + locate.streetNameAddress}</div>
          </div>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => {
            if (locate.streetNameAddress == "") alertBox("현재 거주 공간으로 마커를 옮겨주세요");
            else navigate("/reservation/care/list");
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationCareMain;
