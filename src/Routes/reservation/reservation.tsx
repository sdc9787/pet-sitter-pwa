import { Route, Routes } from "react-router-dom";
import ReservationMain from "./reservationMain";
import ReservationWalk from "./reservationWalk/reservationWalk";
import ReservationCare from "./reservationCare/reservationCare";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectedTab } from "../../Store/store";

function Reservation() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedTab(0));
  }, []);
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
