import { Route, Routes } from "react-router-dom";
import PartnerShipStep1 from "./partnerShipStep1";
import PartnerShipStep2 from "./partnerShipStep2";
import PartnerShipStep3 from "./partnerShipStep3";

function PartnerShip() {
  return (
    <>
      <Routes>
        <Route path="/step1" element={<PartnerShipStep1></PartnerShipStep1>}></Route>
        <Route path="/step2" element={<PartnerShipStep2></PartnerShipStep2>}></Route>
        <Route path="/step3" element={<PartnerShipStep3></PartnerShipStep3>}></Route>
      </Routes>
    </>
  );
}

export default PartnerShip;
