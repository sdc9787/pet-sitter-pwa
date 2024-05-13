import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../../../Component/topbar/topbar";
import { useAlert } from "../../../../Component/alertText/alertText";
import instanceMultipart from "../../../../Component/axios/axiosMultipart";

const PetRegister = () => {
  const navigate = useNavigate(); //페이지 이동
  const alertBox = useAlert(); //알림창

  const [name, setName] = useState<string>(""); //이름
  const [age, setAge] = useState<string>(""); //나이
  const [species, setspecies] = useState<string>(""); //견종
  const [gender, setGender] = useState<string>(""); //성별
  //파일 업로드
  const [fileName, setFileName] = useState("첨부파일");
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지
  const [petImage, setPetImage] = useState<File | null>(null); //이미지

  // 이미지 업로드 함수
  const handleImageUpload = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  };

  // 이미지를 선택하는 함수
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPetImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      setFileName(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // 미리보기 이미지를 삭제하는 함수
  const handleRemoveClick = () => {
    setPetImage(null);
    setPreviewImage(null);
    setFileName("첨부파일");
    const fileInput = document.getElementById("file") as HTMLInputElement;
    fileInput.value = "";
  };

  //펫정보 등록api
  const handleSubmit = () => {
    const formData = new FormData();

    if (petImage) {
      formData.append("pet_profile_image", petImage);
    } else {
      alertBox("이미지를 등록해주세요");
      return;
    }

    if (!name) {
      alertBox("이름을 입력해주세요");
      return;
    }

    if (!age) {
      alertBox("나이를 입력해주세요");
      return;
    }

    if (!species) {
      alertBox("견종을 입력해주세요");
      return;
    }
    if (!gender) {
      alertBox("성별을 선택해주세요");
      return;
    }

    formData.append("pet_name", name);
    formData.append("pet_age", age);
    formData.append("species", species);
    formData.append("gender", gender);

    instanceMultipart
      .post("/mypage/pet/add/step1", formData)
      .then((r: any) => {
        console.log(r.data);
        navigate(`/profile/petRegister2/${r.data.petId}`);
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <>
      <Topbar backUrl="/profile/petProfile" title="펫정보 등록" sendText="완료" sendFunction={handleSubmit}></Topbar>
      <div className="bg-white w-full h-screen flex flex-col justify-start items-center">
        {previewImage ? (
          <div className="w-full mt-24 px-6 relative">
            {/* 이미지가 있을 때 */}
            <img className="rounded-xl border-bdgray w-full " src={previewImage} alt="preview" />
            <button className="absolute top-1 right-7" onClick={handleRemoveClick}>
              <i className="xi-close-min xi-3x"></i>
            </button>
          </div>
        ) : (
          <div className="w-full mt-24 px-6">
            {/* 이미지가 없을 때 */}
            <div className="rounded-xl border-bdgray border-4 border-dashed w-full h-44 bg-white flex justify-center items-center" onClick={handleImageUpload}>
              <i className="xi-plus-circle-o xi-3x text-bdgray"></i>
            </div>
            <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} />
          </div>
        )}
        <div className="flex flex-col justify-start items-start w-full gap-7">
          <div className="flex flex-col mt-7 w-full p-6 gap-7">
            {/*이름*/}
            <div className="ml-1 font-black">
              <span>이름</span>
              <input className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" onChange={(e) => setName(e.target.value)} />
            </div>
            {/*나이*/}
            <div className="ml-1 font-black">
              <span>나이</span>
              <input className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" onChange={(e) => setAge(e.target.value)} />
            </div>
            {/*견종*/}
            <div className="ml-1 font-black">
              <span>견종</span>
              <input className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" onChange={(e) => setspecies(e.target.value)} />
            </div>
            <div className="flex items-center gap-5 mb-20">
              <span className="font-extrabold text-lg">성별</span>
              <label className="flex items-center">
                <input type="radio" value="male" name="gender" onChange={(e) => setGender(e.target.value)} />
                <span className="ml-1 font-bold">남자아이</span>
              </label>
              <label className="flex items-center ">
                <input type="radio" value="female" name="gender" onChange={(e) => setGender(e.target.value)} />
                <span className="ml-1 font-bold">여자아이</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetRegister;
