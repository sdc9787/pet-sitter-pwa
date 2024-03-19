import axios from "axios";
import "./routes-Styles/community.css";
import { useEffect, useState } from "react";

function Community() {
  let community = [
    {
      title: "테스트 제목입니다.", //제목
      content: "테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ", //내용
      likes: 10, //좋아요
      created_date: "1시간전", //업로드 날짜
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
    {
      title: "테스트 제목입니다.", //제목
      content: "테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ", //내용
      likes: 10, //좋아요
      created_date: "1시간전", //업로드 날짜
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
    {
      title: "테스트 제목입니다.", //제목
      content: "테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ", //내용
      likes: 10, //좋아요
      created_date: "1시간전", //업로드 날짜
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
    {
      title: "테스트 제목입니다.", //제목
      content: "테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ", //내용
      likes: 10, //좋아요
      created_date: "1시간전", //업로드 날짜
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
    {
      title: "테스트 제목입니다.", //제목
      content: "테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ", //내용
      likes: 10, //좋아요
      created_date: "1시간전", //업로드 날짜
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
    {
      title: "테스트 제목입니다.", //제목
      content: "테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. 테스트 내용입니다. ", //내용
      likes: 10, //좋아요
      created_date: "1시간전", //업로드 날짜
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
          {community.map((c, i) => {
            return (
              <div key={i} className="community-card">
                <div className="community-card-content">
                  <div className="community-card-content-img">
                    <img src={c.img} alt="img" />
                  </div>
                  <div className="community-card-content-title">{c.title}</div>
                  <div className="community-card-content-writer_nickname">{c.writer_nickname}</div>
                  <div className="community-card-content-content">{c.content}</div>
                  <div className="community-card-content-created_date">{c.created_date}</div>
                  <div className="community-card-content-comment">댓글 : {c.commentList.length}</div>
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
