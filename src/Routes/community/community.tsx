import { Route, Routes } from "react-router-dom";
import CommunityMain from "./communityMain/communityMain";
import CommunityCreate from "./communityCreate/communityCreate";
import CommunityEdit from "./communityEdit/communityEdit";
import CommunityDetail from "./communityDetail/communityDetail";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { selectedTab } from "../../Store/store";

function Community() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedTab(3));
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<CommunityMain></CommunityMain>}></Route>
        <Route path="/create" element={<CommunityCreate></CommunityCreate>}></Route>
        <Route path="/edit" element={<CommunityEdit></CommunityEdit>}></Route>
        <Route path="/detail/:id" element={<CommunityDetail></CommunityDetail>}></Route>
        {/* todo 백에서 useparams로 가능할때 수정 */}
        {/* <Route path="/detail/:id" element={<Detail</Detaul>}></Route> */}
      </Routes>
    </>
  );
}

export default Community;
