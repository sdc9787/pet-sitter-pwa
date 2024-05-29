import { Route, Routes } from "react-router-dom";
import WalkReviewListMain from "./reviewListMain";
import ReviewCareCreate from "./reviewCareCreate";
import ReviewWalkCreate from "./reviewWalkCreate";

function WalkReviewList() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WalkReviewListMain></WalkReviewListMain>}></Route>
        <Route path="/walk/create/:id" element={<ReviewWalkCreate></ReviewWalkCreate>}></Route>
        <Route path="/care/create/:id" element={<ReviewCareCreate></ReviewCareCreate>}></Route>
      </Routes>
    </>
  );
}

export default WalkReviewList;
