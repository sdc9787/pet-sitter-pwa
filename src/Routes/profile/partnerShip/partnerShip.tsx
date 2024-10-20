import { Route, Routes, useNavigate } from "react-router-dom";
import PartnerShipStep1 from "./partnerShipStep1";
import PartnerShipStep2 from "./partnerShipStep2";
import PartnerShipStep3 from "./partnerShipStep3";
import { useEffect } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import { useAlert } from "../../../hook/useAlert/useAlert";
import PartnerShipStep4 from "./partnerShipStep4";

function PartnerShip() {
  const alertBox = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    instanceJson
      .get("/mypage/partner/apply/check")
      .then((res) => {
        console.log(res.data.partnerStep);
        if (res.data.partnerStep === 0) {
          navigate("/profile/partnerShip/step1");
        } else if (res.data.partnerStep === 1) {
          navigate("/profile/partnerShip/step2");
        } else if (res.data.partnerStep === 2) {
          navigate("/profile/partnerShip/step3");
        } else if (res.data.partnerStep === 3) {
          navigate("/profile/partnerShip/step3");
          if (res.data.testCount < 3) {
            alertBox(`${res.data.testCount}회 시험을 응시 하셨습니다`);
          }
        } else if (res.data.partnerStep === 4) {
          alertBox(`${res.data.nextTestDate}부터 다시 시험을 응시할 수 있습니다`);
          navigate("/profile");
        } else if (res.data.partnerStep === 5) {
          alertBox("이미 파트너로 등록되어 있습니다");
          navigate("/profile");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/step1" element={<PartnerShipStep1></PartnerShipStep1>}></Route>
        <Route path="/step2" element={<PartnerShipStep2></PartnerShipStep2>}></Route>
        <Route path="/step3" element={<PartnerShipStep3></PartnerShipStep3>}></Route>
        <Route path="/step4" element={<PartnerShipStep4></PartnerShipStep4>}></Route>
      </Routes>
    </>
  );
}

export default PartnerShip;
