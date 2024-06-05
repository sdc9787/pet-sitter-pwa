import { Route, Routes } from "react-router-dom";
import WalkReviewListMain from "./reviewListMain";
import ReviewCareCreate from "./reviewCareCreate";
import ReviewWalkCreate from "./reviewWalkCreate";
import WalkReviewListPartner from "./reviewListPartner";
import CareReviewListView from "./reviewCareView";
import WalkReviewListView from "./reviewWalkView";

function WalkReviewList() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WalkReviewListMain></WalkReviewListMain>}></Route>
        <Route path="/partner" element={<WalkReviewListPartner></WalkReviewListPartner>}></Route>
        <Route path="/walk/view/:id" element={<WalkReviewListView></WalkReviewListView>}></Route>
        <Route path="/care/view/:id" element={<CareReviewListView></CareReviewListView>}></Route>
        <Route path="/walk/create/:id" element={<ReviewWalkCreate></ReviewWalkCreate>}></Route>
        <Route path="/care/create/:id" element={<ReviewCareCreate></ReviewCareCreate>}></Route>
      </Routes>
    </>
  );
}

export default WalkReviewList;
