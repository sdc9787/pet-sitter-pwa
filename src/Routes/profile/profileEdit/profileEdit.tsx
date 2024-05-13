import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectedTab } from "../../../Store/store";
import { useAlert } from "../../../Component/alertText/alertText";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";

const EditProfile = () => {
  const navigator = useNavigate(); //페이지 이동
  const [nickname, setNickname] = useState<string>(""); //닉네임
  const [nicknamePlaceholder, setNicknamePlaceholder] = useState<string>(""); //닉네임 입력창 placeholder
  const [phoneNumber, setPhoneNumber] = useState<string>(""); //핸드폰 번호
  const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState<string>(""); //핸드폰 번호 입력창 placeholder

  const phoneNumberRef = React.createRef<HTMLInputElement>(); //핸드폰 번호

  const [keypadNumbers, setKeypadNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

  const location = useLocation(); //현재 경로에 대한 정보를 제공하는 hook
  const alertBox = useAlert(); //알림창

  //폰번호와 닉네임이 있으면 placeholder에 넣어줌
  useEffect(() => {
    if (location.state) {
      setPhoneNumberPlaceholder(location.state.phone_number);
      setNicknamePlaceholder(location.state.nickname);
    }
  }, [location]);

  //폰번호 입력시 - 추가
  const handlePhoneNumberChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 남김
    let formattedValue = "";

    if (value.length > 3) {
      const part1 = value.slice(0, 3);
      const part2 = value.slice(3, 7);
      const part3 = value.slice(7, 11);

      if (value.length < 8) {
        formattedValue = `${part1}-${part2}`;
      } else {
        formattedValue = `${part1}-${part2}-${part3}`;
      }
    } else {
      formattedValue = value;
    }

    setPhoneNumber(formattedValue);
  };

  //인풋창 이동
  const handleInputChange = (e: any, nextField: any) => {
    if (e.target.value.length >= e.target.maxLength) {
      nextField.current.focus();
    }
  };

  //프로필 수정 api
  const handleEditProfile = () => {
    //todo 핀번호 확인 조건 추가
    console.log(123);

    if (pinNumber !== pinNumberCheck) {
      alertBox("핀번호가 일치하지 않습니다.");
      return;
    }
    instanceJson
      .post("/mypage/edit/info", { phoneNumber: phoneNumber, nickname: nickname, pinNumber: pinNumber })
      .then((r: any) => {
        console.log(r.data);
        alertBox("프로필 수정이 완료되었습니다.");
        window.localStorage.setItem("nickname", nickname); //닉네임 갱신
        navigator("/profile");
      })
      .catch((error: any) => {
        console.error(error);
        alertBox(`${error.response.data}`);
      });
  };

  //--------------------------------------------
  //핀번호 수정 페이지
  //핀번호 6자리 입력되면 핀번호 check로 넘어감

  const [pinNumber, setPinNumber] = useState<string>("");
  const [pinNumberCheck, setPinNumberCheck] = useState<string>("");
  const [pintitle, setPinTitle] = useState("PIN 비밀번호 입력"); //핀번호 입력인지 확인인지 [PIN 비밀번호 입력, PIN 비밀번호 확인

  //pinNumber수정 페이지
  const [pinNumberState, setPinNumberState] = useState(false); //핀번호 입력창
  const [pinBoolean, setPinBoolean] = useState(false); //핀번호 확인

  useEffect(() => {
    if (pinNumber.length === 6) {
      setPinNumberState(false);
    }
  }, [pinNumber]);

  useEffect(() => {
    if (pinNumberCheck.length === 6) {
      setPinNumberState(false);
    }
  }, [pinNumberCheck]);

  useEffect(() => {}, [pinNumberCheck]);

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

  //핀번호 초기화
  const handleClearPin = () => {
    pinBoolean === false ? setPinNumber("") : setPinNumberCheck("");
  };

  //백스페이스
  const handleBackspace = () => {
    pinBoolean === false ? setPinNumber((prevPin) => prevPin.slice(0, -1)) : setPinNumberCheck((prevPin) => prevPin.slice(0, -1));
  };

  //키패드 순서 랜덤 배치
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

  //페이지 로드시 키패드 랜덤 배치
  useEffect(() => {
    keypadnumberRandom();
  }, []);

  //핀번호 입력창
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
      <Topbar backUrl="/profile" title="프로필 수정" sendFunction={handleEditProfile} sendText="완료"></Topbar>
      <div className="bg-white w-full h-screen flex flex-col justify-start items-center">
        <div className="flex flex-col mt-20 w-full p-6 gap-7">
          <div className="">
            <span className="ml-1 font-black">닉네임</span>
            <input className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-bold" type="text" placeholder={nicknamePlaceholder} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div>
            <span className="ml-1 font-black">핸드폰 번호</span>
            <input
              className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-bold"
              ref={phoneNumberRef}
              type="text"
              value={phoneNumber}
              placeholder={phoneNumberPlaceholder}
              maxLength={13}
              onChange={(e) => {
                handlePhoneNumberChange(e);
                if (e.target.value.length === 13 && phoneNumberRef.current) {
                  phoneNumberRef.current.blur();
                }
              }}
            />
          </div>
          <div>
            <span className="ml-1 font-black">핀 번호</span>
            <input
              className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black"
              type="password"
              value={pinNumber}
              maxLength={6}
              readOnly
              onClick={() => {
                keypadnumberRandom();
                setPinNumber("");
                setPinNumberState(true);
                setPinBoolean(false);
                setPinTitle("PIN 비밀번호 입력");
              }}
            />
          </div>
          <div>
            <span className="ml-1 font-black">핀 번호 확인</span>
            <input
              className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black"
              type="password"
              value={pinNumberCheck}
              maxLength={6}
              readOnly
              onClick={() => {
                keypadnumberRandom();
                setPinNumberCheck("");
                setPinNumberState(true);
                setPinBoolean(true);
                setPinTitle("PIN 비밀번호 재입력");
              }}
            />
          </div>
        </div>
      </div>
      {pinNumberState ? (
        <div className="z-30 fixed w-screen h-screen">
          <i className="fixed top-4 left-4 xi-angle-left-min xi-2x" onClick={() => setPinNumberState(false)}></i>
          <div className="z-30 w-full h-screen bg-white flex flex-col justify-between items-center">
            <div>
              <div className="text-center mt-32 text-2xl font-black">{pintitle}</div>
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
        </div>
      ) : null}
    </>
  );
};

export default EditProfile;
