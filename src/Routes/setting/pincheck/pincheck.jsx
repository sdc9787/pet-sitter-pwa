import React, { useState, useEffect, useRef } from "react";
import { StyledPassword } from "./pincheck.styled";
import PasswordPresentor from "./password-presentor";

export default function Password() {
  // 함수들은 Class 를 외부에서 생성하여 import를 하여 사용하였다.
  const passwordPresentor = new PasswordPresentor(); // 인스턴스 생성

  const inputRef = useRef([]); // value들을 담을 ref 배열

  // input value
  const [state, setState] = useState({
    value1: "",
    value2: "",
    value3: "",
    value4: "",
    value5: "",
    value6: "",
  });

  // input onChange
  const handleInputChange = (e) => {
    passwordPresentor.handleInputChange(e, state, setState);
  };

  // value 입력 시, 다음 Index로 focus 이동
  const handleNextFocus = () => {
    passwordPresentor.handleNextFocus(inputRef);
  };

  // value 삭제
  const handleDeleteEvent = (e) => {
    passwordPresentor.handleDeleteEvent(e, inputRef, state, setState);
  };

  // 랜덤한 value 클릭 시, 비어있는 index에 focus 지정
  const emptyIndexFocus = () => {
    passwordPresentor.emptyIndexFocus(inputRef);
  };

  // value 값 존재 시에, 색상 변경
  const valueColorActive = (checkState) => {
    return checkState ? "input-on-active" : undefined;
  };

  useEffect(() => {
    inputRef.current[0].focus(); // 마운트 > 첫 번째 value에 focus
    handleNextFocus(); // 각각의 value에 값을 입력 시, 다음 value 로 focus 이동
  }, [state]); // dependency 에 state 를 넣음으로써, state의 값이 변경될 때마다 리렌더링

  return (
    <StyledPassword>
      <div className="masking-input">
        <label className={valueColorActive(state.value1)}>
          <input type="number" value={state.value1} name="value1" pattern="\d*" inputMode="numeric" ref={(el) => (inputRef.current[0] = el)} onClick={emptyIndexFocus} onChange={handleInputChange} onKeyDown={handleDeleteEvent} />
        </label>
        <label className={valueColorActive(state.value2)}>
          <input type="number" value={state.value2} name="value2" pattern="\d*" inputMode="numeric" ref={(el) => (inputRef.current[1] = el)} onClick={emptyIndexFocus} onChange={handleInputChange} onKeyDown={handleDeleteEvent} />
        </label>
        <label className={valueColorActive(state.value3)}>
          <input type="number" value={state.value3} name="value3" pattern="\d*" inputMode="numeric" ref={(el) => (inputRef.current[2] = el)} onClick={emptyIndexFocus} onChange={handleInputChange} onKeyDown={handleDeleteEvent} />
        </label>
        <label className={valueColorActive(state.value4)}>
          <input type="number" value={state.value4} name="value4" pattern="\d*" inputMode="numeric" ref={(el) => (inputRef.current[3] = el)} onClick={emptyIndexFocus} onChange={handleInputChange} onKeyDown={handleDeleteEvent} />
        </label>
        <label className={valueColorActive(state.value5)}>
          <input type="number" value={state.value5} name="value5" pattern="\d*" inputMode="numeric" ref={(el) => (inputRef.current[4] = el)} onClick={emptyIndexFocus} onChange={handleInputChange} onKeyDown={handleDeleteEvent} />
        </label>
        <label className={valueColorActive(state.value6)}>
          <input type="number" value={state.value6} name="value6" pattern="\d*" inputMode="numeric" ref={(el) => (inputRef.current[5] = el)} onClick={emptyIndexFocus} onChange={handleInputChange} onKeyDown={handleDeleteEvent} />
        </label>
      </div>
    </StyledPassword>
  );
}
