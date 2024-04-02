import React, { useEffect, useRef, useState } from "react";
import "./edit-info.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectedTab } from "../../../Store/store";

const EditProfile = () => {
  const dispatch = useDispatch(); //dispatch 함수
  const navigator = useNavigate(); //페이지 이동
  const [nickname, setNickname] = useState<string>(""); //닉네임
  const [nicknamePlaceholder, setNicknamePlaceholder] = useState<string>(""); //닉네임 입력창 placeholder
  const [phoneNumber, setPhoneNumber] = useState<string>(""); //핸드폰 번호
  const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState<string>(""); //핸드폰 번호 입력창 placeholder
  const [error, setError] = useState<string>("에러 메시지"); //에러메세지

  const phoneNumberRef = React.createRef<HTMLInputElement>(); //핸드폰 번호

  const [keypadNumbers, setKeypadNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

  const location = useLocation(); //현재 경로에 대한 정보를 제공하는 hook

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

    if (pinNumber !== pinNumberCheck) {
      setError("핀번호가 일치하지 않습니다.");
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/mypage/edit-info`,
        {
          phone_number: phoneNumber,
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
        console.log(r.data);
        setError("에러 메시지");
        dispatch(selectedTab(0));
        navigator("/home");
      })
      .catch((error: any) => {
        console.error(error);

        error.response.status == 400 ? setError(error.response.data.bad) : setError("프로필 수정에 실패했습니다.");
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
      <div className="edit-profile">
        <div className="edit-profile-center">
          <h1 className="edit-profile-center-title">프로필 수정</h1>
          <span className="edit-profile-center-content">
            정보를 수정하려면 아래의 <br />
            필드를 업데이트하세요
          </span>
        </div>
        <div className="edit-profile-input-box">
          <div className="edit-profile-input-span">
            <span>닉네임</span>
            <input type="text" placeholder={nicknamePlaceholder} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="edit-profile-input-span">
            <span>핸드폰 번호</span>
            <input
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
          <div className="edit-profile-input-span">
            <span>핀 번호</span>
            <input
              type="password"
              value={pinNumber}
              maxLength={6}
              onClick={() => {
                keypadnumberRandom();
                setPinNumber("");
                setPinNumberState(true);
                setPinBoolean(false);
                setPinTitle("PIN 비밀번호 입력");
              }}
            />
          </div>
          <div className="edit-profile-input-span">
            <span>핀 번호 확인</span>
            <input
              type="password"
              value={pinNumberCheck}
              maxLength={6}
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
        <div className="signup-error" style={error === "에러 메시지" ? { color: "white" } : { color: "red" }}>
          {error}
        </div>
        <button onClick={handleEditProfile}>수정하기</button>
      </div>
      {pinNumberState ? (
        <div className="edit-pinnumber">
          <div className="signup-pinnumber">
            <div>
              <div className="signup-pinnumber-title">{pintitle}</div>
              <div className="signup-pinnumber-display">{renderPinDisplay()}</div>
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
        </div>
      ) : null}
    </>
  );
};

export default EditProfile;
