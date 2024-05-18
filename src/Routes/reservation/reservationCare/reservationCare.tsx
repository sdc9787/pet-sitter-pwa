import useGeolocation from "../../../hook/useGeolocation/useGeolocation";

function ReservationCare() {
  const { latitude, longitude, address, error } = useGeolocation();

  return (
    <div>
      <h1>현재 위치 정보</h1>
      {error ? (
        <p>{error}</p>
      ) : latitude && longitude ? (
        <div>
          <p>위도: {latitude}</p>
          <p>경도: {longitude}</p>
          <p>도로명 주소: {address}</p>
        </div>
      ) : (
        <p>위치 정보를 가져오는 중...</p>
      )}
    </div>
  );
}

export default ReservationCare;
