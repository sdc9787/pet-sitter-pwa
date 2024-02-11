import "./routes-Styles/setting.css";

function Setting() {
  const profileImg: string = "/public/profile.png"; //프로필 이미지 주소
  let profileName: string = "sdc9787";
  return (
    <>
      <div className="setting">
        <div className="setting-setting">
          <i className="xi-cog xi-2x"></i>
        </div>
        <div className="setting-profile">
          <div className="setting-profile-icon-name">
            <img className="setting-profile-icon" src={profileImg} alt="프로필 아이콘" />
            <span className="setting-profile-name">{profileName}</span>
          </div>
          <div className="setting-profile-set">프로필 변경</div>
        </div>
      </div>
    </>
  );
}

export default Setting;
