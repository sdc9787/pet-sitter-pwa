import { useEffect, useState } from "react";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import instanceJson from "../../../../Component/axios/axiosJson";
import Topbar from "../../../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import Loding from "../../../../Component/loading/loading";

function ReservationCarePartnerMain() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [loding, setLoding] = useState(true);
  const [careData, setCareData] = useState();
  const [careDataBool, setCareDataBool] = useState(false);

  useEffect(() => {
    instanceJson
      .get("/care/myPost")
      .then((res) => {
        console.log(res);

        setCareData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoding(false);
      });
  }, []);
  return (
    <>
      <Topbar backUrl="/reservation" title="파트너 전용"></Topbar>
      {loding ? (
        <Loding></Loding>
      ) : (
        <>
          {!careDataBool ? (
            <div className="w-full h-screen flex justify-center items-center font-semibold">
              <div className="h-full flex flex-col gap-5 justify-center items-center">
                <span className="text-xl font-semibold">작성된 돌봄 글이 없습니다</span>
                <span>지금 바로 작성해보세요</span>
                <button onClick={() => navigate("/reservation/care/partner/create/date")} className="mb-20 px-20 py-4 bg-main text-white text-lg font-bold rounded-full">
                  돌봄 글 작성
                </button>
              </div>
              <ActionBtn buttonCount={1} button1Props={{ text: "예약신청", color: "bg-zinc-400", onClick: () => navigate("/reservation/care") }}></ActionBtn>
            </div>
          ) : (
            <div>
              <div></div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ReservationCarePartnerMain;
