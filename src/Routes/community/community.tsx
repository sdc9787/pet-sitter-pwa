import axios from "axios";
import "../routes-Styles/community.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Community() {
  let [communityPost, setCommunityPost] = useState<any>([]); //커뮤니티 게시글

  const navigate = useNavigate(); //페이지 이동

  //서버 api 호출
  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community`,
        {
          page: 1,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((r: any) => {
        communityPost = r.data.posts;
        console.log(communityPost);
        setCommunityPost(r.data.posts);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  //스크롤 이벤트
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });
  return (
    <>
      <div className="community">
        <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
          <span className={"setting-setting-title-true"}>커뮤니티</span>
          <i className="xi-bars xi-2x"></i>
        </div>
        <div className="community-element">
          {communityPost.map((c: any, i: number) => {
            return (
              <div
                key={i}
                className="community-card"
                onClick={() => {
                  navigate("/community/detail", { state: c });
                }}>
                <div className="community-card-content">
                  {c.img_url == null ? null : (
                    <div className="community-card-content-img">
                      <img src={c.img_url} alt="img" />
                    </div>
                  )}

                  <div className="community-card-content-title">{c.title}</div>
                  <div className="community-card-content-writer_nickname">{c.writer_nickname}</div>
                  <div className="community-card-content-content">{c.content}</div>
                  <div className="community-card-content-created_date">{c.created_date}</div>
                  <div className="community-card-content-comment">댓글 : {/*c.commentList.length*/}</div>
                  <div className="community-card-content-views">조회수 : {c.views}</div>
                  <div className="community-card-content-likes">추천 :{c.likes}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Community;
