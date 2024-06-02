import React, { useState } from "react";
import CameraComponent from "../../../Component/camera/camera";

const PartnerShipStep1: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = (photo: string) => {
    setPhoto(photo);
    uploadPhoto(photo);
  };

  const uploadPhoto = async (photo: string) => {
    const formData = new FormData();
    formData.append("file", dataURItoBlob(photo));

    try {
      const response = await fetch("https://your-server-endpoint/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Photo uploaded successfully!");
      } else {
        alert("Failed to upload photo.");
      }
    } catch (error) {
      alert("Error uploading photo: " + (error as Error).message);
    }
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
