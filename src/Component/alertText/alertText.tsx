import React, { useState, useRef } from "react";
import "./alertText.css";

export const useAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAlert = () => {
    setShowAlert(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return [showAlert, triggerAlert] as const;
};

export function AlertText({ state, text }: { state: boolean; text: string }) {
  return <div className={"alertText" + (state ? " alertText-opacity" : "")}>{text}</div>;
}
