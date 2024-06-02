import React, { useRef } from "react";
import Camera from "react-camera-pro";

interface CameraComponentProps {
  onCapture: (photo: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const camera = useRef<any>(null);

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto() as string;
      onCapture(photo);
    }
  };

  return (
    <div>
      <Camera
        ref={camera}
        aspectRatio={16 / 9}
        errorMessages={{
          noCameraAccessible: "카메라에 액세스할 수 없습니다.",
          permissionDenied: "카메라 권한이 거부되었습니다.",
          switchCamera: "카메라를 전환할 수 없습니다.",
          canvas: "캔버스에 문제가 있습니다.",
        }}
      />
      <button onClick={handleTakePhoto}>Take Photo</button>
    </div>
  );
};

export default CameraComponent;
