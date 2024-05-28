import { Route, Routes } from "react-router-dom";
import { CheckoutPage } from "./Checkout";
import { SuccessPage } from "./Success";
import { FailPage } from "./Fail";
import "./tosspay.css";
import TosspayMain from "./tosspayMain";
import TosspayList from "./tosspayList";

function TossPay() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TosspayMain></TosspayMain>}></Route>
        <Route path="/list" element={<TosspayList></TosspayList>}></Route>
        <Route path="/checkout" element={<CheckoutPage></CheckoutPage>}></Route>
        <Route path="/success" element={<SuccessPage></SuccessPage>}></Route>
        <Route path="/fail" element={<FailPage></FailPage>}></Route>
      </Routes>
    </>
  );
}

export default TossPay;
