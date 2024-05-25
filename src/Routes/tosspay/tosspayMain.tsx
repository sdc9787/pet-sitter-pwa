import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionBtn from "../../Component/actionBtn/actionBtn";
import Topbar from "../../Component/topbar/topbar";
import instanceJson from "../../Component/axios/axiosJson";

const cookieOptions = [
  { quantity: 1000, price: 1000 },
  { quantity: 3000, price: 3000 },
  { quantity: 5000, price: 5000 },
  { quantity: 10000, price: 10000 },
  { quantity: 15000, price: 15000 },
  { quantity: 30000, price: 30000 },
  { quantity: 50000, price: 50000 },
];

function TosspayMain() {
  const [point, setPoint] = useState<number>(0); //포인트
  const navigate = useNavigate();

  useEffect(() => {
    //포인트 받아오기
    instanceJson
      .get("/mypage/coin")
      .then((res) => {
        console.log(res.data);
        setPoint(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Topbar backUrl="/profile" title="포인트 충전"></Topbar>
      <div className="w-full h-screen flex flex-col items-center bg-gray-100">
        <div className="w-full bg-white">
          <div className="flex justify-start items-center p-4 border-b mt-20">
            {/* 포인트 받아오기 */}
            <p className="text-base font-semibold text-gray-500">현재 보유한 포인트 :&nbsp;</p>
            <span className="text-base font-semibold text-main">{point} 포인트</span>
          </div>
          <div className="p-4">
            {cookieOptions.map((option) => (
              <div key={option.quantity} className="flex justify-between items-center mb-4">
                <div className="flex justify-center items-center gap-2">
                  <i className="xi-park text-main"></i>
                  <span className="font-medium">{option.quantity.toLocaleString()} 포인트</span>
                </div>
                <span
                  onClick={() => {
                    navigate("/tossPay/checkout", { state: option.price });
                  }}
                  className="text-sm font-semibold text-white bg-main rounded-md w-20 px-2 py-1 text-center">
                  {option.price.toLocaleString()} 원
                </span>
              </div>
            ))}
            <div className="mt-4">
              <input type="text" placeholder="쿠폰번호(PIN)을 입력하세요." className="w-full px-4 py-2 border rounded-md" />
              <button className="w-full bg-main text-white py-2 rounded-md mt-2">쿠폰충전</button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>기프트카드로 충전한 포인트는 포인트샵 {">"} 구매내역 탭에서 확인하실 수 있습니다.</p>
              <p>‘포인트받기’ 버튼을 누르신 후에는 화면을 이탈하시더라도 이미 진행 중인 충전 절차가 취소되지 않습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TosspayMain;
