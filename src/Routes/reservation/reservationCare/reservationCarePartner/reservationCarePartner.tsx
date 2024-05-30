import { Route, Routes } from "react-router-dom";
import ReservationCarePartnerMain from "./reservationCarePartnerMain";
import ReservationCareCreate from "./reservationCareCreate/reservationCareCreate";
import ReservationCareEdit from "./reservationCareEdit/reservationCareEdit";

function ReservationCarePartner() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationCarePartnerMain></ReservationCarePartnerMain>}></Route>
        <Route path="/create/*" element={<ReservationCareCreate></ReservationCareCreate>}></Route>
        <Route path="/edit/*" element={<ReservationCareEdit></ReservationCareEdit>}></Route>
      </Routes>
    </>
  );
}

export default ReservationCarePartner;
