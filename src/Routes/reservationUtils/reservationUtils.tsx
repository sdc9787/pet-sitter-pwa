import { Route, Routes } from "react-router-dom";
import ReservationUtilsMain from "./reservationUtilsMain/reservationUtilsMain";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectedTab } from "../../Store/store";

function ReservationUtils() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedTab(1));
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationUtilsMain></ReservationUtilsMain>}></Route>
      </Routes>
    </>
  );
}

export default ReservationUtils;
