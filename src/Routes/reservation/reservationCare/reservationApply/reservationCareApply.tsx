import { Route, Routes } from "react-router-dom";
import ReservationCareApplyPost from "./reservationCareApplyPost";
import ReservationCareApplyPet from "./reservationCareApplyPet";
import ReservationCareApplyDate from "./reservationCareApplyDate";

function ReservationCareApply() {
  return (
    <>
      <Routes>
        <Route path="/date/:id" element={<ReservationCareApplyDate></ReservationCareApplyDate>}></Route>
        <Route path="/pet/:id" element={<ReservationCareApplyPet></ReservationCareApplyPet>}></Route>
        <Route path="/post/:id" element={<ReservationCareApplyPost></ReservationCareApplyPost>}></Route>
      </Routes>
    </>
  );
}

export default ReservationCareApply;
