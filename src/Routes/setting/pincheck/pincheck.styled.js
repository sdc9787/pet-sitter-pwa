import styled from "styled-components";

export const StyledPassword = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px;
  margin-top: 50px;

  label {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: gray;

    /* 인증번호 입력 시 기본 색상 */
    &.input-on-active {
      background-color: blue;
    }
  }

  input {
    width: 20px;
    opacity: 0;
  }
`;
