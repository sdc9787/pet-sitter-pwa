import { useEffect, useState } from "react";
import Topbar from "../../Component/topbar/topbar";
import instanceJson from "../../Component/axios/axiosJson";
import ActionBtn from "../../Component/actionBtn/actionBtn";
import { useNavigate } from "react-router-dom";
import Loading from "../../Component/loading/loading";

type PaymentListType = {
  amount: number;
  orderAt: string;
  orderID: string;
  orderName: string | null;
  paymentType: string | null;
  status: string;
};

function TosspayList() {
  const [paymentList, setPaymentList] = useState<PaymentListType[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instanceJson
      .get("/payment/paymentList")
      .then((res) => {
        console.log(res.data);
        setPaymentList(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl="/profile" title="사용내역" />
      <div className="w-full h-screen bg-gray-900 ">
        <div className="mt-20 mx-6">
          {paymentList.map((payment, index) => {
            return (
              <div key={index} className="flex justify-between items-center my-2 pb-3 border-b-2 border-zinc-400">
                <div className="flex items-center">
                  <div>
                    <div className="flex justify-start items-end gap-2">
                      <div className="text-lg font-bold">{payment.amount.toLocaleString()}포인트</div>
                      <div className={(payment.orderName ? "text-main" : "text-red-500") + " font-semibold text-sm py-1"}>{payment.orderName ? "결제성공" : "결제실패"}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(payment.orderAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "short",
                      })}{" "}
                      {new Date(payment.orderAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${payment.amount > 0 ? "text-blue-400" : "text-red-400"}`}>{payment.amount.toLocaleString()}원</div>
              </div>
            );
          })}
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "충전하기",
          color: "bg-main",
          onClick: () => navigate("/tosspay"),
        }}></ActionBtn>
    </>
  );
}

export default TosspayList;
