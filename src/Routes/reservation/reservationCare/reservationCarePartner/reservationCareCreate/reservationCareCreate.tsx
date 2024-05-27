import { Route, Routes } from "react-router-dom";
import ReservationCareCreateDate from "./reservationCareCreateDate";

function ReservationCareCreate() {
  return (
    <Routes>
      <Route path="/date" element={<ReservationCareCreateDate></ReservationCareCreateDate>}></Route>
    </Routes>
  );
}

export default ReservationCareCreate;
