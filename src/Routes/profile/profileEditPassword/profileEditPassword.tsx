import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";

const EditPassword = () => {
  const navigator = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const handleEditPassword = () => {
    if (newPassword !== confirmNewPassword) {
      alertBox("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    instanceJson
      .post("/mypage/edit/password", { currentPassword: currentPassword, changePassword: newPassword })
      .then((r: any) => {
        console.log(r.data);
        alertBox("비밀번호 수정이 완료되었습니다.");
        navigator("/profile");
      })
      .catch((error: any) => {
        console.error(error);
        alertBox(`${error.response.data}`);
      });
  };

  return (
    <>
      <Topbar backUrl="/profile" title="비밀번호 수정" sendFunction={handleEditPassword} sendText="완료"></Topbar>
      <div className="bg-white w-full h-screen flex flex-col justify-start items-center">
        <div className="flex flex-col mt-20 w-full p-6 gap-7">
          {/* back에서 현재 비빌번호 확인 추가안함
          비밀번호 변경  */}
          <div>
            <span className="ml-1 font-black">현재 비밀번호</span>
            <input onChange={(e) => setCurrentPassword(e.target.value)} className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="password" />
          </div>
          <div>
            <span className="ml-1 font-black">새 비밀번호</span>
            <input onChange={(e) => setNewPassword(e.target.value)} className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="password" />
          </div>
          <div>
            <span className="ml-1 font-black">새 비밀번호 확인</span>
            <input onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="password" />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPassword;
