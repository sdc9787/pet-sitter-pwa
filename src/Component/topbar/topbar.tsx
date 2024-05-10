import React from "react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  backUrl?: string;
  title: string;
  sendFunction?: () => void;
  sendText?: string;
}

const Topbar: React.FC<TopbarProps> = ({ backUrl, title, sendFunction, sendText }) => {
  const navigator = useNavigate(); //페이지 이동
  return (
    <div className="whitespace-nowrap z-20 fixed top-0 left-0 right-0 flex items-center justify-center bg-white p-4 shadow-topbar h-16">
      {backUrl ? (
        <div className="w-1/3">
          <i className="xi-angle-left-min xi-2x" onClick={() => navigator(`${backUrl}`)}></i>
        </div>
      ) : (
        <div className="w-1/3 "></div>
      )}

      <div className="w-1/3 flex justify-center text-xl font-black">{title}</div>
      {sendFunction ? (
        <div className="w-1/3 flex justify-end items-center font-black">
          <span onClick={sendFunction}>{sendText}</span>
        </div>
      ) : (
        <div className="w-1/3 flex justify-end items-center"></div>
      )}
    </div>
  );
};

export default Topbar;
