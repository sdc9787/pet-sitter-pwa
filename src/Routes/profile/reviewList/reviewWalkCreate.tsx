import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import instanceMultipart from "../../../Component/axios/axiosMultipart";
import { useEffect, useState } from "react";
import { useAlert } from "../../../hook/useAlert/useAlert";

function ReviewWalkCreate() {
  const { id } = useParams();
  const alertBox = useAlert();
  const navigate = useNavigate();
  const [reviewContent, setReviewContent] = useState<string>(""); // 리뷰 내용
  const [rating, setRating] = useState<number>(5); // 별점

  // 파일 업로드 변수
  const [image, setImage] = useState<File | null>(null); // 이미지
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 미리보기 이미지
  const [fileName, setFileName] = useState("첨부파일"); // 파일 이름

  // 이미지를 선택하는 함수
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      setFileName(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // 미리보기 이미지를 삭제하는 함수
  const handleRemoveClick = () => {
    setImage(null);
    setPreviewImage(null);
    setFileName("첨부파일");
    const fileInput = document.getElementById("file") as HTMLInputElement;
    fileInput.value = "";
  };

  // 리뷰 작성 api
  const reviewCreate = () => {
    console.log(reviewContent, rating, image, id);
    if (!reviewContent) {
      alertBox("리뷰 내용을 입력해주세요");
      return;
    }
    if (rating === 0) {
      alertBox("별점을 선택해주세요");
      return;
    }
    const formData = new FormData();
    if (reviewContent) {
      formData.append("content", reviewContent);
    }
    if (id) {
      formData.append("walk_record_id", id);
    }
    if (rating) {
      formData.append("rating", rating.toString());
    }
    if (image) {
      formData.append("image", image);
    }

    instanceMultipart
      .post("/review/create/walk", formData)
      .then((res) => {
        console.log(res);
        alertBox("리뷰가 성공적으로 작성되었습니다");
        navigate("/profile/review");
      })
      .catch((err) => {
        alertBox("리뷰 작성에 실패했습니다");
        console.log(err);
      });
  };

  // 별점 설정 함수
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  useEffect(() => {
    console.log(rating);
  }, [rating]);

  // 별점 컴포넌트
  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (newRating: number) => void }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} onClick={() => onRatingChange(i)} className={`cursor-pointer ${rating >= i ? "text-main" : "text-zinc-400"}`}>
          <i className="xi-star xi-2x"></i>
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <>
      <Topbar backUrl="/profile/usage/user" title="산책 리뷰 작성"></Topbar>
      <div className="w-full h-screen p-4">
        {/* 별점 */}
        <div className="w-full flex flex-col items-center justify-center mt-20">
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
        </div>
        {/* 게시글 작성 박스 */}
        <textarea className="w-full h-40 p-2 mt-2 border border-gray rounded-md" placeholder="리뷰 내용을 입력해주세요" onChange={(e) => setReviewContent(e.target.value)}></textarea>
        {/* 이미지 박스 */}
        <div className="w-full flex flex-col items-center justify-center mt-3">
          {previewImage && (
            <div className="relative w-full mt-3">
              <img className="w-full h-full rounded-md" src={previewImage} alt="preview" />
              <button className="absolute top-0 right-0 border-none text-black text-xl" onClick={handleRemoveClick}>
                <i className="xi-close-min xi-2x"></i>
              </button>
            </div>
          )}
          {/* 파일 버튼 */}
          <div className="flex items-center justify-center w-full mt-3">
            <input className="h-10 px-3 align-middle border border-zinc-400 w-3/4 text-zinc-400 font-bold" value={fileName} placeholder="첨부파일" readOnly />
            <label className="flex justify-center items-center py-3 px-5 text-white font-bold bg-main whitespace-nowrap h-10 ml-3" htmlFor="file">
              파일찾기
            </label>
            <input className="absolute w-0 h-0 p-0 overflow-hidden border-0" type="file" id="file" onChange={handleImageChange} />
          </div>
        </div>
        {/* 리뷰 작성 버튼 */}
        <div className="w-full flex justify-center mt-6">
          <button className="py-2 px-6 bg-main text-white font-bold rounded-md" onClick={reviewCreate}>
            리뷰 작성
          </button>
        </div>
      </div>
    </>
  );
}

export default ReviewWalkCreate;
