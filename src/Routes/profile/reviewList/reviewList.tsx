import { Route, Routes } from "react-router-dom";
import WalkReviewListMain from "./reviewListMain";
import WalkReviewListCreate from "./reviewListCreate";

function WalkReviewList() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WalkReviewListMain></WalkReviewListMain>}></Route>
        <Route path="/create" element={<WalkReviewListCreate></WalkReviewListCreate>}></Route>
      </Routes>
    </>
  );
}

export default WalkReviewList;
