import { Route, Routes } from "react-router-dom";
import ReservationCareCreateDate from "./reservationCareCreateDate";
import ReservationCareCreateLocate from "./reservationCareCreateLocate";
import ReservationCareCreateImages from "./reservationCareCreateImages";
import ReservationCareCreatePost from "./reservationCareCreatePost";

function ReservationCareCreate() {
  return (
    <Routes>
      <Route path="/date" element={<ReservationCareCreateDate></ReservationCareCreateDate>}></Route>
      <Route path="/locate" element={<ReservationCareCreateLocate></ReservationCareCreateLocate>}></Route>
      <Route path="/images" element={<ReservationCareCreateImages></ReservationCareCreateImages>}></Route>
      <Route path="/post" element={<ReservationCareCreatePost></ReservationCareCreatePost>}></Route>
    </Routes>
  );
}

export default ReservationCareCreate;
