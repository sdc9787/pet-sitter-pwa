import { useState } from "react";
import "./styles/App.css";
import TabBar from "./component/tabbar.tsx";

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
