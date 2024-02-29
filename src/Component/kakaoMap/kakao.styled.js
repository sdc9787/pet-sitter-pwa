import styled, { css, keyframes } from "styled-components";

// 정적으로 정의된 테마
const theme = {
  colors: {
    white: "#ffffff",
    warning: "#ff0000", // 변경 가능한 색상 값으로 대체하세요
    primary: "#ffffff", // 변경 가능한 색상 값으로 대체하세요
    gray: "#575759", // 변경 가능한 색상 값으로 대체하세요
    bgGray: "#f0f0f0", // 변경 가능한 색상 값으로 대체하세요
    blue: "#0000ff", // 변경 가능한 색상 값으로 대체하세요
    txtColor: "#000000", // 변경 가능한 색상 값으로 대체하세요
    green: "#00ff00", // 변경 가능한 색상 값으로 대체하세요
    secondary: "#ff00ff", // 변경 가능한 색상 값으로 대체하세요
  },
};

export const MapContainer = styled.div`
  position: relative;
`;

export const Overlay = styled.div`
  border: 1px solid #bbb;
  border-radius: 8px;
  background-color: ${theme.colors.white};
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Arrow = styled.div`
  width: 20px;
  height: 10px;
  overflow: hidden;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
`;

export const PlaceName = styled.p`
  font-size: 16px;
  font-weight: 900;
  padding: 10px;
`;

export const DetailLink = styled.a`
  background-color: ${theme.colors.warning};
  text-align: center;
  padding: 10px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  img {
    width: 20px;
    height: 20px;
  }
`;

export const SearchBtns = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const KeywordBtn = styled.button`
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${theme.colors.gray};
  background-color: ${({ selected }) => (selected ? theme.colors.bgGray : theme.colors.primary)};

  &:hover {
    background-color: ${theme.colors.bgGray};
  }

  @media (max-width: 768px) {
    width: 40px;
    font-size: 0.75rem;
    padding: 8px;
  }
`;

export const ListContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  bottom: 0;
  width: 400px;
  overflow-y: auto;
  transition: 0.2s;
  border-right: 1px solid ${theme.colors.gray};

  ${({ isclosed }) =>
    isclosed &&
    css`
      left: -400px;
    `};
`;

export const SideBarOpenBtn = styled.button`
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 400px;
  transform: translateY(-50%);
  background-color: ${theme.colors.white};
  width: 30px;
  height: 80px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border: 1px solid ${theme.colors.gray};
  border-left: 0;
  transition: 0.2s;

  ${({ isclosed }) =>
    isclosed &&
    css`
      left: 0px;
    `}
`;

export const ModalContainer = styled.div`
  @media (max-width: 768px) {
    height: ${({ isclosed }) => (isclosed ? "0px" : "300px")};
    overflow-y: auto;
    transition: 0.3s;
  }
`;

export const List = styled.ul``;

export const Item = styled.li`
  position: relative;
  padding: 20px;
  border-bottom: 1px solid #bbb;
  background-color: ${({ selected }) => selected && theme.colors.bgGray};

  &:hover {
    background-color: ${theme.colors.bgGray};
  }
`;

export const NameCategory = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 5px;
`;

export const Name = styled.p`
  font-size: 18px;
  color: black;
  font-weight: 700;

  max-width: 310px;

  @media (max-width: 768px) {
    max-width: 280px;
  }
`;

export const Category = styled.p`
  color: ${theme.colors.gray};
  font-size: 12px;
  margin-left: 6px;
`;

export const Address = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
`;

export const Distance = styled.p`
  margin-right: 10px;
`;

export const RoadAddress = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${theme.colors.txtColor};

  img {
    width: 35px;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

export const Division = styled.p`
  margin-right: 10px;
  color: ${theme.colors.txtColor};
`;

export const PhoneNumber = styled.p`
  color: #6797e7;
`;

export const ShareBtn = styled.button`
  padding: 5px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.bgGray};
  background-color: yellow;
  color: #2d1c1b;
  position: absolute;
  top: 20px;
  right: 20px;
`;

export const NoList = styled.p`
  font-size: 18px;
  padding: 20px;
`;

export const Pages = styled.div`
  text-align: center;
  padding: 15px 0;
  font-size: 18px;
`;

export const PageBtn = styled.button`
  margin: 0 10px;
  color: ${({ selected }) => selected && theme.colors.warning};
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

export const Modal = styled.div`
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid ${theme.colors.bgGray};
  border-bottom: 0;
  background-color: ${theme.colors.white};
  border-radius: 10px 10px 0 0;
  animation: ${slide} 0.3s ease-in-out;
`;

export const ModalBtn = styled.button`
  width: 50px;
  height: 5px;
  background-color: ${theme.colors.gray};
  border-radius: 5px;
  margin: 10px;
`;

export const ModalBtnDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 현재 내 위치로 돌아가는 버튼
export const GoBackButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${theme.colors.white};
  bottom: 20px;
  right: 20px;
  z-index: 10;
  width: 55px;
  height: 55px;
  border-radius: 100px;
  border: 1px solid ${theme.colors.white};
  transition: 0.3s;
  @media (max-width: 768px) {
    bottom: 40px;
  }

  // Modal이 열릴 때만 아래 추가 스타일을 적용
  ${({ ismodalopen }) =>
    ismodalopen &&
    css`
      @media (max-width: 768px) {
        bottom: 340px;
      }
    `}
`;

// 현 지도에서 검색 버튼
export const ReSearch = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 10px;
  position: fixed;
  font-size: 14px;
  bottom: 80px;
  transform: translateX(-50%);
  left: 50%;
  z-index: 10;
  height: 35px;
  border-radius: 30px;
  color: ${theme.colors.gray};
  background-color: ${theme.colors.primary};
  transition: 0.3s;

  @media (max-width: 768px) {
    font-size: 12px;
    bottom: 100px;
  }

  // Modal이 열릴 때만 아래 추가 스타일을 적용
  ${({ ismodalopen }) =>
    ismodalopen &&
    css`
      @media (max-width: 768px) {
        bottom: 405px;
      }
    `}
`;

// 현 지도에서 검색 이미지
export const ReSearchImg = styled.i``;
