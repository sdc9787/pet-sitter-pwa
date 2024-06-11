import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { RootState, setTitleAndContent } from "../../../../Store/store";
import instanceJson from "../../../../Component/axios/axiosJson";
import Topbar from "../../../../Component/topbar/topbar";

function ReservationWalkEditPost() {
  const dispatch = useDispatch();
  const alertBox = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const reservationState = useSelector((state: RootState) => state.reservationWalk);
  const [reservation, setReservation] = useState(reservationState);
  const [title, setTitle] = useState(reservationState.title);
  const [content, setContent] = useState(reservationState.content);

  // Function to validate reservation
  const validateReservation = () => {
    if (reservation.petId === 0) {
      alertBox("반려동물을 선택해주세요");
      return false;
    }
    if (reservation.latitude === 0 || reservation.longitude === 0) {
      alertBox("위치 정보가 잘못되었습니다");
      return false;
    }
    if (!reservation.address) {
      alertBox("위치 정보가 잘못되었습니다");
      return false;
    }
    if (!reservation.detailAddress) {
      alertBox("상세 주소를 입력해주세요");
      return false;
    }
    if (!title) {
      alertBox("제목을 입력해주세요");
      return false;
    }
    if (!content) {
      alertBox("내용을 입력해주세요");
      return false;
    }

    return true;
  };

  // Post function
  const sendFunction = () => {
    if (!validateReservation()) {
      return;
    }
    const updatedReservation = {
      ...reservation,
      title: title,
      content: content,
      id: Number(id),
    };

    setReservation(updatedReservation);

    instanceJson
      .post("/walk/edit/post", updatedReservation)
      .then((response: any) => {
        navigate("/reservation/walk");
        alertBox("산책글이 수정되었습니다");
        console.log(response);
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

  useEffect(() => {
    setReservation(reservationState);
  }, [reservationState]);

  useEffect(() => {
    dispatch(setTitleAndContent({ title, content }));
  }, [dispatch, title, content]);

  return (
    <>
      <Topbar title="산책 글 작성" backUrl={`/reservation/walk/edit/pet/${id}`} sendFunction={sendFunction} sendText="작성" />
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          {/* 제목 박스 */}
          <input value={title} className="w-full p-2 rounded-md border border-gray" placeholder="제목을 입력해주세요" onChange={(e) => setTitle(e.target.value)} />
          {/* 게시글 작성 박스 */}
          <textarea value={content} className="w-full h-96 p-2 mt-2 border border-gray rounded-md" placeholder="산책시 특별한 주의 사항을 적어주세요" onChange={(e) => setContent(e.target.value)} />
        </div>
      </div>
    </>
  );
}

export default ReservationWalkEditPost;
