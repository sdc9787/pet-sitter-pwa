import { Route, Routes } from "react-router-dom";
import ReservationCarePartnerMain from "./reservationCarePartnerMain";
import ReservationCareCreate from "./reservationCareCreate/reservationCareCreate";

function ReservationCarePartner() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationCarePartnerMain></ReservationCarePartnerMain>}></Route>
        <Route path="/create/*" element={<ReservationCareCreate></ReservationCareCreate>}></Route>
      </Routes>
    </>
  );
}

export default ReservationCarePartner;
