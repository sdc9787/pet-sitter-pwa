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
      <img src={image} alt={`preview-${index}`} className="w-full h-full rounded-md" />
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
    console.log(images);
    setPreviewImages(images);
  }, [images]);

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
        <div className="w-full flex flex-col items-center justify-center mt-14">
          {previewImages.length > 0 && (
            <div className="relative w-full mt-3 flex items-center justify-center">
              <button onClick={handlePreviousImage} className="absolute left-0  rounded-full p-2">
                <i className="xi-angle-left-min xi-2x font-bold"></i>
              </button>
              <img className="w-full h-full rounded-md" src={previewImages[currentImageIndex]} alt="preview" />
              <button onClick={handleNextImage} className="absolute right-0  rounded-full p-2">
                <i className="xi-angle-right-min xi-2x font-bold"></i>
              </button>
            </div>
          )}
          <div className="flex items-center justify-center w-full mt-3">
            <label className="flex justify-center items-center py-3 px-5 text-white font-bold bg-main whitespace-nowrap h-10 ml-3" htmlFor="file">
              파일찾기
            </label>
            <input className="absolute w-0 h-0 p-0 overflow-hidden border-0" type="file" id="file" onChange={handleImageChange} multiple />
          </div>
          <div className="flex flex-wrap mt-3 w-full">
            {previewImages.map((image, index) => (
              <ImageItem key={index} image={image} index={index} handleRemoveClick={handleRemoveClick} />
            ))}
          </div>
          <div className="flex flex-col">
            <h1>*주의사항*</h1>
            <h1 className="">이미지는 총 1 ~ 4개까지 업로드 가능합니다</h1>
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
