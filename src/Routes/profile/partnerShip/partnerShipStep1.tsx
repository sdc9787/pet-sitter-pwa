import { useState } from "react";
import CameraComponent from "../../../Component/camera/camera";

function PartnerShipStep1() {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = (photo: string) => {
    setPhoto(photo);
    uploadPhoto(photo);
  };

  const uploadPhoto = async (photo: string) => {
    const formData = new FormData();
    formData.append("file", dataURLtoFile(photo, "id_photo.jpg"));

    try {
      const response = await fetch("YOUR_SERVER_URL/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Photo uploaded successfully");
      } else {
        console.error("Failed to upload photo");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div>
      <h1>Take ID Photo</h1>
      <CameraComponent onCapture={handleCapture} />
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
}

export default PartnerShipStep1;
