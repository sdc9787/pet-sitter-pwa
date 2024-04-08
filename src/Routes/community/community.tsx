import axios from "axios";
import "../routes-Styles/community.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Community() {
  let [communityPost, setCommunityPost] = useState<any>([]); //커뮤니티 게시글
  const navigate = useNavigate(); //페이지 이동

  const nowDate = new Date();
  const nowUnixTimestamp = nowDate.getTime() / 1000;

  function timeAgo(unixTimestamp: number) {
    const seconds = Math.floor(nowUnixTimestamp - unixTimestamp);
    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " 년전";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " 달전";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " 일전";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " 시간전";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " 분전";
    }
    return Math.floor(seconds) + " 초전";
  }
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
        r.data.posts.map((a: any) => {
          const date = new Date(a.created_date);
          let formattedDate = date.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(/. /g, "-");
          a.created_date = formattedDate.slice(0, 10) + " " + formattedDate.slice(11); // 11번째 문자를 제거합니다.
          const unixTimestamp = Math.floor(date.getTime() / 1000);
          a.created_date_timeAgo = timeAgo(unixTimestamp);
        });

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
  }, []);
  return (
    <>
      <div className="community">
        <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
          <span className={"setting-setting-title-true"}>커뮤니티</span>
          <i className="xi-bars xi-2x"></i>
        </div>
        <div className="community-element">
          {communityPost.map((c: any, i: number) => {
            // const nowDate = new Date();
            // const nowUnixTimestamp = Math.floor(date.getTime() / 1000);

            return (
              <div
                key={i}
                className="community-card"
                onClick={() => {
                  console.log(c);
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
                  <div className={c.img_url == null ? "community-no-img community-card-content-content" : "community-card-content-content"}>{c.content}</div>
                  <div className="community-card-content-created_date">{c.created_date_timeAgo}</div>
                  <div className="community-card-content-comment">댓글 : {c.replies}</div>
                  <div className="community-card-content-views">조회수 : {c.views}</div>
                  <div className="community-card-content-likes">추천 :{c.likes}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="community-create-link-button"
          onClick={() => {
            navigate("/community/create");
          }}>
          <i className="xi-pen xi-2x"></i>
        </button>
      </div>
    </>
  );
}

export default Community;
