import React, { useEffect, useRef, useState } from "react";
import "./edit-info.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [nickname, setNickname] = useState<string>("");
  const [nicknamePlaceholder, setNicknamePlaceholder] = useState<string>(""); //닉네임 입력창 placeholder
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneNumberPlaceholder, setPhoneNumberPlaceholder] = useState<string>(""); //핸드폰 번호 입력창 placeholder
  const [pinNumber, setPinNumber] = useState<string>("");
  const [pinNumberCheck, setPinNumberCheck] = useState<string>("");
  const [error, setError] = useState<string>("");

  const phoneNumberRef = useRef(null);
  const pinNumberRef = useRef(null);
  const pinNumberCheckRef = React.createRef<HTMLInputElement>();

  const location = useLocation(); //현재 경로에 대한 정보를 제공하는 hook

  useEffect(() => {
    if (location.state) {
      setPhoneNumber(location.state.phone_number);
      setNickname(location.state.nickname);
      setPhoneNumberPlaceholder(location.state.phone_number);
      setNicknamePlaceholder(location.state.nickname);
    }
  }, [location]);

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
  const handleInputChange = (e: any, nextField: any) => {
    if (e.target.value.length >= e.target.maxLength) {
      nextField.current.focus();
    }
  };

  const handleEditProfile = () => {
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
      })
      .catch((error: any) => {
        console.error(error);
        setError("프로필 수정에 실패했습니다.");
      });
  };

  return (
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
            placeholder={phoneNumberPlaceholder}
            maxLength={13}
            onChange={(e) => {
              handlePhoneNumberChange(e);
              handleInputChange(e, pinNumberRef);
            }}
          />
        </div>
        <div className="edit-profile-input-span">
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
        <div className="edit-profile-input-span">
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
      {error && <div className="edit-profile-error">{error}</div>}
      <button onClick={handleEditProfile}>수정하기</button>
    </div>
  );
};

export default EditProfile;
