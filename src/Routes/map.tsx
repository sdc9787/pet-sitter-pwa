import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import "./routes-Styles/map.css";

const { kakao } = window;

interface Position {
  lat: number;
  lng: number;
}

interface Place {
  id: number;
  x: number;
  y: number;
}

const KEYWORD_LIST: { id: number; value: string; emoji: string }[] = [
  { id: 1, value: "애견카페", emoji: "☕️" },
  { id: 2, value: "동물병원", emoji: "🧑‍⚕️" },
  { id: 3, value: "애견호텔", emoji: "🏨" },
];

const Kakao: React.FC = () => {
  const [search, setSearch] = useState<Place[]>([]);

  const [state, setState] = useState<{
    center: Position;
    errMsg: string | null;
    isLoading: boolean;
  }>({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
  }, []);

  const searchPlaces = (keyword: string) => {
    if (!state.center) return;
    const ps = new kakao.maps.services.Places();
    const options = {
      location: new kakao.maps.LatLng(state.center.lat, state.center.lng),
      radius: 5000,
      sort: kakao.maps.services.SortBy.DISTANCE,
    };

    ps.keywordSearch(
      keyword,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          const places: Place[] = data.map((item) => ({
            id: parseInt(item.id),
            x: parseFloat(item.x), // Convert string to number
            y: parseFloat(item.y), // Convert string to number
          }));
          setSearch(places);
        } else {
          console.error("검색에 실패하였습니다.");
        }
      },
      options
    );
  };

  return (
    <>
      <Map center={state.center} style={{ width: "100%", height: "100vh" }} level={3}>
        <MapMarker
          position={state.center || { lat: 0, lng: 0 }}
          image={{
            src: "https://cdn-icons-png.flaticon.com/128/7124/7124723.png",
            size: {
              width: 50,
              height: 50,
            },
          }}
        />
        {search.map((data) => (
          <MapMarker
            key={data.id}
            position={{ lat: data.y, lng: data.x }}
            image={{
              src: "https://cdn-icons-png.flaticon.com/128/2098/2098567.png",
              size: {
                width: 35,
                height: 35,
              },
            }}
          />
        ))}
        <div className="SearchBtns">
          {KEYWORD_LIST.map((keywordObj) => (
            <button key={keywordObj.id} type="button" onClick={() => searchPlaces(keywordObj.value)}>
              {keywordObj.value + keywordObj.emoji}
            </button>
          ))}
        </div>
      </Map>
    </>
  );
};

export default Kakao;
