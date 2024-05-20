import { Route, Routes } from "react-router-dom";
import ReservationWalkPartnerMain from "./reservationWalkPartnerMain";

function ReservationWalkPartner() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationWalkPartnerMain></ReservationWalkPartnerMain>}></Route>
      </Routes>
    </>
  );
}

export default ReservationWalkPartner;
