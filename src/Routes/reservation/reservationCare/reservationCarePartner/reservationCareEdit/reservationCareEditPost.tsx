import { useEffect, useState } from "react";
import Topbar from "../../../../../Component/topbar/topbar";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router";
import { RootState, setTitleAndContent } from "../../../../../Store/store";
import ActionBtn from "../../../../../Component/actionBtn/actionBtn";
import instanceMultipart from "../../../../../Component/axios/axiosMultipart";
import { useParams } from "react-router-dom";

function ReservationCareEditPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alertBox = useAlert();
  const navigate = useNavigate();
  const reservation = useSelector((state: RootState) => state.reservationCare);
  const imageState = useSelector((state: RootState) => state.careImageState);
  const dateState = useSelector((state: RootState) => state.careDateState);
  const [title, setTitle] = useState<string>(reservation.title || "");
  const [content, setContent] = useState<string>(reservation.content || "");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    dispatch(setTitleAndContent({ title, content }));
  }, [title, content]);

  useEffect(() => {
    const convertToFiles = async () => {
      const filePromises = reservation.images.map(async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new File([blob], `image_${Math.random().toString(36).substring(7)}.jpg`, { type: "image/jpeg" });
      });
      const files = await Promise.all(filePromises);
      setImages(files);
    };
    convertToFiles();
  }, [reservation.images]);

  const handleSubmit = () => {
    if (!title || !content) {
      alertBox("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const json = JSON.stringify(reservation.unavailableDates);

    const formData = new FormData();
    images.forEach((file) => {
      formData.append("images", file);
    });
    if (id === undefined) return;
    formData.append("carePostId", id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("imageChangeCheck", imageState.toString());
    formData.append("datesChangeCheck", dateState.toString());
    // unavailableDates를 JSON 형식으로 추가
    const blob = new Blob([json], { type: "application/json" });
    formData.append("unavailableDates", blob);
    console.log(id, title, content, imageState, dateState, blob, images);

    instanceMultipart
      .post("/care/edit/post", formData)
      .then((response) => {
        console.log(response);
        navigate("/reservation/care/partner");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Topbar title="돌봄 글 작성" backUrl={`/reservation/care/partner/edit/images/${id}`}></Topbar>
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          <input value={title} className="w-full p-2 rounded-md border border-gray" placeholder="제목을 입력해주세요" onChange={(e) => setTitle(e.target.value)} />
          <textarea value={content} className="w-full h-96 p-2 mt-2 border border-gray rounded-md" placeholder="산책시 특별한 주의 사항을 적어주세요" onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <ActionBtn
          buttonCount={1}
          button1Props={{
            text: "다음",
            onClick: handleSubmit,
            color: "bg-main",
          }}></ActionBtn>
      </div>
    </>
  );
}

export default ReservationCareEditPost;
