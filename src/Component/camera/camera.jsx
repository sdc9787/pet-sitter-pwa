// src/components/CameraComponent.js
import React, { useRef } from "react";
import { Camera } from "react-camera-pro";

const CameraComponent = ({ onCapture }) => {
  const camera = useRef(null);

  const handleTakePhoto = () => {
    const photo = camera.current.takePhoto();
    onCapture(photo);
  };

  return (
    <div>
      <Camera ref={camera} aspectRatio={16 / 9} />
      <button onClick={handleTakePhoto}>Take Photo</button>
    </div>
  );
};

export default CameraComponent;
