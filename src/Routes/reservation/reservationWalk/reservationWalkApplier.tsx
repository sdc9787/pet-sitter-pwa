import { useEffect } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";

function ReservationWalkApplier() {
  useEffect(() => {
    instanceJson
      .get("/walk/myPost/applier")
      .then((res: any) => {
        console.log(res.data);
      })
      .catch((error: any) => {
        console.error(error.response.data);
      });
  }, []);

  //todo : 배열로 오는 테이터를 선택헤서 sendFunction으로 보내기
  //신청자가 없으면 빈배열로 오는데 이때는 신청자가 없다는 메세지를 띄워줘야함
  return (
    <>
      <Topbar backUrl="/reservation/walk" title="신청내역확인"></Topbar>
      <h1></h1>
    </>
  );
}

export default ReservationWalkApplier;
