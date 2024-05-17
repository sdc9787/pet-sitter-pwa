import { Route, Routes } from "react-router-dom";
import ReservationUtilsMain from "./reservationUtilsMain/reservationUtilsMain";

function ReservationUtils() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationUtilsMain></ReservationUtilsMain>}></Route>
      </Routes>
    </>
  );
}

export default ReservationUtils;
