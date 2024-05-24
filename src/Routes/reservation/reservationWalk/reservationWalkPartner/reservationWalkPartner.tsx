import { Route, Routes } from "react-router-dom";
import ReservationWalkPartnerMain from "./reservationWalkPartnerMain";
import ReservationWalkPartnerList from "./reservationWalkPartnerList";

function ReservationWalkPartner() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationWalkPartnerMain></ReservationWalkPartnerMain>}></Route>
        <Route path="/list" element={<ReservationWalkPartnerList></ReservationWalkPartnerList>}></Route>
      </Routes>
    </>
  );
}

export default ReservationWalkPartner;
