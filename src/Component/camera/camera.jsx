// src/components/CameraComponent.js
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";

const CameraComponent = ({ onCapture }) => {
  const camera = useRef(null);

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      onCapture(photo);
    }
  };

  return (
    <div>
      <Camera ref={camera} aspectRatio={16 / 9} facingMode="environment" />
      <button onClick={handleTakePhoto}>Take Photo</button>
    </div>
  );
};

export default CameraComponent;
