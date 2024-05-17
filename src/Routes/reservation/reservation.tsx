import { Route, Routes } from "react-router-dom";
import ReservationMain from "./reservationMain/reservationMain";

function Reservation() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationMain></ReservationMain>}></Route>
      </Routes>
    </>
  );
}

export default Reservation;
