import { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";

function ReservationCareApplyList() {
  const [applyList, setApplyList] = useState([]);

  useEffect(() => {
    instanceJson
      .get("/care/myReservation/apply")
      .then((res) => {
        console.log(res.data);
        setApplyList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Topbar title="돌봄 예약 신청 목록"></Topbar>
      <div className="w-full h-screen"></div>
    </>
  );
}

export default ReservationCareApplyList;
