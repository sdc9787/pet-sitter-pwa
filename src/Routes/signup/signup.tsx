import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import MotionComponent from "../../Component/motion/motion";

function Signup() {
  const navigate = useNavigate(); //페이지 이동
  const [phoneNumber, setPhoneNumber] = useState(""); //핸드폰 번호
  const [year, setYear] = useState(""); //연도
  const [month, setMonth] = useState(""); //월
  const [day, setDay] = useState(""); //일
  const [birthday, setBirthday] = useState(""); //생일
  const [nickname, setNickname] = useState(""); //닉네임
  const [error, setError] = useState("에러 메시지"); //에러 메시지

  const [isChecked, setIsChecked] = useState(false);

  const phoneNumberRef = useRef(null);
  const nickNameRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = React.createRef<HTMLInputElement>();

  //입력창이 가득 찼을 때 다음 입력창으로 포커스 이동
  const handleInputChange = (e: any, nextField: any) => {
    if (e.target.value.length >= e.target.maxLength) {
      nextField.current.focus();
    }
  };

  //핸드폰 번호 입력시 자동으로 '-' 추가
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

  //회원가입 버튼 클릭시
  const handleSignup = () => {
    if (phoneNumber.length < 13) {
      setError("핸드폰 번호를 입력해 주세요.");
      return;
    }
    if (year === "" || month === "" || day === "") {
      setError("생년월일을 입력해 주세요.");
      return;
    }
    if (isChecked === false) {
      setError("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    navigate("/signup/pin-number", { state: { phoneNumber: phoneNumber, birthday: birthday, nickname: nickname } });

    // 회원가입 처리
  };

  //연도, 월, 일이 모두 입력되면 생일을 설정
  useEffect(() => {
    if (year && month && day) {
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      setBirthday(`${year}${formattedMonth}${formattedDay}`);
    }
  }, [year, month, day]);

  useEffect(() => {
    console.log(birthday);
  }, [birthday]);

  //닉네임 입력시 유효성 검사
  const handleNickname = (e: any) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z0-9ㄱ-힣]+$/;

    if (inputValue === "" || regex.test(inputValue)) {
      setNickname(inputValue);
      setError("에러 메시지");
    } else {
      setError("닉네임은 영어, 한글, 숫자만 입력 가능합니다.");
    }
  };
  //연도 입력시 유효성 검사
  const handleYear = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 2024)) {
      setYear(inputValue);
      setError("에러 메시지");
    } else {
      setError("연도는 2024까지만 입력 가능합니다.");
    }
  };

  //월 입력시 유효성 검사
  const handleMonth = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 12)) {
      setMonth(inputValue);
      setError("에러 메시지");
    } else {
      setError("월은 1~12까지만 입력 가능합니다.");
    }
  };

  //일 입력시 유효성 검사
  const handleDay = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 31)) {
      setDay(inputValue);
      setError("에러 메시지");
    } else {
      setError("일은 1~31까지만 입력 가능합니다.");
    }
  };

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <MotionComponent>
        <div className="signup">
          <div className="signup-center">
            <h1 className="signup-center-title">회원가입을 축하합니다</h1>
            <span className="signup-center-content">
              다양한 서비스 제공을 위해 아래의 <br />
              정보를 기입해 주세요
            </span>
          </div>
          <div className="signup-input-box">
            <div className="signup-input-span">
              <span>핸드폰 번호</span>
              <input
                ref={phoneNumberRef}
                type="text"
                value={phoneNumber}
                maxLength={13}
                onChange={(e) => {
                  handlePhoneNumberChange(e);
                  handleInputChange(e, yearRef);
                }}
              />
            </div>
            <div className="signup-input-span">
              <span>연도</span>
              <input
                ref={yearRef}
                type="number"
                min="1900"
                max="2024"
                maxLength={4}
                value={year}
                onChange={(e) => {
                  handleYear(e);
                  handleInputChange(e, monthRef);
                }}
              />
            </div>
            <div className="signup-input-span">
              <span>월</span>
              <input
                ref={monthRef}
                type="number"
                min="1"
                max="12"
                maxLength={2}
                value={month}
                onChange={(e) => {
                  handleMonth(e);
                  handleInputChange(e, dayRef);
                }}
              />
            </div>
            <div className="signup-input-span">
              <span>일</span>
              <input
                ref={dayRef}
                type="number"
                min="1"
                max="31"
                maxLength={2}
                value={day}
                onChange={(e) => {
                  handleDay(e);
                  handleInputChange(e, nickNameRef);
                  // if (e.target.value.length >= e.target.maxLength) {
                  //   e.target.blur();
                  // }
                }}
              />
            </div>
            <div className="signup-input-span">
              <span>닉네임</span>
              <input
                ref={nickNameRef}
                type="text"
                value={nickname}
                maxLength={10}
                onChange={(e) => {
                  handleNickname(e);
                }}
              />
            </div>
          </div>
          {
            <div className="signup-error" style={error === "에러 메시지" ? { color: "white" } : { color: "red" }}>
              {error}
            </div>
          }
          <div className="signup-checkbox">
            <input type="checkbox" id="agree" checked={isChecked} onChange={handleCheckboxChange} />
            <label htmlFor="agree">개인정보 수집 및 이용에 동의합니다.</label>
          </div>
          <button onClick={handleSignup}>다음</button>
        </div>
      </MotionComponent>
    </>
  );
}

export default Signup;
