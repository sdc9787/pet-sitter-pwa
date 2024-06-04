import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectedTab } from "../../Store/store";
import ChatMain from "./chatMain/chatMain";

function Chat() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedTab(1));
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatMain></ChatMain>}></Route>
      </Routes>
    </>
  );
}

export default Chat;
