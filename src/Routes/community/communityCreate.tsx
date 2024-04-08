import axios from "axios";
import "./style/communityCreate.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CommunityCreate() {
  const [communitytitle, setCommunitytitle] = useState(""); //커뮤니티 게시글 제목
  const [communityContent, setCommunityContent] = useState<string>(""); //커뮤니티 게시글
  const [image, setImage] = useState<File | null>(null); //이미지
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지

  const navigate = useNavigate(); //페이지 이동

  //파일 업로드
  const [fileName, setFileName] = useState("첨부파일");

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
    console.log(communityContent);
    console.log(communitytitle);
    console.log(image);
    if (!communitytitle || !communityContent) {
      console.error("All fields are required");
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

    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/community/create`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r: any) => {
        console.log(r.data);
        navigate("/community");
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  //스크롤 이벤트
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  }, []);
  return (
    <>
      <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
        <span className={"setting-setting-title-true"}>커뮤니티</span>
        <i className="xi-bars xi-2x"></i>
      </div>
      <div className="community-create">
        <div className="community-create-content">
          <input
            className="community-create-content-title"
            placeholder="제목을 입력해주세요"
            onChange={(e) => {
              setCommunitytitle(e.target.value);
            }}
          />
          <textarea
            className="community-create-content-content"
            placeholder="내용을 입력해주세요"
            onChange={(e) => {
              setCommunityContent(e.target.value);
            }}></textarea>

          <div className="community-create-content-file">
            {previewImage && (
              <div className="community-create-content-file-img">
                <img src={previewImage} alt="preview" />
                <button onClick={handleRemoveClick}>
                  <i className="xi-close-min xi-2x"></i>
                </button>
              </div>
            )}
            <div className="filebox">
              <input className="upload-name" value={fileName} placeholder="첨부파일" readOnly />
              <label htmlFor="file">파일찾기</label>
              <input type="file" id="file" onChange={handleImageChange} />
            </div>
          </div>
          <div className="community-create-content-buttons">
            <button
              className="community-create-content-back-button"
              onClick={() => {
                navigate("/community");
              }}>
              취소
            </button>
            <button
              className="community-create-content-send-button"
              onClick={() => {
                createCommunity();
              }}>
              작성
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityCreate;
