import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../Component/alertText/alertText";
import Topbar from "../../../Component/topbar/topbar";

const PinCheck = () => {
  const navigate = useNavigate(); //페이지 이동
  const [pin, setPin] = useState<string>(""); //핀번호
  const [keypadNumbers, setKeypadNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]); //키패드 숫자

  const alertBox = useAlert(); //알림창
  useEffect(() => {
    console.log(pin);
    console.log(pin.length);
    if (pin.length === 6) {
      axios
        .post(
          `${import.meta.env.VITE_APP_API_URL}/mypage`,
          {
            pinNumber: pin,
          },
          {
            headers: {
              "Content-Encoding": "charset=UTF-8",
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("Authorization")}`,
              refresh_token: `${localStorage.getItem("refresh_token")}`,
            },
          }
        )
        .then((r: any) => {
          //핀번호가 일치할때
          navigate("/profile/editProfile", { state: { nickname: r.data[0].nickname, phone_number: r.data[0].phoneNumber } });
          console.log(r.data);
        })
        .catch((error: any) => {
          //핀번호가 일치하지 않을때
          keypadnumberRandom();
          setPin("");
          alertBox("핀번호가 일치하지 않습니다.");
        });
    }
  }, [pin]);

  //핀번호 입력
  const handlePinInput = (number: number) => {
    if (pin.length < 6) {
      setPin((prevPin) => prevPin + number);
    }
  };

  //핀번호 전체삭제
  const handleClearPin = () => {
    setPin("");
  };

  //핀번호 백스페이스
  const handleBackspace = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  //키패드 숫자 랜덤
  const keypadnumberRandom = () => {
    setKeypadNumbers((prevNumbers) => {
      const numbers = [...prevNumbers];
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      return numbers;
    });
  };

  //랜더링시 키패드 숫자 랜덤
  useEffect(() => {
    keypadnumberRandom();
  }, []);

  const renderPinDisplay = () => {
    const pinDisplay = [];
    for (let i = 0; i < 6; i++) {
      const filled = i < pin.length;
      pinDisplay.push(<div key={i} className={`w-5 h-5 rounded-full  ml-1 mr-1 ${filled ? "bg-main" : "bg-slate-300"}`}></div>);
    }
    return pinDisplay;
  };

  return (
    <>
      <div className="z-30 w-full h-screen bg-white flex flex-col justify-between items-center">
        <div>
          <div className="text-center mt-32 text-2xl font-black">PIN 비밀번호 입력</div>
          <div className="flex justify-center items-center mt-12">{renderPinDisplay()}</div>
        </div>
        <div className="w-full grid grid-cols-3">
          {keypadNumbers.map((number) => (
            <button className="h-16 border-none bg-main text-white text-2xl" key={number} onClick={() => handlePinInput(number)}>
              {number}
            </button>
          ))}
          <button className="row-start-4 h-16 border-none bg-main text-white" onClick={handleClearPin}>
            전체삭제
          </button>
          <button className="h-16 border-none bg-main text-white" onClick={handleBackspace}>
            <i className="xi-backspace xi-2x"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default PinCheck;
