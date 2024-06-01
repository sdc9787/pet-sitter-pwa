import { Route, Routes } from "react-router-dom";
import ReservationCareMain from "./reservationCareMain";
import ReservationCarePartner from "./reservationCarePartner/reservationCarePartner";
import ReservationCareList from "./reservationCareList";
import ReservationCareDetail from "./reservationCareDetail";
import ReservationCareApply from "./reservationApply/reservationCareApply";
import ReservationCareApplyList from "./reservationCareApplyList";

function ReservationCare() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationCareMain></ReservationCareMain>}></Route>
        <Route path="/list" element={<ReservationCareList></ReservationCareList>}></Route>
        <Route path="/apply/list" element={<ReservationCareApplyList></ReservationCareApplyList>}></Route>
        <Route path="/detail/:id" element={<ReservationCareDetail></ReservationCareDetail>}></Route>
        <Route path="/apply/*" element={<ReservationCareApply></ReservationCareApply>}></Route>
        <Route path="/partner/*" element={<ReservationCarePartner></ReservationCarePartner>}></Route>
      </Routes>
    </>
  );
}

export default ReservationCare;
