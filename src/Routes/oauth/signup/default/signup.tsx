import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../../Component/topbar/topbar";
import { useAlert } from "../../../../Component/alertText/alertText";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창

  const [passwordState, setPasswordState] = useState<boolean>(false); //비밀번호 확인 상태 [true: 일치, false: 불일치
  const [emailState, setEmailState] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(""); //이메일
  const [password, setPassword] = useState<string>(""); //비밀번호
  const [passwordCheck, setPasswordCheck] = useState<string>(""); //비밀번호 확인
  const [name, setName] = useState<string>(""); //이름
  const [gender, setGender] = useState<string>(""); //성별

  //회원가입 버튼 클릭시
  const handleSignUp = () => {
    if (!email) {
      alertBox("이메일을 입력해주세요");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alertBox("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (!password) {
      alertBox("비밀번호를 입력해주세요");
      return;
    }
    if (!passwordCheck) {
      alertBox("비밀번호가 일치하지 않습니다");
      return;
    }
    if (!name) {
      alertBox("이름을 입력해주세요");
      return;
    }
    if (!gender) {
      alertBox("성별을 선택해주세요");
      return;
    }
    if (password !== passwordCheck) {
      alertBox("비밀번호가 일치하지 않습니다");
      return;
    }
    console.log(email);
    console.log(password);
    console.log(name);
    console.log(gender);
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/join`,
        {
          username: email,
          password: password,
          name: name,
          gender: gender,
        },
        {
          headers: {
            "Content-Encoding": "charset=utf-8",
            "Content-Type": "application/json",
          },
        }
      )
      .then((r: any) => {
        console.log(r.data);
        alertBox("회원가입에 성공했습니다");
        navigate("/oauth/login");
      })
      .catch((error: any) => {
        console.error(error);
        alertBox("회원가입에 실패했습니다.");
      });
  };

  //비밀번호 재확인 state
  useEffect(() => {
    if (password === passwordCheck) {
      setPasswordState(true);
    } else {
      setPasswordState(false);
    }
  }, [passwordCheck, password]);

  //이메일 중복확인
  const handleEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailState(false);
      alertBox("올바른 이메일 형식을 입력해주세요");
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_APP_API_URL}/join/emailCheck`,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Content-Encoding": "charset=UTF-8",
          },
        }
      )
      .then((r: any) => {
        //이메일 중복확인 성공
        setEmailState(true);
        alertBox("사용 가능한 이메일입니다");
      })
      .catch((error: any) => {
        //이메일 중복확인 실패
        setEmailState(false);
        if (error.response.status === 409) {
          alertBox("이미 사용중인 이메일입니다");
        } else alertBox("이메일 중복확인에 실패했습니다");
      });
  };

  return (
    <>
      <div className="z-30 bg-white w-full h-screen  px-6">
        <Topbar title="회원가입" backUrl="/oauth/login" sendText="다음" sendFunction={handleSignUp}></Topbar>
        <div className="flex flex-col gap-7 mt-24">
          {/* 이메일 입력*/}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-start">
              <span className="font-extrabold text-lg mr-2">이메일</span>
              {emailState ? <i className="xi-check-circle-o xi-x text-green-600"></i> : <i className="xi-close-circle-o xi-x text-red-500"></i>}
            </div>
            <div className="flex">
              <input
                type="text"
                className="border p-3 rounded-lg w-full"
                placeholder="이메일 입력"
                onChange={(e) => {
                  setEmailState(false);
                  setEmail(e.target.value);
                }}
              />
              <button
                className="ml-2 font-extrabold p-2 w-28 bg-main text-base text-white rounded-md"
                onClick={() => {
                  handleEmail();
                }}>
                중복 확인
              </button>
            </div>
          </div>
          {/* 비밀번호 입력*/}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-lg">비밀번호</span>
            <input
              type="password"
              className="border p-3 rounded-lg"
              placeholder="비밀번호 입력"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          {/* 비밀번호 확인*/}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-start">
              <span className="font-extrabold text-lg mr-2">비밀번호 확인</span>
              {passwordState && password !== "" ? <i className="xi-check-circle-o xi-x text-green-600"></i> : <i className="xi-close-circle-o xi-x text-red-500"></i>}
            </div>
            <input
              type="password"
              className="border p-3 rounded-lg"
              placeholder="비밀번호 재입력"
              onChange={(e) => {
                setPasswordCheck(e.target.value);
              }}
            />
          </div>
          {/* 이름 입력*/}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-lg">이름</span>
            <input
              type="text"
              className="border p-3 rounded-lg"
              placeholder="이름을 입력해주세요"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          {/* 성별 선택*/}
          <div className="flex items-center gap-5">
            <span className="font-extrabold text-lg">성별</span>
            <label className="flex items-center">
              <input type="radio" value="male" name="gender" onChange={(e) => setGender(e.target.value)} />
              <span className="ml-1 font-bold">남자</span>
            </label>
            <label className="flex items-center ">
              <input type="radio" value="female" name="gender" onChange={(e) => setGender(e.target.value)} />
              <span className="ml-1 font-bold">여자</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
