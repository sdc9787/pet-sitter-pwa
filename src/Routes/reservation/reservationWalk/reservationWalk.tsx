import useGeolocation from "../../../hook/useGeolocation/useGeolocation";

function ReservationWalk() {
  const { latitude, longitude, city, error } = useGeolocation();

  return (
    <div>
      <h1>현재 위치 정보</h1>
      {error ? (
        <p>{error}</p>
      ) : latitude && longitude ? (
        <div>
          <p>위도: {latitude}</p>
          <p>경도: {longitude}</p>
          <p>도시명: {city}</p>
        </div>
      ) : (
        <p>위치 정보를 가져오는 중...</p>
      )}
    </div>
  );
}

export default ReservationWalk;
