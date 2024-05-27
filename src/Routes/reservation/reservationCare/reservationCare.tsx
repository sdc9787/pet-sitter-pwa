import { Route, Routes } from "react-router-dom";
import ReservationCareMain from "./reservationCareMain";
import ReservationCarePartner from "./reservationCarePartner/reservationCarePartner";

function ReservationCare() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationCareMain></ReservationCareMain>}></Route>
        <Route path="/partner/*" element={<ReservationCarePartner></ReservationCarePartner>}></Route>
      </Routes>
    </>
  );
}

export default ReservationCare;
