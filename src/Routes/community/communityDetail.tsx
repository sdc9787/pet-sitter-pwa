import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function CommunityDetail() {
  const location = useLocation();

  const [detail, setDetail] = useState<any>(location?.state);
  const [comment, setComment] = useState<any>([]);

  useEffect(() => {
    // detail이 존재할 때만 요청을 보냄
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/community/${detail.community_board_id}`, {
        headers: {
          Authorization: `${window.localStorage.getItem("access_token")}`,
        },
      })
      .then((r: any) => {
        console.log(r.data);
        setComment(r.data);
      });
  }, []); // detail이 변경될 때마다 useEffect 콜백이 실행됨

  return (
    <>
      <div className="community-card">
        <div className="community-card-content">
          {detail.img_url == null ? null : (
            <div className="community-card-content-img">
              <img src={detail.img_url} alt="img" />
            </div>
          )}
          <div className="community-card-content-title">{detail.title}</div>
          <div className="community-card-content-writer_nickname">{detail.writer_nickname}</div>
          <div className="community-card-content-content">{detail.content}</div>
          <div className="community-card-content-created_date">{detail.created_date}</div>
          <div className="community-card-content-comment">댓글 : {/*detail.commentList.length*/}</div>
          <div className="community-card-content-views">조회수 : {detail.views}</div>
          <div className="community-card-content-likes">추천 :{detail.likes}</div>
        </div>
      </div>
    </>
  );
}

export default CommunityDetail;
