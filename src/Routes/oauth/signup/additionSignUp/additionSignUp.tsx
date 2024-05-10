import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../Component/alertText/alertText";
import Topbar from "../../../../Component/topbar/topbar";
import axios from "axios";

function AdditionSignUp() {
  const navigate = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창
  const [phoneNumber, setPhoneNumber] = useState(""); //핸드폰 번호
  const [year, setYear] = useState(""); //연도
  const [month, setMonth] = useState(""); //월
  const [day, setDay] = useState(""); //일
  const [birthday, setBirthday] = useState(""); //생일
  const [nickname, setNickname] = useState(""); //닉네임
  const [nicknameState, setNicknameState] = useState<boolean>(false); //닉네임 중복 상태 [true: 중복, false: 중복아님]
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

  useEffect(() => {
    setNicknameState(false);
  }, [nickname]);

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

  const handleNickName = () => {
    //닉네임 유효성 검사
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/join/step1`,
        {
          nickname: nickname,
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
      .then((res) => {
        setNicknameState(true);
        alertBox("사용 가능한 닉네임입니다");
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 409) {
          setNicknameState(false);
          alertBox("이미 사용중인 닉네임입니다");
        }
      });
  };

  //회원가입 버튼 클릭시
  const handleSignup = () => {
    if (phoneNumber.length < 13) {
      alertBox("핸드폰 번호를 입력해주세요");
      return;
    }
    if (year === "" || month === "" || day === "") {
      alertBox("생년월일을 입력해주세요");
      return;
    }
    if (isChecked === false) {
      alertBox("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    navigate("/oauth/signup/signupPinNumber", { state: { phoneNumber: phoneNumber, birth: birthday, nickname: nickname } });

    // 회원가입 처리
  };

  //연도, 월, 일이 모두 입력되면 생일을 설정
  useEffect(() => {
    if (year && month && day) {
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      setBirthday(`${year}-${formattedMonth}-${formattedDay}`);
    }
  }, [year, month, day]);

  //닉네임 입력시 유효성 검사
  const handleNickname = (e: any) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z0-9ㄱ-힣]+$/;

    if (inputValue === "" || regex.test(inputValue)) {
      setNickname(inputValue);
    } else {
      alertBox("닉네임은 영어, 한글, 숫자만 입력 가능합니다.");
    }
  };
  //연도 입력시 유효성 검사
  const handleYear = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 2024)) {
      setYear(inputValue);
    } else {
      alertBox("연도는 2024까지만 입력 가능합니다.");
    }
  };

  //월 입력시 유효성 검사
  const handleMonth = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 12)) {
      setMonth(inputValue);
    } else {
      alertBox("월은 1~12까지만 입력 가능합니다.");
    }
  };

  //일 입력시 유효성 검사
  const handleDay = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 31)) {
      setDay(inputValue);
    } else {
      alertBox("일은 1~31까지만 입력 가능합니다.");
    }
  };

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
  };

  return (
    <>
      <div className="z-30 bg-white w-full h-screen flex flex-col items-center justify-start gap-5  px-6">
        <Topbar title="회원가입" backUrl="/oauth/login" sendText="완료" sendFunction={handleSignup}></Topbar>
        <div className="flex flex-col items-center gap-5 mb-8 mt-20">
          <h1 className="text-3xl font-black mt-12 mb-5">회원가입을 축하합니다</h1>
          <span className="text-center px-5 font-bold break-keep">다양한 서비스 제공을 위해 아래의 정보를 기입해 주세요</span>
        </div>
        {/* 닉네임 입력창 */}
        <div className="flex flex-col gap-2 w-full bg-white">
          <div className="flex items-center justify-start">
            <span className="font-extrabold text-lg mr-2">닉네임</span>
            {nicknameState ? <i className="xi-check-circle-o xi-x text-green-600"></i> : <i className="xi-close-circle-o xi-x text-red-500"></i>}
          </div>
          <div className="flex">
            <input
              className="border p-3 rounded-lg w-full"
              ref={nickNameRef}
              type="text"
              value={nickname}
              maxLength={10}
              onChange={(e) => {
                handleNickname(e);
              }}
            />
            <button className="ml-2 font-extrabold p-2 w-28 bg-main text-base text-white rounded-md" onClick={handleNickName}>
              중복 검사
            </button>
          </div>
        </div>
        {/* 핸드폰 번호 입력창 */}
        <div className="flex flex-col gap-2 w-full">
          <span className="font-extrabold text-lg">핸드폰 번호</span>
          <input
            className="border p-3 rounded-lg w-full"
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
        {/* 생년월일, 닉네임 입력창 */}
        <div className="flex gap-5 justify-between items-center w-full">
          <div className="flex flex-col gap-2 w-1/3">
            <span className="font-extrabold text-lg">연도</span>
            <input
              className="border p-3 rounded-lg w-full"
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
          <div className="flex flex-col gap-2 w-1/3">
            <span className="font-extrabold text-lg">월</span>
            <input
              className="border p-3 rounded-lg w-full"
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
          <div className="flex flex-col gap-2 w-1/3">
            <span className="font-extrabold text-lg">일</span>
            <input
              className="border p-3 rounded-lg w-full"
              ref={dayRef}
              type="number"
              min="1"
              max="31"
              maxLength={2}
              value={day}
              onChange={(e) => {
                handleDay(e);
                handleInputChange(e, nickNameRef);
              }}
            />
          </div>
        </div>

        {/* 개인정보 수집 및 이용 동의 */}
        <div className="signup-checkbox flex items-center gap-2">
          <input type="checkbox" id="agree" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
          <label htmlFor="agree" className="font-bold">
            개인정보 수집 및 이용에 동의합니다.
          </label>
        </div>
      </div>
    </>
  );
}

export default AdditionSignUp;
