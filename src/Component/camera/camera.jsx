// src/components/CameraComponent.js
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";

const CameraComponent = ({ onCapture }) => {
  const camera = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      const backCamera = videoDevices.find((device) => device.label.toLowerCase().includes("back")) || videoDevices[0];
      if (backCamera) {
        setDeviceId(backCamera.deviceId);
      }
    });
  }, []);

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      onCapture(photo);
    }
  };

  return (
    <div>
      {deviceId && <Camera ref={camera} aspectRatio={16 / 9} deviceId={deviceId} />}
      <button onClick={handleTakePhoto}>Take Photo</button>
    </div>
  );
};

export default CameraComponent;
