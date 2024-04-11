import React, { useEffect, useState } from "react";
import "./signup-pinnumber.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SignUpPinNumber = (props: any) => {
  const [error, setError] = useState(""); //에러 메시지
  const [phoneNumber, setPhoneNumber] = useState(""); //핸드폰 번호
  const [nickname, setNickname] = useState(""); //닉네임
  const [birthday, setBirthday] = useState(""); //생일
  const [pinNumber, setPinNumber] = useState(""); //핀 번호
  const [pinNumberCheck, setPinNumberCheck] = useState(""); //핀 번호 확인
  const [pintitle, setPinTitle] = useState("PIN 비밀번호 입력"); //핀번호 입력인지 확인인지 [PIN 비밀번호 입력, PIN 비밀번호 확인
  const location = useLocation();

  const navigate = useNavigate(); //페이지 이동
  const [keypadNumbers, setKeypadNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

  const [pinBoolean, setPinBoolean] = useState(false); //핀번호 확인

  //핸드폰 번호, 생일 props로 받아오기
  useEffect(() => {
    if (location.state) {
      setPhoneNumber(location.state.phoneNumber);
      setBirthday(location.state.birthday);
      setNickname(location.state.nickname);
    }
  }, [location]);

  //핀번호 6자리 입력되면 핀번호 check로 넘어감
  useEffect(() => {
    if (pinNumber.length === 6) {
      setPinBoolean(true);
      setPinTitle("PIN 비밀번호 재입력");
      keypadnumberRandom();
    }
  }, [pinNumber]);

  useEffect(() => {}, [pinNumberCheck]);

  //핀번호 check 6자리 입력되면 회원가입 요청
  useEffect(() => {
    if (pinNumberCheck.length === 6) {
      if (pinNumber === pinNumberCheck) {
        axios
          .post(
            `${import.meta.env.VITE_APP_API_URL}/signup`,
            {
              phone_number: phoneNumber,
              birthday: birthday,
              nickname: nickname,
              pin_number: pinNumber,
            },
            {
              headers: {
                Authorization: `${localStorage.getItem("access_token")}`,
              },
            }
          )
          .then((r: any) => {
            if (r.data?.success) {
              navigate("/home");
            } else {
              setError("회원가입에 실패했습니다.");
            }
          })
          .catch((error: any) => {
            console.error(error);
            setError("회원가입에 실패했습니다.");
          });
      } else {
        keypadnumberRandom();
        setPinBoolean(false);
        setPinNumber("");
        setPinNumberCheck("");
        setPinTitle("PIN 비밀번호 입력");
        setError("핀번호가 일치하지 않습니다.");
      }
    }
  }, [pinNumberCheck]);

  const handlePinInput = (number: number) => {
    setError("");
    if (pinBoolean === false) {
      if (pinNumber.length < 6) {
        setPinNumber((prevPin) => prevPin + number);
      }
    } else {
      if (pinNumberCheck.length < 6) {
        setPinNumberCheck((prevPin) => prevPin + number);
      }
    }
  };

  const handleClearPin = () => {
    pinBoolean === false ? setPinNumber("") : setPinNumberCheck("");
  };

  const handleBackspace = () => {
    pinBoolean === false ? setPinNumber((prevPin) => prevPin.slice(0, -1)) : setPinNumberCheck((prevPin) => prevPin.slice(0, -1));
  };

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

  useEffect(() => {
    keypadnumberRandom();
  }, []);

  const renderPinDisplay = () => {
    const pinDisplay = [];
    if (pinBoolean === false) {
      for (let i = 0; i < 6; i++) {
        const filled = i < pinNumber.length;
        pinDisplay.push(<div key={i} className={`pin-dot ${filled ? "filled" : ""}`}></div>);
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const filled = i < pinNumberCheck.length;
        pinDisplay.push(<div key={i} className={`pin-dot ${filled ? "filled" : ""}`}></div>);
      }
    }
    return pinDisplay;
  };

  return (
    <>
      <div className="signup-pinnumber">
        <div>
          <div className="signup-pinnumber-title">{pintitle}</div>
          <div className="signup-pinnumber-display">{renderPinDisplay()}</div>
          {error && <div className="signup-pinnumber-error">{error}</div>}
        </div>
        <div className="signup-pinnumber-keypad">
          {keypadNumbers.map((number) => (
            <button className="signup-pinnumber-keypad-number" key={number} onClick={() => handlePinInput(number)}>
              {number}
            </button>
          ))}
          <button className="signup-pinnumber-keypad-clear" onClick={handleClearPin}>
            전체삭제
          </button>
          <button className="signup-pinnumber-keypad-backspace" onClick={handleBackspace}>
            <i className="xi-backspace xi-2x"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default SignUpPinNumber;
