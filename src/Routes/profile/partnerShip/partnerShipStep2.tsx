import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Topbar from "../../../Component/topbar/topbar";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import instanceJson from "../../../Component/axios/axiosJson";
import instanceMultipart from "../../../Component/axios/axiosMultipart";

function PartnerShipStep2() {
  const alertBox = useAlert();
  const navigate = useNavigate(); //페이지 이동
  const [image, setImage] = useState<File | null>(null); //이미지
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지
  const [fileName, setFileName] = useState("첨부파일");

  const [address, setAddress] = useState<string>(""); //주소
  const [detailAddress, setDetailAddress] = useState<string>(""); //상세주소
  const [career, setCareer] = useState<string>(""); //경력

  const handleSubmit = () => {
    if (!image) {
      alertBox("이미지를 등록해주세요");
      return;
    }
    if (!address) {
      alertBox("주소를 입력해주세요");
      return;
    }
    if (!detailAddress) {
      alertBox("상세주소를 입력해주세요");
      return;
    }
    if (!career) {
      alertBox("경력을 입력해주세요");
      return;
    }
    console.log(address, detailAddress, career, image);
    const formData = new FormData();
    formData.append("face_image", image);
    formData.append("address", address + " " + detailAddress);
    formData.append("career", career);

    instanceMultipart
      .post(`/mypage/partner/apply/step2`, formData)
      .then((res) => {
        console.log(res.data);
        navigate("/profile/partnerShip/step3");
      })
      .catch((err) => {
        alertBox("파트너쉽 등록에 실패했습니다.");
        console.log(err);
      });
  };

  // 이미지를 선택하는 함수
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      setFileName(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // 이미지 업로드 함수
  const handleImageUpload = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  };

  // 미리보기 이미지를 삭제하는 함수
  const handleRemoveClick = () => {
    setImage(null);
    setPreviewImage(null);
    setFileName("첨부파일");
    const fileInput = document.getElementById("file") as HTMLInputElement;
    fileInput.value = "";
  };

  return (
    <>
      <Topbar title="파트너쉽 등록 (추가정보)" backUrl="/profile"></Topbar>
      <div className="w-full h-screen">
        <div className="mt-18  px-6">
          {/* 이미지 박스 */}
          <div className="w-full flex flex-col items-center justify-center mt-3">
            {previewImage ? (
              <div className="w-full relative">
                {/* 이미지가 있을 때 */}
                <img className="rounded-xl border-bdgray w-full " src={previewImage} alt="preview" />
                <button className="absolute top-1 right-1" onClick={handleRemoveClick}>
                  <i className="xi-close-min xi-3x"></i>
                </button>
              </div>
            ) : (
              <div className="w-full">
                {/* 이미지가 없을 때 */}
                <div className="rounded-xl border-bdgray border-4 border-dashed w-full h-44 bg-white flex justify-center items-center" onClick={handleImageUpload}>
                  <i className="xi-plus-circle-o xi-3x text-bdgray"></i>
                </div>
                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} />
              </div>
            )}
            {/* 파일 버튼 */}
            <div className="flex items-center justify-center w-full mt-3 ">
              {/* <input className="h-10 px-3 align-middle border border-zinc-400 w-3/4 text-zinc-400 font-bold" value={fileName} placeholder="첨부파일" readOnly /> */}
              <label className="rounded-lg flex w-full justify-center items-center py-3 px-5 text-white font-bold bg-main whitespace-nowrap h-10" htmlFor="file">
                프로필 사진 등록
              </label>
              <input className="absolute w-0 h-0 p-0 overflow-hidden border-0" type="file" id="file" onChange={handleImageChange} />
            </div>
            <div className="flex flex-col justify-center items-center mt-2">
              <span className="text-zinc-500 text-sm">얼굴 정면이 보이는 사진을 등록해주세요</span>
              <span className="text-wrap text-center text-zinc-500 text-sm">얼굴이 보이지 않는 경우 서비스 이용제한을 할 수 있습니다</span>
            </div>
            {/* 주소 입력 박스 */}
            <div className="flex flex-col w-full justify-center items-start mt-4 gap-2">
              <span className="font-extrabold text-lg">현재 주소</span>
              <input className="border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" placeholder="지번 주소 or 도로명 주소" onChange={(e) => setAddress(e.target.value)} />
              <span className="font-extrabold text-lg">상세 주소</span>
              <input className="border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" placeholder="OOO동 OOO호" onChange={(e) => setDetailAddress(e.target.value)} />
            </div>
            {/*경력*/}
            <div className="flex flex-col w-full justify-center items-start mt-4 gap-2">
              <span className="font-extrabold text-lg">경력</span>
              <textarea className="mb-20 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black h-28" placeholder="보유하신 모든 경력을 입력해주세요" onChange={(e) => setCareer(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => {
            handleSubmit();
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default PartnerShipStep2;
