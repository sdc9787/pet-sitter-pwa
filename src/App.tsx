import { useState } from "react";
import "./Styles/App.css";
import TabBar from "./Component/tabbar";
import { Route, Routes } from "react-router-dom";
import Setting from "./Routes/setting";
import Home from "./Routes/home";
import Pet from "./Routes/pet";
import Map from "./Routes/map";
import Community from "./Routes/community";

function App() {
  let [tabState, setTabState] = useState(0);

  return (
    <>
      <div className="main-frame-routes">
        <Routes>
          {/* <Route path="/" element={}></Route> */}
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/pet" element={<Pet></Pet>}></Route>
          <Route path="/map" element={<Map></Map>}></Route>
          <Route path="/community" element={<Community></Community>}></Route>
          <Route path="/setting" element={<Setting></Setting>}></Route>
          <Route path="*" element={<div>접근할 수 없는 페이지입니다.</div>}></Route>
        </Routes>
      </div>
      <div className="TabBar">
        <TabBar tabState={tabState} setTabState={setTabState}></TabBar>
      </div>
    </>
  );
}

export default App;
