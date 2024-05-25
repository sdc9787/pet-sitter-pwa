import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import instanceJson from "../../Component/axios/axiosJson";
import { useAlert } from "../../hook/useAlert/useAlert";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = uuidv4();

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(""); //핸드폰 번호
  const [userName, setUserName] = useState(""); //이름
  const [price, setPrice] = useState(0); // 초기값 설정
  const alertBox = useAlert(); //알림창

  const [paymentWidget, setPaymentWidget] = useState(null); //결제 위젯
  const paymentMethodsWidgetRef = useRef(null); //결제 위젯

  //페이지가 로드될때 핸드폰 번호 가져오기
  useEffect(() => {
    instanceJson
      .get("/payment/getUserInfo")
      .then((res) => {
        console.log(res.data);
        let cleanedPhoneNumber = res.data.phoneNumber.replace(/-/g, "");
        console.log(cleanedPhoneNumber);
        setUserName(res.data.name);
        setPhoneNumber(cleanedPhoneNumber);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (location.state) {
      setPrice(Number(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(clientKey, customerKey);
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("결제 위젯을 가져오는 중 오류 발생:", error);
      }
    };

    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods("#payment-widget", { value: price }, { variantKey: "DEFAULT" });

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const handlePaymentRequest = async () => {
    const orderId = nanoid(); // 각 결제 요청마다 새로운 고유한 orderId를 생성합니다.
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    instanceJson.post("/payment/beforePayment", { orderId: orderId, amount: price });

    try {
      await paymentWidget?.requestPayment({
        orderId,
        orderName: price + "포인트",
        customerEmail: "sdc9787@naver.com",
        customerName: userName,
        customerMobilePhone: phoneNumber,
        successUrl: `${window.location.origin}/tossPay/success`,
        failUrl: `${window.location.origin}/tossPay/fail`,
      });
    } catch (error) {
      // alertBox(error);
      // console.error("결제 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="w-full wrapper">
      <div className="box_section h-screen">
        {/* 결제 UI, 이용약관 UI 영역 */}
        <div id="payment-widget" />
        <div id="agreement" />
        <div style={{ paddingLeft: "24px" }} />
        <div className="result wrapper">
          {/* 결제하기 버튼 */}
          <button className="button" style={{ marginTop: "30px" }} onClick={handlePaymentRequest}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
