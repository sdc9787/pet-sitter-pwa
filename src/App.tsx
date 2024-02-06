import { useState } from "react";
import "./CSS/App.css";
import TabBar from "./Component/tabBar.tsx";

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
