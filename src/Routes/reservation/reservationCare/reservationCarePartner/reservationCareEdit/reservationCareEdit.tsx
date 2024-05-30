import { Route, Routes } from "react-router-dom";
import ReservationCareEditDate from "./reservationCareEditDate";

import ReservationCareEditImages from "./reservationCareEditImages";
import ReservationCareEditPost from "./reservationCareEditPost";

function ReservationCareEdit() {
  return (
    <Routes>
      <Route path="/date/:id" element={<ReservationCareEditDate></ReservationCareEditDate>}></Route>
      <Route path="/images/:id" element={<ReservationCareEditImages></ReservationCareEditImages>}></Route>
      <Route path="/post/:id" element={<ReservationCareEditPost></ReservationCareEditPost>}></Route>
    </Routes>
  );
}

export default ReservationCareEdit;
