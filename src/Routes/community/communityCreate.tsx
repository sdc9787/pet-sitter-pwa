import axios from "axios";
import "./style/communityCreate.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CommunityCreate() {
  const [communitytitle, setCommunitytitle] = useState(""); //커뮤니티 게시글 제목
  const [communityContent, setCommunityContent] = useState<string>(""); //커뮤니티 게시글
  const [image, setImage] = useState<File | null>(null);

  // 이미지를 선택하는 함수
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const navigate = useNavigate(); //페이지 이동

  //게시글 작성
  const createCommunity = () => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/create`,
        {
          title: communitytitle,
          content: communityContent,
          image: image,
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
        <div className="community-create-title">게시글 작성</div>
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
          <input type="file" onChange={handleImageChange} />
          <button
            className="community-create-content-button"
            onClick={() => {
              createCommunity();
            }}>
            작성
          </button>
        </div>
      </div>
    </>
  );
}

export default CommunityCreate;
