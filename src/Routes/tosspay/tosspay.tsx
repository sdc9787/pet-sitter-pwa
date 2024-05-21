import { Route, Routes } from "react-router-dom";
import { CheckoutPage } from "./Checkout";
import { SuccessPage } from "./Success";
import { FailPage } from "./Fail";

function TossPay() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CheckoutPage></CheckoutPage>}></Route>
        <Route path="/success" element={<SuccessPage></SuccessPage>}></Route>
        <Route path="/fail" element={<FailPage></FailPage>}></Route>
      </Routes>
    </>
  );
}

export default TossPay;
