import { Route, Routes } from "react-router-dom";
import ReservationCareMain from "./reservationCareMain";

function ReservationCare() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationCareMain></ReservationCareMain>}></Route>
      </Routes>
    </>
  );
}

export default ReservationCare;
