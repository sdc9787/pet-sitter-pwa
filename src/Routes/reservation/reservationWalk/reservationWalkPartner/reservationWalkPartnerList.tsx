import { useEffect, useState, useRef } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useGeolocation } from "../../../../hook/useGeolocation/useGeolocation";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";

interface WalkList {
  id: number;
  petId: number;
  userNickname: string;
  walkTime: number;
  title: string;
  content: string;
  distance: number;
  address: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  createDate: string;
}

function ReservationWalkPartnerList() {
  const alertBox = useAlert();
  const navigate = useNavigate();

  return (
    <>
      <Topbar backUrl="/reservation" title="산책 매칭"></Topbar>

      <ActionBtn
        buttonCount={2}
        button1Props={{
          text: "신청글 작성",
          color: "bg-zinc-400",
          onClick: () => {
            navigate("/reservation/walk");
          },
        }}
        button2Props={{
          text: "예약 신청",
          color: "bg-main",
          onClick: () => {
            navigate("/reservation/walk");
          },
        }}></ActionBtn>
    </>
  );
}

export default ReservationWalkPartnerList;
