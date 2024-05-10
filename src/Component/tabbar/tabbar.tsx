import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectedTab } from "../../Store/store";

function TabBar() {
  let tabbar = {
    //tabbar 정보
    IconFalse: ["xi-home-o", "xi-paper-o", "xi-map-o", "xi-forum-o", "xi-user-o"],
    IconTrue: ["xi-home", "xi-paper", "xi-map", "xi-forum", "xi-user"],
    IconName: ["홈", "산책", "지도", "커뮤니티", "프로필"],
    Link: ["home", "pet", "map", "community", "profile"],
  };
  const navigate = useNavigate(); //페이지 이동

  //tabbar state redux함수
  let tabberState = useSelector((state: any) => state.tabbar); //tabbar state
  let dispatch = useDispatch(); //dispatch 함수

  return (
    <>
      <div className="z-20 flex justify-around items-center fixed bottom-0 w-screen border-t border-bdgray bg-white">
        {tabbar.IconTrue.map((a, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                dispatch(selectedTab(i));
                window.localStorage.setItem("tabState", JSON.stringify(i));
                navigate("/" + tabbar.Link[i]);
              }}
              className="flex flex-col justify-center items-center w-20 py-3">
              <i className={(tabberState.state === i ? a + " text-main" : tabbar.IconFalse[i]) + " xi-2x"}></i>
              <span className={(tabberState.state === i ? "text-main" : "") + " text-sm font-extrabold"}>{tabbar.IconName[i]}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default TabBar;
