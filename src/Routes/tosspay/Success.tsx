import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import instanceJson from "../../Component/axios/axiosJson";
import ActionBtn from "../../Component/actionBtn/actionBtn";
import Loading from "../../Component/loading/loading";

interface RequestData {
  orderId: string | null;
  amount: number;
  paymentKey: string | null;
}

export function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [point, setPoint] = useState(0);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const amount = Number(searchParams.get("amount"));
    const paymentKey = searchParams.get("paymentKey");

    const requestData: RequestData = {
      orderId,
      amount,
      paymentKey,
    };

    function confirm() {
      console.log(requestData);
      instanceJson
        .post("/payment/tossPay", requestData)
        .then((response) => {
          const data = response.data;
          // TODO: 결제 성공 비즈니스 로직을 구현하세요.
          console.log(data);
          instanceJson
            .get("/mypage/coin")
            .then((response) => {
              setPoint(response.data);
              console.log(response.data);
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((err) => {
          // TODO: 결제 실패 비즈니스 로직을 구현하세요.
          if (err.response) {
            console.log(err.response.data);
            navigate(`/tossPay/fail?message=${err.response.data.message}&code=${err.response.data.code}`);
          } else {
            console.error(err);
          }
        });
    }

    confirm();
  }, []);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="w-full h-screen p-6 flex flex-col justify-center items-center gap-4">
        <i className="xi-check-min xi-5x bg-main text-white rounded-full p-1"></i>
        <h1 className="text-xl font-bold">포인트 충전이 완료되었습니다</h1>
        <p>{`결제 금액: ${Number(searchParams.get("amount")).toLocaleString()}원`}</p>
        <p>{`결제 후 포인트: ${point}포인트`}</p>
      </div>
      <ActionBtn
        buttonCount={2}
        button1Props={{
          text: "돌아가기",
          color: "bg-zinc-500",
          onClick: () => {
            navigate("/profile");
          },
        }}
        button2Props={{
          text: "추가 충전하기",
          color: "bg-main",
          onClick: () => {
            navigate("/tossPay");
          },
        }}></ActionBtn>
    </>
  );
}
