import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./routes-Styles/signup.css";
import axios from "axios";

function Signup() {
  const navigate = useNavigate(); //페이지 이동

  const [phoneNumber, setPhoneNumber] = useState(""); //핸드폰 번호
  const [pinNumber, setPinNumber] = useState(""); //핀 번호
  const [pinNumberCheck, setPinNumberCheck] = useState(""); //핀 번호 확인

  const [year, setYear] = useState(""); //연도
  const [month, setMonth] = useState(""); //월
  const [day, setDay] = useState(""); //일
  const [birthday, setBirthday] = useState(""); //생일
  const [error, setError] = useState(""); //에러 메시지

  const phoneNumberRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const pinNumberRef = useRef(null);
  const pinNumberCheckRef = React.createRef<HTMLInputElement>();

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

    if (value.length > 2) {
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
    if (pinNumber.length < 6) {
      setError("핀 번호를 입력해 주세요.");
      return;
    }
    if (pinNumber !== pinNumberCheck) {
      setError("핀 번호가 일치하지 않습니다.");
      return;
    }
    // 회원가입 처리
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/signup`,
        {
          phone_number: phoneNumber,
          birthday: birthday,
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

    navigate("/home");
  };

  //연도, 월, 일이 모두 입력되면 생일을 설정
  useEffect(() => {
    if (year && month && day) {
      setBirthday(`${year}-${month}-${day}`);
    }
  }, [year, month, day]);

  //연도 입력시 유효성 검사
  const handleYear = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 2024)) {
      setYear(inputValue);
      setError("");
    } else {
      setError("연도는 2024까지만 입력 가능합니다.");
    }
  };

  //월 입력시 유효성 검사
  const handleMonth = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 12)) {
      setMonth(inputValue);
      setError("");
    } else {
      setError("월은 1~12까지만 입력 가능합니다.");
    }
  };

  //일 입력시 유효성 검사
  const handleDay = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 31)) {
      setDay(inputValue);
      setError("");
    } else {
      setError("일은 1~31까지만 입력 가능합니다.");
    }
  };

  return (
    <>
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
                handleInputChange(e, pinNumberRef);
              }}
            />
          </div>
          {error && <div>{error}</div>}
          <div className="signup-input-span">
            <span>핀 번호</span>
            <input
              ref={pinNumberRef}
              type="password"
              value={pinNumber}
              maxLength={6}
              onChange={(e) => {
                setPinNumber(e.target.value);
                handleInputChange(e, pinNumberCheckRef);
              }}
            />
          </div>
          <div className="signup-input-span">
            <span>핀 번호 확인</span>
            <input
              ref={pinNumberCheckRef}
              type="password"
              value={pinNumberCheck}
              maxLength={6}
              onChange={(e) => {
                setPinNumberCheck(e.target.value);
                if (e.target.value.length === 6 && pinNumberCheckRef.current) {
                  pinNumberCheckRef.current.blur();
                }
              }}
            />
          </div>
        </div>
        <button onClick={handleSignup}>시작하기</button>
      </div>
    </>
  );
}

export default Signup;
