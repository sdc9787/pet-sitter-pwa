import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MotionComponent from "../../../Component/motion/motion";
import "./pet-register.css";

const PetRegister = () => {
  const navigate = useNavigate(); //페이지 이동

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");

  //파일 업로드
  const [fileName, setFileName] = useState("첨부파일");
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지
  const [petImage, setPetImage] = useState<File | null>(null); //이미지
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

  const handleSubmit = async () => {
    const formData = new FormData();

    if (petImage) {
      formData.append("pet_profile_image", petImage);
    } else {
      console.log("이미지를 첨부해주세요");
      return;
    }

    if (!name) {
      console.log("이름을 입력해주세요");
      return;
    }

    if (!age) {
      console.log("나이를 입력해주세요");
      return;
    }

    if (!breed) {
      console.log("견종을 입력해주세요");
      return;
    }

    formData.append("pet_name", name);
    formData.append("pet_age", age);
    formData.append("species", breed);

    axios
      .post(`${import.meta.env.VITE_APP_API_URL}/mypage/pet-info/profile`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r: any) => {
        console.log(r.data);
        navigate("/setting/pet-info");
      })
      .catch((error: any) => {
        console.error(error);
      });
  };
  //스크롤 이벤트
  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScroll);
  });

  return (
    <>
      <MotionComponent>
        <div className="pet-register">
          <div className={(scrollPosition < 1 ? "" : "setting-setting-shadow ") + " setting-setting"}>
            <i
              className="xi-angle-left-min xi-2x"
              onClick={() => {
                navigate("/setting/pet-info");
              }}></i>
          </div>
          {previewImage && (
            <div className="community-create-content-file-img">
              <img src={previewImage} alt="preview" />
              <button onClick={handleRemoveClick}>
                <i className="xi-close-min xi-2x"></i>
              </button>
            </div>
          )}
          <div className="filebox">
            <input className="upload-name" value={fileName} placeholder="첨부파일" readOnly />
            <label htmlFor="file">파일찾기</label>
            <input type="file" id="file" onChange={handleImageChange} />
          </div>
          <div className="pet-register-title">기본 정보</div>
          <div className="pet-register-name">
            <span>이름</span>
            <input type="text" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="pet-register-age">
            <span>나이</span>
            <input type="text" onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="pet-register-breed">
            <span>견종</span>
            <input type="text" onChange={(e) => setBreed(e.target.value)} />
          </div>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </MotionComponent>
    </>
  );
};

export default PetRegister;
