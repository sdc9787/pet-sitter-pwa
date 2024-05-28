import { Route, Routes } from "react-router-dom";
import UsagePartnerList from "./usagePartnerList";
import UsageUserList from "./usageUserList";

function Usage() {
  return (
    <>
      <Routes>
        <Route path="/user" element={<UsageUserList></UsageUserList>}></Route>
        <Route path="/partner" element={<UsagePartnerList></UsagePartnerList>}></Route>
      </Routes>
    </>
  );
}

export default Usage;
