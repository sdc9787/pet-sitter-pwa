import React, { useState } from "react";
import CameraComponent from "../../../Component/camera/camera";
import instanceMultipart from "../../../Component/axios/axiosMultipart";
import { useAlert } from "../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router-dom";

const PartnerShipStep1: React.FC = () => {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = (photo: string) => {
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
        navigate("/profile");
        console.log(err);
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

  return (
    <>
      <div className="w-full h-screen bg-zinc-500 flex flex-col justify-start items-center">
        <span className="text-white">신분증 인증</span>
        <CameraComponent onCapture={handleCapture} />
        {photo && <img src={photo} alt="Captured" />}
      </div>
    </>
  );
};

export default PartnerShipStep1;
