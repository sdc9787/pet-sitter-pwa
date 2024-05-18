import { Route, Routes } from "react-router-dom";
import ReservationWalkTime from "./reservationWalkTime";
import ReservationWalkLocate from "./reservationWalkLocate";
import ReservationWalkPet from "./reservationWalkPet";
import ReservationWalkPost from "./reservationWalkPost";

function ReservationWalk() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationWalkTime></ReservationWalkTime>}></Route>
        <Route path="/locate" element={<ReservationWalkLocate></ReservationWalkLocate>}></Route>
        <Route path="/pet" element={<ReservationWalkPet></ReservationWalkPet>}></Route>
        <Route path="/post" element={<ReservationWalkPost></ReservationWalkPost>}></Route>
      </Routes>
    </>
  );
}

export default ReservationWalk;
