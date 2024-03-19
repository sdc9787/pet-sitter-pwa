import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./routes-Styles/signup.css";

function Signup() {
  const navigate = useNavigate(); //페이지 이동

  const [phoneNumber, setPhoneNumber] = useState(""); //핸드폰 번호
  const [pinNumber, setPinNumber] = useState(""); //핀 번호

  const [year, setYear] = useState(""); //연도
  const [month, setMonth] = useState(""); //월
  const [day, setDay] = useState(""); //일
  const [birthday, setBirthday] = useState(""); //생일
  const [error, setError] = useState(""); //에러 메시지
  useEffect(() => {
    if (year && month && day) {
      setBirthday(`${year}-${month}-${day}`);
    }
  }, [year, month, day]);

  useEffect(() => {
    console.log(birthday);
  }, [birthday]);

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

  const handleSignup = () => {
    // Handle signup logic here
    // You can access the entered values using phoneNumber, pinNumber, and birthday states
    // Perform any necessary validation and API calls
    // After successful signup, navigate to the next page using navigate function
    navigate("/home");
  };

  const handleYear = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 2024)) {
      setYear(inputValue);
      setError("");
    } else {
      setError("연도는 2024까지만 입력 가능합니다.");
    }
  };
  const handleMonth = (e: any) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 12)) {
      setMonth(inputValue);
      setError("");
    } else {
      setError("월은 1~12까지만 입력 가능합니다.");
    }
  };
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
          <h1 className="signup-center-title">환영합니다</h1>
          <span className="signup-center-content">
            다양한 서비스 제공을 위해 아래의 <br />
            정보를 기입해 주세요
          </span>
        </div>
        <div className="signup-input-span">
          <span>핸드폰 번호</span>
          <input type="text" placeholder="핸드폰 번호" value={phoneNumber} onChange={handlePhoneNumberChange} />
        </div>

        <div className="signup-birthday">
          <div className="signup-input-span">
            <span>연도</span>
            <input type="number" min="1900" max="2024" value={year} onChange={handleYear} />
          </div>
          <div className="signup-input-span">
            <span>월</span>
            <input type="number" min="1" max="12" value={month} onChange={handleMonth} />
          </div>

          <div className="signup-input-span">
            <span>일</span>
            <input type="number" min="1" max="31" value={day} onChange={handleDay} />
          </div>
        </div>
        {error && <div>{error}</div>}
        <div className="signup-input-span">
          <span>핀 번호</span>
          <input type="password" placeholder="핀 번호" value={pinNumber} onChange={(e) => setPinNumber(e.target.value)} />
        </div>
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </>
  );
}

export default Signup;
