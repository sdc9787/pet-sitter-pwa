import "../styles/TabBar.css";
type TabBarProps = {
  tabState: number;
  setTabState: React.Dispatch<React.SetStateAction<number>>;
};

function TabBar(props: TabBarProps) {
  let tabbarIconFalse = ["xi-home-o", "xi-paper-o", "xi-map-o", "xi-forum-o", "xi-user-o"];
  let tabbarIconTrue = ["xi-home", "xi-paper", "xi-map", "xi-forum", "xi-user"];
  let tabbarIconName = ["홈", "산책", "지도", "커뮤니티", "설정"];

  return (
    <>
      <div className="tabbar">
        {tabbarIconTrue.map((a, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                props.setTabState(i);
              }}
              className="tabbar-element">
              <i className={props.tabState === i ? a + " xi-2x" : tabbarIconFalse[i] + " xi-2x"}></i>
              <span className="tabbar-element-name">{tabbarIconName[i]}</span>
            </div>
          );
        })}

        {/* <div className="tabbar-element">
          <i className="xi-paper-o xi-2x"></i>
          <span className="tabbar-element-name">산책</span>
        </div>
        <div className="tabbar-element">
          <i className="xi-map-o xi-2x"></i>
          <span className="tabbar-element-name">지도</span>
        </div>
        <div className="tabbar-element">
          <i className="xi-forum-o xi-2x"></i>
          <span className="tabbar-element-name">커뮤니티</span>
        </div>
        <div className="tabbar-element">
          <i className="xi-user-o xi-2x"></i>
          <span className="tabbar-element-name">MY</span>
        </div> */}
      </div>
    </>
  );
}

export default TabBar;
