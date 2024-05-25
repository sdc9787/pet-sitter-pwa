import { useDispatch } from "react-redux";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import { useSelector } from "react-redux";
import { RootState, setTitleAndContent } from "../../../Store/store";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReservationWalkPost() {
  const dispatch = useDispatch();
  const alertBox = useAlert();
  const navigator = useNavigate();
  const reservation = useSelector((state: RootState) => state.reservation);

  const [title, setTitle] = useState(useSelector((state: RootState) => state.reservation.title));
  const [content, setContent] = useState(useSelector((state: RootState) => state.reservation.content));

  //산책 게시글 작성 함수
  const sendFunction = () => {
    console.log(reservation);
    if (reservation.petId === 0) {
      alertBox("반려동물을 선택해주세요");
      return;
    }
    if (reservation.latitude === 0 || reservation.longitude === 0) {
      alertBox("위치 정보가 잘못되었습니다");
      return;
    }
    // if (reservation.address === "") {
    //   alertBox("위치 정보가 잘못되었습니다");
    //   return;
    // }
    if (reservation.detailAddress === "") {
      alertBox("상세 주소를 입력해주세요");
      return;
    }
    if (reservation.title === "") {
      alertBox("제목을 입력해주세요");
      return;
    }
    if (reservation.content === "") {
      alertBox("게시글을 입력해주세요");
      return;
    }
    //작성된 게시글을 서버에 전송하는 함수
    instanceJson
      .post("/walk/create/post", reservation)
      .then((r: any) => {
        navigator("/reservation/walk");
        alertBox("산책글이 등록되었습니다");
        console.log(r);
      })
      .catch((error: any) => {
        if (error.response.data === "필수 펫 정보가 누락 되어 신청글 작성이 불가능 합니다") alertBox("펫정보가 누락되어 신청글 작성이 불가능합니다");
        else alertBox(error.response.data);
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(setTitleAndContent({ title: title, content: content }));
  }, [title, content]);

  return (
    <>
      <Topbar title="산책 글 작성" backUrl="/reservation/walk/pet" sendFunction={sendFunction} sendText="작성"></Topbar>
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          {/* 제목 박스 */}
          <input
            value={title}
            className="w-full p-2 rounded-md border border-gray"
            placeholder="제목을 입력해주세요"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          {/* 게시글 작성 박스 */}
          <textarea
            value={content}
            className="w-full h-96 p-2 mt-2 border border-gray rounded-md"
            placeholder="산책시 특별한 주의 사항을 적어주세요"
            onChange={(e) => {
              setContent(e.target.value);
            }}></textarea>
        </div>
      </div>
    </>
  );
}

export default ReservationWalkPost;
