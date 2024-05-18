import { Route, Routes } from "react-router-dom";
import ReservationMain from "./reservationMain/reservationMain";
import ReservationWalk from "./reservationWalk/reservationWalk";
import ReservationCare from "./reservationCare/reservationCare";

function Reservation() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationMain></ReservationMain>}></Route>
        <Route path="/walk/*" element={<ReservationWalk></ReservationWalk>}></Route>
        <Route path="/care/*" element={<ReservationCare></ReservationCare>}></Route>
      </Routes>
    </>
  );
}

export default Reservation;
