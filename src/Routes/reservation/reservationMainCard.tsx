import React from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  title: string; // title을 props로 받아옴
  description: string; //description을 props로 받아옴
  navigateProps: string; // navigate를 props로 받아옴
}

const ReservationMainCard: React.FC<CardProps> = ({ title, description, navigateProps }) => {
  const navigate = useNavigate(); // navigate를 사용하기 위해 useNavigate를 사용

  return (
    <>
      <div onClick={() => navigate(`${navigateProps}`)} className={"p-4 bg-white rounded-lg shadow-md"}>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">{title}</div>
        </div>
        <p className="text-zinc-500 text-balance break-keep">{description}</p>
      </div>
    </>
  );
};

export default ReservationMainCard;
