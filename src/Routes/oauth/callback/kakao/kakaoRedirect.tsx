import React from "react";
import { useDispatch } from "react-redux";

function KakaoRedirect(props: any) {
  const dispatch = useDispatch();

  let code = new URLSearchParams(window.location.search).get("code");

  return (
    <>
      <div>Community</div>
    </>
  );
}

export default KakaoRedirect;
