import axios from "axios";
import "./communityEdit.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CommunityEdit() {
  const location = useLocation();
  const [detail, setDetail] = useState<any>(location?.state);
  const [communitytitle, setCommunitytitle] = useState<string>(""); //커뮤니티 게시글 제목
  const [communityContent, setCommunityContent] = useState<string>(""); //커뮤니티 게시글
  const [image, setImage] = useState<File | null>(null);
  const [imageState, setImageState] = useState<boolean>(false); //이미지 상태

  const [imagePreview, setImagePreview] = useState<boolean>(location?.state.img_url !== null ? true : false); //이미지 미리보기

  //파일 업로드
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지

  const [fileName, setFileName] = useState("첨부파일");
  useEffect(() => {
    setCommunitytitle(detail.title);
    setCommunityContent(detail.content);
  }, []);

  const navigate = useNavigate(); //페이지 이동

  // 이미지를 선택하는 함수
  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setImage(event.target.files[0]);
  //     setImageState(true);
  //   } else {
  //     setImage(null);
  //     setImageState(false);
  //   }
  // };
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
  const deleteImage = () => {
    if (imagePreview === true) {
      setImageState(true);
      setImagePreview(false);
    } else {
      setImageState(false);
      setImagePreview(true);
    }
  };

  const handleRemoveClick = () => {
    setImage(null);
    setImageState(false);
    setPreviewImage(null);
    setFileName("첨부파일");
    const fileInput = document.getElementById("file") as HTMLInputElement;
    fileInput.value = "";
  };

  //게시글 수정
  const editCommunity = () => {
    imagePreview === true ? setImageState(false) : setImageState(true); //이미지 삭제 버튼을 눌렀을때 이미지 상태를 false로 변경
    image !== null ? setImageState(true) : null; //이미지가 있을때만 이미지 상태를 true로 변경
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/edit/board`,
        {
          title: communitytitle,
          content: communityContent,
          image: image,
          communityBoardId: detail.community_board_id,
          imageChangeCheck: imageState,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
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
            value={communitytitle}
            className="community-create-content-title"
            placeholder="제목을 입력해주세요"
            onChange={(e) => {
              setCommunitytitle(e.target.value);
            }}
          />
          <textarea
            value={communityContent}
            className="community-create-content-content"
            placeholder="내용을 입력해주세요"
            onChange={(e) => {
              setCommunityContent(e.target.value);
            }}></textarea>

          {detail.img_url !== null && !previewImage ? (
            <div className="community-create-content-file-img">
              <button
                className="community-create-img-delete-button"
                onClick={() => {
                  deleteImage();
                }}>
                <i className="xi-close-min xi-2x"></i>
              </button>
              {imagePreview === true ? <img src={detail.img_url}></img> : <img style={{ opacity: 0.7 }} src={detail.img_url}></img>}
            </div>
          ) : null}
          <div className="community-create-content-file ">
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
                editCommunity();
              }}>
              수정
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityEdit;
