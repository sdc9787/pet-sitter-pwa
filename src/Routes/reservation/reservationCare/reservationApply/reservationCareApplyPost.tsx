import { useDispatch } from "react-redux";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instanceJson from "../../../../Component/axios/axiosJson";
import Topbar from "../../../../Component/topbar/topbar";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Store/store";

function ReservationCareApplyPost() {
  const { id } = useParams();
  const alertBox = useAlert();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const petId = useSelector((state: RootState) => state.careSelectedAvailablePet);
  const date = useSelector((state: RootState) => state.careSelectedAvailableDates);

  const handleSubmit = () => {
    if (!petId) {
      alertBox("펫을 선택해주세요");
      return;
    }
    if (!date.reservationStartDate || !date.reservationEndDate) {
      alertBox("날짜를 선택해주세요");
      return;
    }
    if (!content) {
      alertBox("요청 사항을 입력해주세요");
      return;
    }
    instanceJson
      .post("/care/apply", {
        carePostId: id,
        petId: petId,
        amount: 20000,
        reservationStartDate: date.reservationStartDate,
        reservationEndDate: date.reservationEndDate,
        requestMessage: content,
      })
      .then((res) => {
        alertBox("예약이 완료되었습니다.");
        navigate("/reservation/care/apply/list");
      })
      .catch((err) => {
        alertBox("예약에 실패했습니다.");
        console.log(err);
      });
  };

  return (
    <>
      <Topbar title="요청사항" backUrl={`/reservation/care/apply/pet/${id}`}></Topbar>
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          <textarea value={content} className="w-full h-96 p-2 mt-2 border border-gray rounded-md" placeholder="돌봄 예약시 특별한 주의 사항을 적어주세요" onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <ActionBtn
          buttonCount={1}
          button1Props={{
            text: "예약완료",
            onClick: handleSubmit,
            color: "bg-main",
          }}></ActionBtn>
      </div>
    </>
  );
}

export default ReservationCareApplyPost;
