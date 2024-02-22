import { useNavigate } from "react-router-dom";
import "../Styles/TabBar.css";
type TabBarProps = {
  tabState: number;
  setTabState: React.Dispatch<React.SetStateAction<number>>;
};

function TabBar(props: TabBarProps) {
  let tabbar = {
    IconFalse: ["xi-home-o", "xi-paper-o", "xi-map-o", "xi-forum-o", "xi-user-o"],
    IconTrue: ["xi-home", "xi-paper", "xi-map", "xi-forum", "xi-user"],
    IconName: ["홈", "산책", "지도", "커뮤니티", "프로필"],
    Link: ["home", "pet", "map", "community", "setting"],
  };
  const navigate = useNavigate(); //페이지 이동

  return (
    <>
      <div className="tabbar">
        {tabbar.IconTrue.map((a, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                props.setTabState(i);
                window.localStorage.setItem("tabState", JSON.stringify(i));
                navigate("/" + tabbar.Link[i]);
              }}
              className="tabbar-element">
              <i className={(props.tabState === i ? a : tabbar.IconFalse[i]) + " xi-2x"}></i>
              <span className="tabbar-element-name">{tabbar.IconName[i]}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default TabBar;
