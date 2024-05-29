import { useDispatch } from "react-redux";
import Kakao from "../../Component/kakaoMap/kakaoMap";
import TabBar from "../../Component/tabbar/tabbar";
import { useEffect } from "react";
import { selectedTab } from "../../Store/store";

function KakaoMap() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(selectedTab(2));
  }, []);
  return (
    <>
      <Kakao></Kakao>
      <TabBar></TabBar>
    </>
  );
}

export default KakaoMap;
