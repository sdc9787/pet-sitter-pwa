import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import instanceJson from "../../../../Component/axios/axiosJson";

const SignUpPinNumber = (props: any) => {
  const alertBox = useAlert(); //알림창

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
      setBirthday(location.state.birth);
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
        instanceJson
          .post("/join/step2", { phoneNumber: phoneNumber, birth: birthday, nickname: nickname, pinNumber: pinNumber })
          .then((r: any) => {
            console.log(r);
            localStorage.setItem("nickname", nickname);
            alertBox("회원가입에 성공했습니다");
            navigate("/reservation");
          })
          .catch((error: any) => {
            console.error(error);
            alertBox("회원가입에 실패했습니다");
          });
      } else {
        keypadnumberRandom();
        setPinBoolean(false);
        setPinNumber("");
        setPinNumberCheck("");
        setPinTitle("PIN 비밀번호 입력");
        alertBox("핀번호가 일치하지 않습니다.");
      }
    }
  }, [pinNumberCheck]);

  //핀번호 입력
  const handlePinInput = (number: number) => {
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

  //핀번호 전체 삭제
  const handleClearPin = () => {
    pinBoolean === false ? setPinNumber("") : setPinNumberCheck("");
  };

  //핀번호 한자리 삭제
  const handleBackspace = () => {
    pinBoolean === false ? setPinNumber((prevPin) => prevPin.slice(0, -1)) : setPinNumberCheck((prevPin) => prevPin.slice(0, -1));
  };

  //키패드 숫자 랜덤으로 섞기
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

  //랜더링 후 핀번호 랜덤으로 섞기
  useEffect(() => {
    keypadnumberRandom();
  }, []);

  //핀번호 화면에 랜더링
  const renderPinDisplay = () => {
    const pinDisplay = [];
    if (pinBoolean === false) {
      for (let i = 0; i < 6; i++) {
        const filled = i < pinNumber.length;
        pinDisplay.push(<div key={i} className={`w-5 h-5 rounded-full  ml-1 mr-1 ${filled ? "bg-main" : "bg-slate-300"}`}></div>);
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const filled = i < pinNumberCheck.length;
        pinDisplay.push(<div key={i} className={`w-5 h-5 rounded-full  ml-1 mr-1 ${filled ? "bg-main" : "bg-slate-300"}`}></div>);
      }
    }
    return pinDisplay;
  };

  return (
    <>
      <div className="z-30 w-full h-screen bg-white flex flex-col justify-between items-center">
        {/* title 글자 */}
        <div>
          <div className="text-center mt-24 text-2xl font-black">{pintitle}</div>
          {/* 핀번호 */}
          <div className="flex justify-center items-center h-24 w-72">{renderPinDisplay()}</div>
        </div>
        {/* 키패드 */}
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

export default SignUpPinNumber;
