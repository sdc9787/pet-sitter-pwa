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
      <div className="w-full h-auto relative rounded-lg">
        <Camera className="rounded-lg" ref={camera} aspectRatio={16 / 9} facingMode="environment" />
        <div className="absolute -left-1 -top-1 -bottom-1 border-4 rounded-full w-1 border-white "></div>
        <div className="absolute -right-1 -top-1 -bottom-1 border-4 rounded-full w-1 border-white "></div>
        <div className="absolute -right-1 -top-1 border-4  rounded-full w-8 border-white "></div>
        <div className="absolute -right-1 -bottom-1 border-4 rounded-full w-8 border-white "></div>
        <div className="absolute -left-1 -top-1 border-4 rounded-full w-8 border-white "></div>
        <div className="absolute -left-1 -bottom-1 border-4 rounded-full w-8 border-white "></div>
      </div>
      <div onClick={handleTakePhoto} className="bg-white w-16 h-16 rounded-full flex justify-center items-center">
        <div className="bg-main w-14 h-14 rounded-full"></div>
      </div>

      {/* <button onClick={handleTakePhoto}>Take Photo</button> */}
    </>
  );
};

export default CameraComponent;
