import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/communityDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function CommunityDetail() {
  const location = useLocation();
  const navgate = useNavigate(); //페이지 이동

  const [detail, setDetail] = useState<any>(location?.state);
  const [comment, setComment] = useState<any>([]);
  const [commentText, setCommentText] = useState("");

  // 댓글 내용을 업데이트하는 함수
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  // 댓글을 서버에 전송하는 함수
  const handleCommentSubmit = () => {
    if (!commentText) {
      alert("댓글을 입력해주세요.");
      return;
    }
    setCommentText("");
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/create/reply`,
        {
          communityBoardId: detail.community_board_id,
          reply: commentText,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        callreply();
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  //본문 좋아요 api
  const handleLike = () => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/like/board`,
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
        setDetail({ ...detail, likes: detail.likes + 1 });
      })
      .catch((error: any) => {
        console.error(error.response.data.bad);
      });
  };

  //댓글 좋아요 api
  const handleCommentLike = (community_reply_id: number, index: number) => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/like/reply`,
        {
          communityReplyId: community_reply_id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        setComment(
          comment.map((item: any, idx: any) => {
            if (idx === index) {
              return { ...item, likes: item.likes + 1 };
            }
            return item;
          })
        );
      })
      .catch((error: any) => {
        console.error(error.response.data.bad);
      });
  };

  //본문 삭제 api
  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_APP_API_URL}/community/remove/board?communityBoardId=${detail.community_board_id}`, {
        headers: {
          Authorization: `${localStorage.getItem("access_token")}`,
        },
      })
      .then((r: any) => {
        console.log(r.data);
        navgate("/community");
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  //댓글 삭제 api
  const handleCommentDelete = (community_reply_id: number) => {
    axios
      .delete(`${import.meta.env.VITE_APP_API_URL}/community/remove/reply?communityReplyId=${community_reply_id}`, {
        headers: {
          Authorization: `${localStorage.getItem("access_token")}`,
        },
      })
      .then((r: any) => {
        console.log(r.data);
        setComment(comment.filter((item: any) => item.community_reply_id !== community_reply_id));
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  //댓글 가져오기 api

  const callreply = () => {
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
        if (Array.isArray(r.data)) {
          r.data.map((a: any) => {
            const date = new Date(a.reply_date);
            let formattedDate = date.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(/. /g, "-");
            a.reply_date = formattedDate.slice(0, 10) + " " + formattedDate.slice(11); // 11번째 문자를 제거합니다.
          });

          setComment(r.data);
        } else {
          console.error("Expected r.data to be an array but received a different type.");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  useEffect(() => {
    callreply();
  }, []);

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
      {/*본문 내용*/}
      <div className="community-detail">
        <span className="community-detail-title">{detail.title}</span>

        <div className="community-detail-info">
          <span className="community-detail-writer">{detail.writer_nickname}</span>
          <span className="communtiy-detail-replies">댓글 : {detail.replies}개</span>
          <span className="community-detail-likes">추천 : {detail.likes}개</span>
          <span className="community-detail-views">조회수 : {detail.views}</span>
        </div>
        <div className="community-detail-info-second">
          <span className="community-detail-created_date">{detail.created_date}</span>
          {localStorage.getItem("nickname") === detail.writer_nickname ? (
            <div className="community-detail-info-button">
              <button
                className="community-detail-edit-button"
                onClick={() => {
                  navgate("/community/edit", { state: detail }); //본문 수정
                }}>
                수정
              </button>
              <button
                className="community-detail-delete-button"
                onClick={() => {
                  handleDelete(); //본문 삭제
                }}>
                삭제
              </button>
            </div>
          ) : null}
        </div>

        <img src={detail.img_url} className="community-detail-img"></img>
        <span className="community-detail-content">{detail.content}</span>
        <button
          className="community-detail-likes-button"
          onClick={() => {
            handleLike(); //본문 좋아요
          }}>
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>추천</span>
        </button>
        <div className="community-detail-comment">
          {/*댓글 작성*/}
          <div className="community-detail-comment-input">
            <textarea placeholder="댓글을 입력하세요" value={commentText} onChange={handleCommentChange} />
            <button onClick={handleCommentSubmit}>등록</button>
          </div>
          {/*댓글 내용*/}

          {comment.map((a: any, i: any) => {
            return (
              <div className="community-detail-comment-element" key={i}>
                <div className="community-detail-comment-info">
                  <div>
                    <div className="community-detail-comment-name">{a.writer_nickname}</div>
                    <div className="community-detail-comment-date">{a.reply_date}</div>
                  </div>
                  {localStorage.getItem("nickname") === a.writer_nickname ? (
                    <button
                      className="community-detail-comment-delete-button"
                      onClick={() => {
                        handleCommentDelete(a.community_reply_id); //댓글 삭제
                      }}>
                      <i className="xi-close-min xi-2x"></i>
                    </button>
                  ) : null}
                </div>
                <div className="community-detail-comment-content">{a.reply_content}</div>

                <button
                  className="community-detail-comment-likes-button"
                  onClick={() => {
                    handleCommentLike(a.community_reply_id, i); //댓글 좋아요
                  }}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span>{a.likes}</span>
                </button>
                <br></br>
              </div>
            );
          })}
        </div>

        {/* <div className="community-card">
          <div className="community-card-content">
            {detail.img_url == null ? null : (
              <div className="community-card-content-img">
                <img src={detail.img_url} alt="img" />
              </div>
            )}
            <div className="community-card-content-comment">댓글 : {detail.relies}</div>
            
            <div className="community-card-content-likes">추천 :{detail.likes}</div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default CommunityDetail;
