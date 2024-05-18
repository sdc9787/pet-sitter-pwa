import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../hook/useAlert/useAlert";

function ReservationWalkLocate() {
  const dispatch = useDispatch();
  const locate = useSelector((state: RootState) => state.reservation);
  const navigate = useNavigate();
  const alertBox = useAlert();

  return (
    <>
      <Topbar title="위치 선택" backUrl="/reservation/walk" sendText="다음" sendFunction={() => navigate("/reservation/walk/locate")}></Topbar>
      <div className="w-full h-screen flex flex-col justify-start p-6 "></div>
    </>
  );
}

export default ReservationWalkLocate;
