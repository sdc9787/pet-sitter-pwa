import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../hook/useAlert/useAlert";
import instanceMultipart from "../../../Component/axios/axiosMultipart";

function CommunityCreate() {
  const [communitytitle, setCommunitytitle] = useState(""); //커뮤니티 게시글 제목
  const [communityContent, setCommunityContent] = useState<string>(""); //커뮤니티 게시글
  const [image, setImage] = useState<File | null>(null); //이미지
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지
  const navigate = useNavigate(); //페이지 이동

  //파일 업로드
  const [fileName, setFileName] = useState("첨부파일");

  //알림창
  const alertBox = useAlert();

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

  //게시글 작성
  const createCommunity = () => {
    if (!communitytitle) {
      alertBox("제목을 입력해주세요");
      return;
    }
    if (!communityContent) {
      alertBox("내용을 입력해주세요");
      return;
    }
    const formData = new FormData();
    formData.append("title", communitytitle);
    formData.append("content", communityContent);
    if (image) {
      formData.append("image", image);
    } else {
      // 이미지 파일이 선택되지 않은 경우 빈 파일을 추가하여 처리
      const emptyFile = new File([""], "empty_file");
      formData.append("image", emptyFile);
    }

    // axios
    //   .post(`${import.meta.env.VITE_APP_API_URL}/community/create/post`, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       "Content-Encoding": "charset=UTF-8",
    //       Authorization: localStorage.getItem("Authorization"),
    //       "X-Refresh-Token": localStorage.getItem("refresh_token"),
    //     },
    //   })
    //   .then((r: any) => {
    //     console.log(r.data);
    //     alertBox("게시글이 작성되었습니다.");
    //     navigate("/community");
    //   })
    //   .catch((error: any) => {
    //     alertBox(error.response.data);
    //     console.error(error);
    //   });
    instanceMultipart
      .post("/community/create/post", formData)
      .then((r: any) => {
        console.log(r.data);
        alertBox("게시글이 작성되었습니다.");
        navigate("/community");
      })
      .catch((error: any) => {
        alertBox("게시글 작성에 실패했습니다.");
        console.error(error);
      });
  };

  return (
    <>
      <Topbar title="게시글 작성" backUrl="/community" sendFunction={createCommunity} sendText="작성"></Topbar>
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          {/* 제목 박스 */}
          <input
            className="w-full p-2 rounded-md border border-gray"
            placeholder="제목을 입력해주세요"
            onChange={(e) => {
              setCommunitytitle(e.target.value);
            }}
          />
          {/* 게시글 작성 박스 */}
          <textarea
            className="w-full h-96 p-2 mt-2 border border-gray rounded-md"
            placeholder="내용을 입력해주세요"
            onChange={(e) => {
              setCommunityContent(e.target.value);
            }}></textarea>
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
        </div>
      </div>
    </>
  );
}

export default CommunityCreate;
