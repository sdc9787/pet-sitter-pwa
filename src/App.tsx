import { useState } from "react";
import "./Styles/App.css";
import TabBar from "./Component/tabbar";

function App() {
  let [tabState, setTabState] = useState(0);

  return (
    <>
      <div>
        <TabBar tabState={tabState} setTabState={setTabState}></TabBar>
      </div>
    </>
  );
}

export default App;
