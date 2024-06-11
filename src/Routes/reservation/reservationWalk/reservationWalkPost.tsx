import { useDispatch, useSelector } from "react-redux";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import { RootState, setTitleAndContent } from "../../../Store/store";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../../Component/actionBtn/actionBtn";

function ReservationWalkPost() {
  const dispatch = useDispatch();
  const alertBox = useAlert();
  const navigator = useNavigate();
  const reservation = useSelector((state: RootState) => state.reservationWalk);

  const [title, setTitle] = useState(reservation.title);
  const [content, setContent] = useState(reservation.content);

  useEffect(() => {
    console.log(title, content);
    dispatch(setTitleAndContent({ title, content }));
  }, [title, content]);

  const sendFunction = () => {
    const updatedReservation = {
      ...reservation,
      title: title,
      content: content,
    };

    console.log(updatedReservation);

    console.log(updatedReservation);
    if (updatedReservation.petId === 0) {
      alertBox("반려동물을 선택해주세요");
      return;
    }
    if (updatedReservation.latitude === 0 || updatedReservation.longitude === 0) {
      alertBox("위치 정보가 잘못되었습니다");
      return;
    }
    if (updatedReservation.address === "") {
      alertBox("위치 정보가 잘못되었습니다");
      return;
    }
    if (updatedReservation.detailAddress === "") {
      alertBox("상세 주소를 입력해주세요");
      return;
    }
    if (updatedReservation.title === "") {
      alertBox("제목을 입력해주세요");
      return;
    }
    if (updatedReservation.content === "") {
      alertBox("게시글을 입력해주세요");
      return;
    }
    // 작성된 게시글을 서버에 전송하는 함수
    instanceJson
      .post("/walk/create/post", updatedReservation)
      .then((r: any) => {
        navigator("/reservation/walk");
        alertBox("산책글이 등록되었습니다");
        console.log(r);
      })
      .catch((error: any) => {
        if (error.response.data === "필수 펫 정보가 누락 되어 신청글 작성이 불가능 합니다") {
          alertBox("펫정보가 누락되어 신청글 작성이 불가능합니다");
        } else {
          alertBox(error.response.data);
        }
        console.error(error);
      });
  };

  return (
    <>
      <Topbar title="산책 글 작성" backUrl="/reservation/walk/pet"></Topbar>
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          {/* 제목 박스 */}
          <input value={title} className="w-full p-2 rounded-md border border-gray" placeholder="제목을 입력해주세요" onChange={(e) => setTitle(e.target.value)} />
          {/* 게시글 작성 박스 */}
          <textarea value={content} className="w-full h-96 p-2 mt-2 border border-gray rounded-md" placeholder="산책시 특별한 주의 사항을 적어주세요" onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => sendFunction(),
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationWalkPost;
