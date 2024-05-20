import { useEffect, useRef, useState } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

interface ReverseGeoCodingProps {
  latitude: number;
  longitude: number;
}

//위치 정보를 가져오는 hook
const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          let errorMessage = "Error getting location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out.";
              break;
          }
          setState({
            latitude: null,
            longitude: null,
            error: errorMessage,
          });
          console.error(errorMessage);
        }
      );
    } else {
      setState({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return state;
};

//위도, 경도를 주소로 변환하는 hook
const useReverseGeoCoding = ({ latitude, longitude }: ReverseGeoCodingProps) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [road, setRoad] = useState("");
  const latestRequestIdRef = useRef<number | null>(null);

  useEffect(() => {
    const requestId = Date.now();
    latestRequestIdRef.current = requestId;

    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      const reverseGeocoding = (res: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          if (latestRequestIdRef.current === requestId) {
            setAddress(res[0].road_address.address_name);
            setCity(res[0].road_address.region_1depth_name);
            setDistrict(res[0].road_address.region_2depth_name);
            setRoad(res[0].road_address.road_name + res[0].road_address.main_building_no + "-" + res[0].road_address.sub_building_no);
          }
        } else {
          console.error("주소 변환 실패!");
        }
      };

      if (latitude !== undefined && longitude !== undefined) {
        geocoder.coord2Address(Number(longitude), Number(latitude), reverseGeocoding);
      }
    });
  }, [latitude, longitude]);

  return { address, city, district, road };
};

//위도, 경도를 가져오는 hook과 주소로 변환하는 hook를 합친 hook
const useGeolocationWithAddress = () => {
  const { latitude, longitude, error } = useGeolocation();
  const [placeId, setPlaceId] = useState(Date.now());

  useEffect(() => {
    if (latitude && longitude) {
      setPlaceId(Date.now());
    }
  }, [latitude, longitude]);

  const { address, city, district, road } = useReverseGeoCoding({ latitude: latitude!, longitude: longitude! });

  return { latitude, longitude, address, city, district, road, error };
};

export default useGeolocationWithAddress;
