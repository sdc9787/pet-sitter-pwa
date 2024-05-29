import { useNavigate } from "react-router";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import Topbar from "../../../Component/topbar/topbar";

function ReservationCareMain() {
  const navigate = useNavigate();
  return (
    <>
      <Topbar backUrl="/reservation" title="돌봄 예약"></Topbar>
      <div className="w-full h-screen"></div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "돌봄 글 작성",
          onClick: () => {
            navigate("/reservation/care/partner/create/date");
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationCareMain;
