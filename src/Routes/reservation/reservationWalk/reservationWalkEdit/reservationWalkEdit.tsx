import { Route, Routes } from "react-router-dom";
import ReservationWalkEditTime from "./reservationWalkEditTime";
import ReservationWalkEditLocate from "./reservationWalkEditLocate";
import ReservationWalkEditPet from "./reservationWalkEditPet";
import ReservationWalkEditPost from "./reservationWalkEditPost";

function ReservationWalkEdit() {
  return (
    <>
      <Routes>
        <Route path="/time/:id" element={<ReservationWalkEditTime></ReservationWalkEditTime>}></Route>
        <Route path="/locate/:id" element={<ReservationWalkEditLocate></ReservationWalkEditLocate>}></Route>
        <Route path="/pet/:id" element={<ReservationWalkEditPet></ReservationWalkEditPet>}></Route>
        <Route path="/post/:id" element={<ReservationWalkEditPost></ReservationWalkEditPost>}></Route>
      </Routes>
    </>
  );
}

export default ReservationWalkEdit;
