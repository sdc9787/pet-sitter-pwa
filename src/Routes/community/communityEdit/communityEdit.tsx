import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useAlert } from "../../../Component/alertText/alertText";
import instanceMultipart from "../../../Component/axios/axiosMultipart";

function CommunityEdit() {
  const location = useLocation();
  const alertBox = useAlert();
  const [detail, setDetail] = useState<any>(location?.state);
  const [communitytitle, setCommunitytitle] = useState<string>(""); //커뮤니티 게시글 제목
  const [communityContent, setCommunityContent] = useState<string>(""); //커뮤니티 게시글
  const [image, setImage] = useState<File | null>(null);
  const [imageState, setImageState] = useState<boolean>(false); //이미지 상태

  const [imagePreview, setImagePreview] = useState<boolean>(location?.state.imgUrl !== null ? true : false); //이미지 미리보기

  //파일 업로드
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지

  const [fileName, setFileName] = useState("첨부파일");

  useEffect(() => {
    setCommunitytitle(detail.title);
    setCommunityContent(detail.content);
  }, []);

  const navigate = useNavigate(); //페이지 이동

  // 이미지를 선택하는 함수
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setImageState(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      setFileName(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setImage(null);
      setImageState(false);
    }
  };
  //이미지 삭제
  const handleRemoveClick = () => {
    setImage(null);
    setImageState(false);
    setPreviewImage(null);
    setFileName("첨부파일");
    const fileInput = document.getElementById("file") as HTMLInputElement;
    fileInput.value = "";
  };

  //이미지 삭제
  const deleteImage = () => {
    if (imagePreview === true) {
      setImageState(true);
      setImagePreview(false);
    } else {
      setImageState(false);
      setImagePreview(true);
    }
  };

  //게시글 수정
  const editCommunity = () => {
    imagePreview === true ? setImageState(false) : setImageState(true); //이미지 삭제 버튼을 눌렀을때 이미지 상태를 false로 변경
    image !== null ? setImageState(true) : null; //이미지가 있을때만 이미지 상태를 true로 변경
    instanceMultipart
      .post("/community/edit/post", {
        title: communitytitle,
        content: communityContent,
        image: image,
        community_board_id: detail.id,
        image_change_check: imageState,
      })
      .then((r: any) => {
        alertBox("게시글이 수정되었습니다.");
        navigate("/community");
      })
      .catch((error: any) => {
        alertBox("게시글 수정에 실패했습니다.");
        console.error(error);
      });
  };

  return (
    <>
      <Topbar backUrl={`/community/detail/${detail.id}`} title="게시글 수정" sendText="수정" sendFunction={editCommunity}></Topbar>
      <div className="px-5 w-full flex flex-col items-center justify-center my-24">
        <div className="w-full flex flex-col items-center justify-center">
          {/* 제목 박스 */}
          <input
            value={communitytitle}
            className="w-full p-2 rounded-md border border-gray"
            placeholder="제목을 입력해주세요"
            onChange={(e) => {
              setCommunitytitle(e.target.value);
            }}
          />
          {/* 게시글 작성 박스 */}
          <textarea
            value={communityContent}
            className="w-full h-96 p-2 mt-2 border border-gray rounded-md"
            placeholder="내용을 입력해주세요"
            onChange={(e) => {
              setCommunityContent(e.target.value);
            }}></textarea>
          {/* 기존 이미지 박스 */}
          {detail.imgUrl !== null && !previewImage ? (
            <div className="relative w-full mt-3">
              <button
                className="z-10 absolute top-0 right-0 border-none text-black text-xl"
                onClick={() => {
                  deleteImage();
                }}>
                <i className="xi-close-min xi-2x"></i>
              </button>
              {imagePreview === true ? <img className="w-full h-full rounded-md" src={detail.imgUrl}></img> : <img className="w-full h-full rounded-md" style={{ opacity: 0.7 }} src={detail.imgUrl}></img>}
            </div>
          ) : null}
          {/* 새로운 이미지 박스 */}
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
            {/* <div className="filebox">
              <input className="upload-name" value={fileName} placeholder="첨부파일" readOnly />
              <label htmlFor="file">파일찾기</label>
              <input type="file" id="file" onChange={handleImageChange} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityEdit;
