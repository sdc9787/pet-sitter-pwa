import { Route, Routes } from "react-router-dom";
import UsageList from "./usageList";

function Usage() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UsageList></UsageList>}></Route>
      </Routes>
    </>
  );
}

export default Usage;
