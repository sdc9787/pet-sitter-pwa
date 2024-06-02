// src/components/CameraComponent.js
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";

const CameraComponent = ({ onCapture }) => {
  const camera = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");

      let backCamera = videoDevices.find((device) => device.label.toLowerCase().includes("back"));
      if (!backCamera && videoDevices.length > 1) {
        // If no 'back' camera is found, assume the second camera is the back camera
        backCamera = videoDevices[1];
      }

      setDeviceId(backCamera?.deviceId || null);
    };

    getDevices();
  }, []);

  const handleTakePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      onCapture(photo);
    }
  };

  return (
    <div>
      {deviceId ? <Camera ref={camera} aspectRatio={16 / 9} numberOfCamerasCallback={4} deviceId={deviceId} /> : <p>Loading camera...</p>}
      <button onClick={handleTakePhoto}>Take Photo</button>
    </div>
  );
};

export default CameraComponent;
