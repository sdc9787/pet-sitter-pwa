import React, { useState } from "react";
import CameraComponent from "../../../Component/camera/camera";
import instanceMultipart from "../../../Component/axios/axiosMultipart";

const PartnerShipStep1: React.FC = () => {
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
        console.log(res.data);
      })
      .catch((err) => {
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
    <div>
      <h1>Capture ID Photo</h1>
      <CameraComponent onCapture={handleCapture} />
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
};

export default PartnerShipStep1;
