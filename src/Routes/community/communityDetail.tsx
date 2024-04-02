import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style/communityDetail.css";

function CommunityDetail() {
  const location = useLocation();

  const [detail, setDetail] = useState<any>(location?.state);
  const [comment, setComment] = useState<any>([]);

  useEffect(() => {
    // detail이 존재할 때만 요청을 보냄
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/replies`,
        {
          communityBoardId: detail.community_board_id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        setComment(r.data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []); // detail이 변경될 때마다 useEffect 콜백이 실행됨

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
      <div className="community-detail">
        <span className="community-detail-title">{detail.title}</span>
        <span className="community-detail-content">{detail.content}</span>
        <div className="community-detail-created_date">{detail.created_date}</div>
        {comment.map((a: any, i: any) => {
          <div className="community-card-content-comment">댓글 : {detail.relies}</div>;
        })}

        {/* <div className="community-card">
          <div className="community-card-content">
            {detail.img_url == null ? null : (
              <div className="community-card-content-img">
                <img src={detail.img_url} alt="img" />
              </div>
            )}
            <div className="community-card-content-comment">댓글 : {detail.relies}</div>
            <div className="community-card-content-views">조회수 : {detail.views}</div>
            <div className="community-card-content-likes">추천 :{detail.likes}</div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CommunityDetail;
