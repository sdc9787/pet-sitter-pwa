import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../../Component/alertText/alertText";
import Topbar from "../../../Component/topbar/topbar";

interface Detail {
  id: number;
  title: string;
  content: string;
  createDate: string;
  imgUrl: string | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  nickname: string;
}

interface Comment {
  id: number;
  nickname: string;
  content: string;
  createDate: string;
  likeCount: number;
}

function CommunityDetail() {
  const navgate = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창
  const { id } = useParams();

  const [detail, setDetail] = useState<Detail>({ id: 0, title: "", content: "", createDate: "", imgUrl: "", likeCount: 0, commentCount: 0, viewCount: 0, nickname: "" });
  const [comment, setComment] = useState<Comment[]>([{ id: 0, nickname: "", content: "", createDate: "", likeCount: 0 }]);
  const [commentText, setCommentText] = useState("");
  // 댓글 내용을 업데이트하는 함수
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };

  //글목록 및 댓글목록을 서버에 요청하는 함수
  const getDetail = () => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/community/post/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem("Authorization")}`,
          refresh_token: `${localStorage.getItem("refresh_token")}`,
          "Content-Type": "application/json",
          "Content-Encoding": "charset=UTF-8",
        },
      })
      .then((r: any) => {
        if (Array.isArray(r.data.comments)) {
          r.data.comments.map((a: any) => {
            const commentDate = new Date(a.createDate);
            let formattedDate = commentDate.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(/. /g, "-");
            a.createDate = formattedDate.slice(0, 10) + " " + formattedDate.slice(11); // 11번째 문자를 제거합니다.
          });
        }
        const postDate = new Date(r.data.post[0].createDate);
        let formattedDate = postDate.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(/. /g, "-");
        r.data.post[0].createDate = formattedDate.slice(0, 10) + " " + formattedDate.slice(11); // 11번째 문자를 제거합니다.
        setDetail(r.data.post[0]);
        setComment(r.data.comments);
      })
      .catch((error: any) => {
        alertBox(error.response.data);
        console.error(error);
      });
  };

  //글목록 및 댓글목록을 서버에 요청하는 함수
  useEffect(() => {
    getDetail();
  }, []);

  // 댓글을 서버에 전송하는 함수
  const handleCommentSubmit = () => {
    if (!commentText) {
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/create/comment`,
        {
          content: commentText,
          community_board_id: id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
            refresh_token: `${localStorage.getItem("refresh_token")}`,
            "Content-Type": "application/json",
            "Content-Encoding": "charset=UTF-8",
          },
        }
      )
      .then((r: any) => {
        alertBox("댓글이 등록되었습니다.");
        getDetail();
        setCommentText("");
      })
      .catch((error: any) => {
        alertBox(error.response.data);
        console.error(error);
      });
  };

  // 본문 좋아요 api
  const handleLike = () => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/like/post`,
        {
          community_board_id: detail.id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
            refresh_token: `${localStorage.getItem("refresh_token")}`,
            "Content-Type": "application/json",
            "Content-Encoding": "charset=UTF-8",
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        alertBox("추천완료");
        setDetail({ ...detail, likeCount: detail.likeCount + 1 });
      })
      .catch((error: any) => {
        alertBox(error.response.data);
        console.error(error);
      });
  };

  // 댓글 좋아요 api
  const handleCommentLike = (id: number) => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/like/comment`,
        {
          comment_id: id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
            refresh_token: `${localStorage.getItem("refresh_token")}`,
            "Content-Type": "application/json",
            "Content-Encoding": "charset=UTF-8",
          },
        }
      )
      .then((r: any) => {
        alertBox("추천완료");
        getDetail();
      })
      .catch((error: any) => {
        alertBox(error.response.data);
        console.error(error);
      });
  };

  // 본문 삭제 api
  const handleDelete = () => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/remove/post`,
        {
          community_board_id: detail.id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
            refresh_token: `${localStorage.getItem("refresh_token")}`,
            "Content-Type": "application/json",
            "Content-Encoding": "charset=UTF-8",
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        navgate("/community");
      })
      .catch((error: any) => {
        alertBox(error.response.data);
        console.error(error);
      });
  };

  // 댓글 삭제 api
  const handleCommentDelete = (id: number) => {
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/community/remove/comment`,
        {
          comment_id: id,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
            refresh_token: `${localStorage.getItem("refresh_token")}`,
            "Content-Type": "application/json",
            "Content-Encoding": "charset=UTF-8",
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        alertBox("댓글이 삭제되었습니다.");
        setComment(comment.filter((item: any) => item.id !== id));
      })
      .catch((error: any) => {
        alertBox(error.response.data);
        console.error(error);
      });
  };

  return (
    <>
      <Topbar backUrl="/community" title="커뮤니티"></Topbar>
      {/*본문 내용*/}
      <div className="px-5 my-20 flex flex-col justify-center items-start w-full">
        {/*제목*/}
        <span className="text-2xl font-extrabold mb-3">{detail.title}</span>
        {/* 작성자 정보 */}
        <div className="text-sm flex justify-center items-center gap-3 mb-1">
          <span className="font-semibold">{detail.title}</span>
          <span className="font-semibold">댓글 : {detail.commentCount}개</span>
          <span className="font-semibold">추천 : {detail.likeCount}개</span>
          <span className="font-semibold">조회수 : {detail.viewCount}</span>
        </div>
        <div className="text-sm pb-3 flex justify-between items-center w-full border-b-2 border-zinc-300 mb-4">
          {/*작성일*/}
          <span className="font-semibold">{detail.createDate}</span>
          {/*작성자 삭제버튼*/}
          {localStorage.getItem("nickname") === detail.nickname ? (
            <div className="flex justify-center items-center">
              <button
                className="px-1 py-1 font-bold text-gray"
                onClick={() => {
                  navgate("/community/edit", { state: detail }); //본문 수정
                }}>
                수정
              </button>
              <button
                className="px-1 py-1 font-bold text-gray"
                onClick={() => {
                  handleDelete(); //본문 삭제
                }}>
                삭제
              </button>
            </div>
          ) : null}
        </div>
        {detail.imgUrl == null ? null : <img className="w-full rounded-xl" src={detail.imgUrl}></img>}
        <span className="text-base font-bold my-5 " style={{ letterSpacing: "1.2px", lineHeight: "1.3" }}>
          {detail.content}
        </span>
        <button
          className="self-center text-xl px-4 py-3 bg-main text-white rounded-lg mt-20 mb-3"
          onClick={() => {
            handleLike(); //본문 좋아요
          }}>
          <FontAwesomeIcon icon={faThumbsUp} />
          <span className="ml-2 font-bold">추천</span>
        </button>
        <div className="border-t-2 border-zinc-300 pt-4 w-full flex flex-col justify-center items-center">
          {/*댓글 작성*/}
          <div className="flex justify-center items-center w-full h-20 mb-3">
            <textarea className="align-top w-full h-full p-3 mr-3 border border-zinc-300 rounded-lg" placeholder="댓글을 입력하세요" value={commentText} onChange={handleCommentChange} />
            <button className="w-1/5 h-full text-base py-3 bg-main text-white rounded-lg font-bold" onClick={handleCommentSubmit}>
              작성
            </button>
          </div>
          {/*댓글 내용*/}
          {comment.map((a: any, i: any) => {
            return (
              <div className=" w-full py-3 border-b border-zinc-300" key={i}>
                <div className="flex justify-between items-center gap-3 mb-2">
                  <div className="flex justify-start items-end gap-3">
                    <div className="text-lg font-bold ">{a.nickname}</div>
                    <div className="text-xs font-semibold mb-1">{a.createDate}</div>
                  </div>
                  {localStorage.getItem("nickname") === a.nickname ? (
                    <div className="flex justify-center items-center">
                      <button
                        className="px-1 py-1 font-bold text-gray"
                        onClick={() => {
                          navgate("/community/edit", { state: detail }); //본문 수정
                        }}>
                        수정
                      </button>
                      <button
                        className="text-sm"
                        onClick={() => {
                          handleCommentDelete(a.id); //댓글 삭제
                        }}>
                        <i className="xi-close-min xi-2x"></i>
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="text-base mb-3" style={{ letterSpacing: "1.2px", lineHeight: "1.3" }}>
                  {a.content}
                </div>
                <button
                  className="mt-4 text-sm bg-main text-white px-2 py-1 rounded-lg"
                  onClick={() => {
                    handleCommentLike(a.id); //댓글 좋아요
                  }}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span className="ml-1">{a.likeCount}</span>
                </button>
                <br></br>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CommunityDetail;
