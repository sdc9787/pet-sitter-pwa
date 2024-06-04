import React, { useEffect, useRef, useState } from "react";
import instanceMultipart from "../../../Component/axios/axiosMultipart";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";
import { Camera } from "react-camera-pro";

interface CameraComponent {
  takePhoto: () => any; // Replace 'any' with the actual return type of 'takePhoto'
}

const PartnerShipStep1: React.FC = () => {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const camera = useRef<CameraComponent | null>(null);
  const handleCapture = (photo: string) => {
    setLoading(true);
    setPhoto(photo);
    uploadPhoto(photo);
  };

  const uploadPhoto = async (photo: string) => {
    const formData = new FormData();
    formData.append("identification_image", dataURItoBlob(photo));

    instanceMultipart
      .post("/mypage/partner/apply/step1", formData)
      .then((res) => {
        alertBox("신분증이 등록되었습니다.");
        navigate("/profile/partnerShip/step2");
        console.log(res.data);
      })
      .catch((err) => {
        alertBox("신분증 등록에 실패했습니다.");
        setPhoto(null);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      handleCapture(photo);
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-500 px-4 flex flex-col justify-around items-center">
      <span className="text-white font-bold">신분증 인증</span>
      {photo ? (
        <div className="w-full h-auto relative rounded-lg">
          <img src={photo} alt="Captured" />
          <div className="absolute -left-1 -top-1 -bottom-1 border-4 rounded-full w-1 border-white "></div>
          <div className="absolute -right-1 -top-1 -bottom-1 border-4 rounded-full w-1 border-white "></div>
          <div className="absolute -right-1 -top-1 border-4  rounded-full w-8 border-white "></div>
          <div className="absolute -right-1 -bottom-1 border-4 rounded-full w-8 border-white "></div>
          <div className="absolute -left-1 -top-1 border-4 rounded-full w-8 border-white "></div>
          <div className="absolute -left-1 -bottom-1 border-4 rounded-full w-8 border-white "></div>
        </div>
      ) : (
        <div className="w-full h-auto relative rounded-lg">
          <Camera ref={camera} aspectRatio={16 / 9} facingMode="environment" errorMessages={{}} />
          <div className="absolute -left-1 -top-1 -bottom-1 border-4 rounded-full w-1 border-white "></div>
          <div className="absolute -right-1 -top-1 -bottom-1 border-4 rounded-full w-1 border-white "></div>
          <div className="absolute -right-1 -top-1 border-4  rounded-full w-8 border-white "></div>
          <div className="absolute -right-1 -bottom-1 border-4 rounded-full w-8 border-white "></div>
          <div className="absolute -left-1 -top-1 border-4 rounded-full w-8 border-white "></div>
          <div className="absolute -left-1 -bottom-1 border-4 rounded-full w-8 border-white "></div>
        </div>
      )}

      {!loading ? (
        <>
          <div className="flex flex-col justify-center items-center text-center h-20">
            <span className="text-white font-bold">영역 안에 신분증이 꽉 차도록 배치후</span>
            <span className="text-white font-bold">하단 버튼을 누르면 촬영됩니다.</span>
          </div>
          <div onClick={handleTakePhoto} className="bg-white w-16 h-16 rounded-full flex justify-center items-center">
            <div className="bg-main w-14 h-14 rounded-full"></div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center text-center h-20">
            <i className="xi-spinner-3 xi-spin xi-3x text-white"></i>
            <span className="text-white font-bold">인식중</span>
          </div>
          <div className="bg-white w-16 h-16 rounded-full flex justify-center items-center relative">
            <div className="bg-black opacity-20 w-16 h-16 z-10 rounded-full absolute top-0 left-0"></div>
            <div className="bg-main w-14 h-14 rounded-full"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default PartnerShipStep1;
