import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";

type Post = {
  id: number;
  title: string;
};

function CommunityMain() {
  const [page, setPage] = useState(1); // 페이지
  const [communityPost, setCommunityPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

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

  // 데이터 로드 함수
  const loadCommunityPosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/community/${page}`, {
        headers: {
          Authorization: `${localStorage.getItem("Authorization")}`,
          refresh_token: `${localStorage.getItem("refresh_token")}`,
          "Content-Type": "application/json",
          "Content-Encoding": "charset=UTF-8",
        },
      })
      .then((res) => {
        const newPosts = res.data.posts.map((post: any) => {
          const date = new Date(post.createDate);
          let formattedDate = date.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(/. /g, "-");
          post.created_date = formattedDate.slice(0, 10) + " " + formattedDate.slice(11);
          const unixTimestamp = Math.floor(date.getTime() / 1000);
          post.created_date_timeAgo = timeAgo(unixTimestamp);
          return post;
        });

        setCommunityPost((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(res.data.posts.length > 0);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // 초기 및 페이지 데이터 로드
  useEffect(() => {
    loadCommunityPosts();
  }, []);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
        loadCommunityPosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Topbar title="커뮤니티"></Topbar>
        <div className="flex flex-col my-20 gap-1">
          {communityPost.map((c: any, i: number) => {
            // const nowDate = new Date();
            // const nowUnixTimestamp = Math.floor(date.getTime() / 1000);
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center m-2 pb-5 border-b-4 border-bdgray bg-white"
                onClick={() => {
                  navigate(`/community/detail/${c.id}`);
                }}>
                <div className="p-1 h-auto grid grid-cols-community grid-rows-community gap-3">
                  {c.imgUrl == null ? null : (
                    // <div className="community-card-content-img">
                    //   <img src={c.img_url} alt="img" />
                    // </div>
                    <div className="row-start-1 row-end-3 flex justify-center items-center">
                      <img className="w-24 h-24 object-cover rounded-2xl" src={c.imgUrl} alt="img" />
                    </div>
                  )}
                  <div className="flex items-center font-black col-start-1 col-end-4">{c.title}</div>
                  <div className="flex justify-start items-end text-nowrap col-start-1 col-end-2 text-xs">{c.nickname}</div>
                  <div
                    className={(c.imgUrl == null ? "col-end-6" : "col-end-5") + " col-start-1 row-start-2 flex justify-start items-center text-ellipsis overflow-hidden break-all line-tight font-semibold text-sm text-gray line-clamp-3 tracking-wider leading-4 community-card-content-content"}
                    style={{ display: "-webkit-box" }}>
                    {c.content}
                  </div>
                  <div className="col-start-4 row-start-3 flex justify-end items-end text-nowrap text-xs">{c.created_date_timeAgo}</div>
                  <div className="col-start-3 row-start-3 flex justify-end text-nowrap items-end text-xs">댓글 : {c.commentCount}</div>
                  <div className="w-24 col-start-5 row-start-3 flex justify-end items-end text-nowrap text-xs">조회수 : {c.viewCount}</div>
                  <div className="flex justify-start items-end text-xs text-nowrap ">추천 :{c.likeCount}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="fixed right-3 bottom-24 rounded-full bg-main p-3 text-white"
          onClick={() => {
            navigate("/community/create");
          }}>
          <i className="xi-pen xi-2x"></i>
        </button>
      </div>
    </>
  );
}

export default CommunityMain;
