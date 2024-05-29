import { Route, Routes } from "react-router-dom";
import UsagePartnerList from "./usagePartnerList";
import UsageUserList from "./usageUserList";
import UsageWalkDetail from "./usageWalkDetail";
import UsageCareDetail from "./usageCareDetail";

function Usage() {
  return (
    <>
      <Routes>
        <Route path="/user" element={<UsageUserList></UsageUserList>}></Route>
        <Route path="/partner" element={<UsagePartnerList></UsagePartnerList>}></Route>
        <Route path="/walk/detail/:id" element={<UsageWalkDetail></UsageWalkDetail>}></Route>
        <Route path="/care/detail/:id" element={<UsageCareDetail></UsageCareDetail>}></Route>
      </Routes>
    </>
  );
}

export default Usage;
