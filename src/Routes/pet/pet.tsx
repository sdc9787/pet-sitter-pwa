import "./pet.css";

function Pet() {
  return (
    <>
      <div className="pet">
        <span className="pet-content-span">
          <h1>실시간 LIVE 중계</h1>
          <span>반려동물의 산책 / 돌봄 과정을</span>
          <span>실시간 LIVE 영상으로 지켜볼 수 있습니다.</span>
        </span>
        <img src="/img/petimg.webp" />
        <div className="pet-content-box">
          <div className="pet-content-box-element">
            <span>지금 반려동물을 LIVE 영상으로 확인해 보세요</span>
            <button>돌봄 예약</button>
            <button>LIVE</button>
          </div>
          <div className="pet-content-box-element">
            <span>지금 반려동물의 위치를 실시간으로 확인해 보세요</span>
            <button>산책 예약</button>
            <button>LIVE</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pet;
