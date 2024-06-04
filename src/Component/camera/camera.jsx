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
    <>
      <div className="w-full h-auto relative">
        <Camera ref={camera} aspectRatio={16 / 9} facingMode="environment" />
        <div className="absolute left-0 top-0 bottom-0 w-5 border-l-2 border-y-2 border-white"></div>
        <div className="absolute right-0 top-0 bottom-0 w-5 border-r-2 border-y-2 border-white"></div>
      </div>
      <button onClick={handleTakePhoto}>Take Photo</button>
    </>
  );
};

export default CameraComponent;
