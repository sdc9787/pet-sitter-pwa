import axios from "axios";
import "./routes-Styles/community.css";

function Community() {
  let community = [
    {
      title: "우리집 강아지 어때요", //제목
      content: "우리집 강아지가 너무 귀여워요우리집 강아지가 너무 귀여워요우리집 강아지가 너무 귀여워요우리집 강아지가 너무 귀여워요우리집 강아지가 너무 귀여워요", //내용
      likes: 10, //좋아요
      created_date: "2021-08-24 16:30", //업로드 날짜
      img: "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_960_720.jpg", //이미지
      writer_nickname: "sdc9787", //작성자
      views: 100, //조회수
      commentList: [
        {
          writer_nickname: "김철수",
          reply_date: "2021-08-24",
          reply_content: "너무 귀여워요",
        },
        {
          writer_nickname: "김영희",
          reply_date: "2021-08-24",
          reply_content: "너무 귀여워요",
        },
      ],
    },
  ];

  const url = "/refresh";

  function test() {
    axios
      .post(`${import.meta.env.VITE_APP_API_URL}${url}`, {
        refresh_token: window.localStorage.getItem("refresh_token"),
      })
      .then((r: any) => {
        console.log(r.data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
  return (
    <>
      <div className="community">
        <div className="community-element">
          {community.map((c, i) => {
            return (
              <div key={i} className="community-card">
                <div className="community-card-content-img">
                  <img src={c.img} alt="img" />
                </div>
                <div className="community-card-content">
                  <div className="community-card-content-title">{c.title}</div>
                  <div className="community-card-content-author">{c.writer_nickname}</div>
                  <div className="community-card-content-time">{c.created_date}</div>
                  <div className="community-card-content-comment">
                    <i className="far fa-comment-dots"></i>
                    {/* <span>{c.commentList}</span> 댓글수 계산*/}
                  </div>
                  <div className="community-card-content-viewcount">
                    <i className="far fa-eye"></i>
                    <span>{c.views}</span>
                  </div>
                  <div className="community-card-content-like">
                    <i className="far fa-thumbs-up"></i>
                    <span>{c.likes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={test}>버튼</button>
    </>
  );
}

export default Community;
