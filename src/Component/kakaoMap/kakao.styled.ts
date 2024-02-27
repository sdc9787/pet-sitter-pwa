import styled, { css, keyframes } from "styled-components";

interface Props {
  isSelected?: boolean;
  horizontal?: string;
  vertical?: string;
  width?: string;
  height?: string;
  justify_content?: string;
  align_items?: string;
  flex?: string;
  selected?: boolean;
  forPopup?: boolean;
  isOpened?: boolean;
  expand?: boolean;
  isClosed?: boolean;
  isModalOpen?: boolean;
}

export const MapContainer = styled.div<Props>`
  position: relative;
`;

export const Overlay = styled.div<Props>`
  border: 1px solid #bbb;
  border-radius: 8px;
  background-color: white;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Arrow = styled.div<Props>`
  width: 20px;
  height: 10px;
  overflow: hidden;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    border: 1px solid #bbb;
    background-color: white;
    transform: rotate(45deg);
    transform-origin: 0 0;
    position: absolute;
    bottom: 6px;
    left: 50%;
  }
`;

export const PlaceName = styled.p<Props>`
  font-size: 16px;
  padding: 10px 5px 10px 10px;
`;

export const DetailLink = styled.a<Props>`
  background-color: red;
  text-align: center;
  padding: 10px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const SearchBtns = styled.div<Props>`
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const KeywordBtn = styled.button<Props>`
  width: 110px;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.875rem;
  color: white;
  background-color: ${({ selected }) => (selected ? "red" : "blue")};

  &:hover {
    background-color: red;
  }

  @media (max-width: 768px) {
    width: 90px;
    font-size: 0.75rem;
    padding: 8px;
  }
`;

export const ListContainer = styled.div<Props>`
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  bottom: 0;
  width: 400px;
  overflow-y: auto;
  transition: 0.2s;
  border-right: gray;

  ${({ isClosed }) =>
    isClosed &&
    css`
      left: -400px;
    `};
`;

export const SideBarOpenBtn = styled.button<Props>`
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 400px;
  transform: translateY(-50%);
  background-color: white;
  width: 30px;
  height: 80px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border: gray;
  border-left: 0;
  transition: 0.2s;

  ${({ isClosed }) =>
    isClosed &&
    css`
      left: 0px;
    `}
`;

export const ModalContainer = styled.div<Props>`
  @media (max-width: 768px) {
    height: ${({ isClosed }) => (isClosed ? "0px" : "300px")};
    overflow-y: auto;
    transition: 0.3s;
  }
`;

export const List = styled.ul``;

export const Item = styled.li<Props>`
  position: relative;
  padding: 20px;
  border-bottom: 1px solid #bbb;
  background-color: ${({ selected }) => selected && "gray"};

  &:hover {
    background-color: gray;
  }
`;

export const Name = styled.p<Props>`
  font-size: 18px;
  color: blue;
  font-weight: 700;
  margin-bottom: 4px;
  max-width: 310px;

  @media (max-width: 768px) {
    max-width: 280px;
  }
`;

export const Category = styled.p<Props>`
  color: black;
  margin-bottom: 13px;
`;

export const Address = styled.p<Props>`
  font-size: 14px;
  margin-bottom: 5px;
`;

export const Distance = styled.p<Props>`
  margin-right: 10px;
`;

export const RoadAddress = styled.div<Props>`
  font-size: 14px;
  display: flex;
  align-items: center;
  color: black;

  img {
    width: 35px;
  }
`;

export const InfoContainer = styled.div<Props>`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

export const Division = styled.p<Props>`
  margin-right: 10px;
  color: black;
`;

export const PhoneNumber = styled.p<Props>`
  color: green;
`;

export const ShareBtn = styled.button<Props>`
  padding: 7px;
  border-radius: 6px;
  border: yellow;
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const NoList = styled.p<Props>`
  font-size: 18px;
  padding: 20px;
`;

export const Pages = styled.div<Props>`
  text-align: center;
  padding: 15px 0;
  font-size: 18px;
`;

export const PageBtn = styled.button<Props>`
  margin: 0 10px;
  color: ${({ selected }) => selected && "red"};
`;

const slide = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Modal = styled.div<Props>`
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  border: gray;
  border-bottom: 0;
  background-color: white;
  border-radius: 10px 10px 0 0;
  animation: ${slide} 0.3s ease-in-out;
`;

export const ModalBtn = styled.button<Props>`
  display: block;
  margin: 15px auto 10px;
  width: 50px;
  height: 5px;
  background-color: gray;
  border-radius: 5px;
`;

// 현재 내 위치로 돌아가는 버튼
export const GoBackButton = styled.button<Props>`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  width: 55px;
  height: 55px;primary
  background: no-repeat white url("https://cdn-icons-png.flaticon.com/128/406/406217.png") center/contain;
  background-size: 70%;
  border-radius: 10px;
  border: 1px solid yellow;

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    right: 10px;
    bottom: 40px;
  }

  // Modal이 열릴 때만 아래 추가 스타일을 적용
  ${({ isModalOpen }) =>
    isModalOpen &&
    css`
      @media (max-width: 768px) {
        bottom: 340px;
        transition: 0.3s;
      }
    `}
`;

// 접속위치 텍스트
export const GoBackTxt = styled.span<Props>`
  position: absolute;
  bottom: 30px;
  right: 80px;
  z-index: 10;
  width: 90px;
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  text-align: center;
  color: white;
  margin-top: 10px;
  background-color: pink;

  @media (max-width: 768px) {
    font-size: 12px;
    width: 70px;
    height: 25px;
    line-height: 25px;
    right: 60px;
    bottom: 50px;
  }

  // Modal이 열릴 때만 아래 추가 스타일을 적용
  ${({ isModalOpen }) =>
    isModalOpen &&
    css`
      @media (max-width: 768px) {
        bottom: 350px;
      }
    `}
`;

// 현 지도에서 검색 버튼
export const ReSearch = styled.button<Props>`
  position: fixed;
  color: white;
  font-size: 14px;
  bottom: 80px;
  transform: translateX(-50%);
  left: 50%;
  z-index: 10;
  width: 160px;
  height: 40px;
  line-height: 40px;
  border-radius: 30px;
  background-color: pink;

  @media (max-width: 768px) {
    font-size: 12px;
    bottom: 105px;
    width: 130px;
    height: 30px;
    line-height: 30px;
  }

  // Modal이 열릴 때만 아래 추가 스타일을 적용
  ${({ isModalOpen }) =>
    isModalOpen &&
    css`
      @media (max-width: 768px) {
        bottom: 405px;
        transition: 0.3s;
      }
    `}
`;

// 현 지도에서 검색 이미지
export const ReSearchImg = styled.i`
  margin: 7px 1px 0px -4px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 5px;
  }
`;
