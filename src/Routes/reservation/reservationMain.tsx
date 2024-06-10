import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationMainCard from "./reservationMainCard";
import TabBar from "../../Component/tabbar/tabbar";
interface CarouselProps {
  images: string[];
  descriptions: string[];
}

function ReservationMain() {
  const navigate = useNavigate();

  const images = ["/img/home1.jpg", "/img/home2.jpg"];
  const descriptions = ["전문 펫시터가 산책을 해드립니다", "전문 펫시터가 안전하게 돌봐드립니다"];

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="flex items-center justify-between p-6 bg-white">
        <div className="text-3xl font-black text-main">SWR</div>
        <button className="font-bold">이용 안내</button>
      </div>
      {/* Main Card */}
      <div className="border-y border-zinc-500">
        <Carousel images={images} descriptions={descriptions} />
      </div>
      <div className="flex-grow p-4 bg-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <ReservationMainCard navigateProps={Number(localStorage.getItem("partnership")) === 0 ? "/reservation/care" : "/reservation/care/partner"} title="돌봄" description="인증 받은 파트너가 돌봐드려요" />
          <ReservationMainCard navigateProps={Number(localStorage.getItem("partnership")) === 0 ? "/reservation/walk" : "/reservation/walk/partner/list"} title="산책" description="GPS 경로와 함께 산책 모습 확인" />
          <ReservationMainCard navigateProps="/map" title="펫 플레이스" description="반려동물과 함께하는 모든 장소" />
          <ReservationMainCard navigateProps="/community" title="커뮤니티" description="애견인들의 정보공유 공간" />
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function Carousel({ images, descriptions }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-40 relative">
            <img className="h-full w-full object-cover" src={image} alt={`Slide ${index}`} />
            <span className="absolute top-1/3 left-10 w-1/2 break-keep text-white text-xl font-semibold">{descriptions[index]}</span>
          </div>
        ))}
      </div>
      <button className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white p-1" onClick={handlePrev}>
        <i className="xi-angle-left-min xi-2x"></i>
      </button>
      <button className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white p-1" onClick={handleNext}>
        <i className="xi-angle-right-min xi-2x"></i>
      </button>
      <div>
        <div className="absolute bottom-2 w-full flex justify-center">
          {images.map((_, index) => (
            <div key={index} className={`w-2 h-2 rounded-full mx-1 ${currentIndex === index ? "bg-white" : "bg-zinc-400"}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReservationMain;
