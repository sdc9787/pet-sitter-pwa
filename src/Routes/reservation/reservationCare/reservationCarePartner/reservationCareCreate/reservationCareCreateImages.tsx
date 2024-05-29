import React, { useState, ChangeEvent } from "react";
import Topbar from "../../../../../Component/topbar/topbar";
import { useAlert } from "../../../../../hook/useAlert/useAlert";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setImages } from "../../../../../Store/store";
import { DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// 드래그 앤 드롭을 위한 아이템 타입
const ItemType = {
  IMAGE: "image",
};

interface ImageItemProps {
  image: string;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}

interface DragItem {
  index: number;
  type: string;
}

function ImageItem({ image, index, moveImage }: ImageItemProps) {
  const [, ref] = useDrag({
    type: ItemType.IMAGE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.IMAGE,
    hover: (draggedItem: DragItem) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="relative w-1/4 p-1">
      <img src={image} alt={`preview-${index}`} className="w-full h-full rounded-md" />
    </div>
  );
}

function ReservationCareCreateImages() {
  const alertBox = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const images = useSelector((state: RootState) => state.reservationCare.images);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages = files.map((file) => URL.createObjectURL(file));
      setPreviewImages((prevImages) => [...prevImages, ...newImages]);
      setFileNames((prevNames) => [...prevNames, ...files.map((file) => file.name)]);
      dispatch(setImages(files));
    }
  };

  const handleRemoveClick = (index: number) => {
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFileNames((prevNames) => prevNames.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...previewImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setPreviewImages(updatedImages);
  };

  return (
    <>
      <Topbar backUrl="/reservation/care/partner/create/locate" title="이미지 선택"></Topbar>
      <div className="flex flex-col justify-center items-center w-fill h-screen">
        <h1 className="mt-20">이미지는 총 1 ~ 4개까지 업로드 가능합니다</h1>
        <div className="w-full flex flex-col items-center justify-center mt-3">
          {previewImages.length > 0 && (
            <div className="relative w-full mt-3">
              <img className="w-full h-full rounded-md" src={previewImages[0]} alt="preview" />
              <button className="absolute top-0 right-0 border-none text-black text-xl" onClick={() => handleRemoveClick(0)}>
                <i className="xi-close-min xi-2x"></i>
              </button>
            </div>
          )}
          <div className="flex items-center justify-center w-full mt-3">
            <label className="flex justify-center items-center py-3 px-5 text-white font-bold bg-main whitespace-nowrap h-10 ml-3" htmlFor="file">
              파일찾기
            </label>
            <input className="absolute w-0 h-0 p-0 overflow-hidden border-0" type="file" id="file" onChange={handleImageChange} multiple />
          </div>
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-wrap mt-3 w-full">
              {previewImages.map((image, index) => (
                <ImageItem key={index} image={image} index={index} moveImage={moveImage} />
              ))}
            </div>
          </DndProvider>
        </div>
      </div>
    </>
  );
}

export default ReservationCareCreateImages;
