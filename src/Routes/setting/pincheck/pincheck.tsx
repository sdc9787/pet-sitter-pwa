import React, { useEffect, useState } from "react";
import "./pincheck.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PinCheck = () => {
  const navigate = useNavigate(); //페이지 이동
  const [pin, setPin] = useState<string>("");
  const [keypadNumbers, setKeypadNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

  useEffect(() => {
    console.log(pin);
    console.log(pin.length);
    if (pin.length === 6) {
      axios
        .post(
          `${import.meta.env.VITE_APP_API_URL}/mypage/pin-check`,
          {
            pin_number: pin,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("access_token")}`,
            },
          }
        )
        .then((r: any) => {
          navigate("/setting/edit-info");
          console.log(r.data);
        })
        .catch((error: any) => {
          setPin("");
          console.error(error.response.data.bad);
        });
    }
  }, [pin]);

  const handlePinInput = (number: number) => {
    if (pin.length < 6) {
      setPin((prevPin) => prevPin + number);
    }
  };

  const handleClearPin = () => {
    setPin("");
  };

  const handleBackspace = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  useEffect(() => {
    setKeypadNumbers((prevNumbers) => {
      const numbers = [...prevNumbers];
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      return numbers;
    });
  }, []);

  const renderPinDisplay = () => {
    const pinDisplay = [];
    for (let i = 0; i < 6; i++) {
      const filled = i < pin.length;
      pinDisplay.push(<div key={i} className={`pin-dot ${filled ? "filled" : ""}`}></div>);
    }
    return pinDisplay;
  };

  return (
    <div className="pincheck">
      <div>
        <div className="pincheck-title">PIN 비밀번호 입력</div>
        <div className="pincheck-display">{renderPinDisplay()}</div>
      </div>
      <div className="pincheck-keypad">
        {keypadNumbers.map((number) => (
          <button className="pincheck-keypad-number" key={number} onClick={() => handlePinInput(number)}>
            {number}
          </button>
        ))}
        <button className="pincheck-keypad-clear" onClick={handleClearPin}>
          전체삭제
        </button>
        <button className="pincheck-keypad-backspace" onClick={handleBackspace}>
          <i className="xi-backspace xi-2x"></i>
        </button>
      </div>
    </div>
  );
};

export default PinCheck;
