import { Route, Routes } from "react-router-dom";
import ReservationWalkTime from "./reservationWalkTime";
import ReservationWalkLocate from "./reservationWalkLocate";
import ReservationWalkPet from "./reservationWalkPet";
import ReservationWalkPost from "./reservationWalkPost";
import ReservationWalkMain from "./reservationWalkMain";
import ReservationWalkPartner from "./reservationWalkPartner/reservationWalkPartner";

function ReservationWalk() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ReservationWalkMain></ReservationWalkMain>}></Route>
        <Route path="/time" element={<ReservationWalkTime></ReservationWalkTime>}></Route>
        <Route path="/locate" element={<ReservationWalkLocate></ReservationWalkLocate>}></Route>
        <Route path="/pet" element={<ReservationWalkPet></ReservationWalkPet>}></Route>
        <Route path="/post" element={<ReservationWalkPost></ReservationWalkPost>}></Route>
        <Route path="/partner/*" element={<ReservationWalkPartner></ReservationWalkPartner>}></Route>
      </Routes>
    </>
  );
}

export default ReservationWalk;
