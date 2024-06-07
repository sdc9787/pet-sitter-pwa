import React, { useState, ChangeEvent, useEffect } from "react";
import Topbar from "../../../../../Component/topbar/topbar";
import { useAlert } from "../../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setImages } from "../../../../../Store/store";
import ActionBtn from "../../../../../Component/actionBtn/actionBtn";

interface ImageItemProps {
  image: string;
  index: number;
  handleRemoveClick: (index: number) => void;
}

function ImageItem({ image, index, handleRemoveClick }: ImageItemProps) {
  return (
    <div className="relative w-1/4 p-1">
      <img src={image} alt={`preview-${index}`} className="w-full h-full rounded-md object-cover" />
      <button className="absolute top-0 right-0 border-none text-black text-xl" onClick={() => handleRemoveClick(index)}>
        <i className="xi-close-min xi-2x"></i>
      </button>
    </div>
  );
}

function ReservationCareCreateImages() {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const images = useSelector((state: RootState) => state.reservationCare.images);
  const [previewImages, setPreviewImages] = useState<string[]>(images);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    setPreviewImages(images);
  }, [images]);

  // 이미지 업로드 함수
  const handleImageUpload = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages = files.map((file) => URL.createObjectURL(file));
      const updatedImages = [...previewImages, ...newImages];
      setPreviewImages(updatedImages);
      setFileNames((prevNames) => [...prevNames, ...files.map((file) => file.name)]);
      dispatch(setImages(updatedImages));
    }
  };

  const handleRemoveClick = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    setFileNames((prevNames) => prevNames.filter((_, i) => i !== index));
    dispatch(setImages(updatedImages));
    if (currentImageIndex >= index && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < previewImages.length - 1 ? prevIndex + 1 : prevIndex));
  };

  return (
    <>
      <Topbar backUrl="/reservation/care/partner/create/locate" title="이미지 선택"></Topbar>
      <div className="flex flex-col justify-start items-center w-full h-screen p-4">
        <div className="bg-white w-full h-screen flex flex-col justify-start items-center">
          {previewImages.length > 0 ? (
            <>
              <div className="relative w-full mt-18 flex items-center justify-center h-60 overflow-hidden border rounded-md bg-gray-100">
                <button onClick={handlePreviousImage} className="absolute left-0 rounded-full p-2">
                  <i className="xi-angle-left-min xi-2x font-bold"></i>
                </button>
                <img className="w-full h-full object-cover rounded-md" src={previewImages[currentImageIndex]} alt="preview" />
                <button onClick={handleNextImage} className="absolute right-0 rounded-full p-2">
                  <i className="xi-angle-right-min xi-2x font-bold"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full mt-24 px-6">
              {/* 이미지가 없을 때 */}
              <div onClick={handleImageUpload} className="rounded-xl border-bdgray border-4 border-dashed w-full h-44 bg-white flex justify-center items-center">
                <i className="xi-plus-circle-o xi-3x text-bdgray"></i>
              </div>
              <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} />
            </div>
          )}

          <div className="flex items-center justify-center w-full mt-3">
            <label className="flex justify-center items-center py-3 px-5 text-white font-bold bg-main whitespace-nowrap h-10" htmlFor="file">
              파일찾기
            </label>
            <input className="absolute w-0 h-0 p-0 overflow-hidden border-0" type="file" id="file" onChange={handleImageChange} multiple />
          </div>
          <div className="flex flex-wrap mt-3 w-full">
            {previewImages.map((image, index) => (
              <ImageItem key={index} image={image} index={index} handleRemoveClick={handleRemoveClick} />
            ))}
          </div>
          <div className="m-8 text-nowrap relative  flex flex-col justify-center items-center p-4 border border-black rounded-xl">
            <div className="absolute -top-4 bg-white px-2 font-bold">주의 사항</div>
            <div className="text-sm font-semibold text-zinc-500">최소 1개 이상의 파일을 업로드 하셔야 됩니다</div>
            <div className="text-sm font-semibold text-zinc-500">파일은 1 ~ 3개 까지 동시에 업로드 가능합니다</div>
          </div>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => {
            if (previewImages.length === 0) {
              alertBox("이미지를 업로드해주세요");
            } else {
              navigate("/reservation/care/partner/create/post");
            }
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationCareCreateImages;
