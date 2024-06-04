import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectedTab } from "../../Store/store";
import ChatMain from "./chatMain";
import ChatDetail from "./chatDetail";

function Chat() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedTab(1));
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatMain></ChatMain>}></Route>
        <Route path="/detail/:id" element={<ChatDetail></ChatDetail>}></Route>
      </Routes>
    </>
  );
}

export default Chat;
