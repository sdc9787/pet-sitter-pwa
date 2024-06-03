import { Route, Routes, useNavigate } from "react-router-dom";
import PartnerShipStep1 from "./partnerShipStep1";
import PartnerShipStep2 from "./partnerShipStep2";
import PartnerShipStep3 from "./partnerShipStep3";
import { useEffect } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import { useAlert } from "../../../hook/useAlert/useAlert";

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
          if (res.data.testCount == 3) {
            alertBox("3회 불합격 하셨습니다, 다음에 다시 도전해주세요");
          }
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
      </Routes>
    </>
  );
}

export default PartnerShip;
