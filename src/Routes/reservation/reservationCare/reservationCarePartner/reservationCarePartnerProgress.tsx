import { useEffect, useState } from "react";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";

type Progress = {
  careMatchingId: number;
  petName: string;
  petImage: string;
  petGender: string;
  petBirthYear: number;
  species: string;
  weight: number;
  neutering: boolean;
  vaccination: boolean;
  etc: string;
  amount: number;
  reservationStartDate: string;
  reservationEndDate: string;
  requestMessage: string;
  careStartDate: string;
};

function ReservationCarePartnerProgress() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [progressList, setProgressList] = useState<Progress[]>([]);

  useEffect(() => {
    instanceJson
      .get("/care/myPost/progress")
      .then((res) => {
        console.log(res.data);
        setProgressList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAccept = (careMatchingId: number) => {
    instanceJson
      .get(`/care/complete?careMatchingId=${careMatchingId}`)
      .then((res) => {
        alertBox("돌봄을 종료했습니다");
        console.log(res.data);
        navigate("/reservation/care/partner/applier");
      })
      .catch((err) => {
        alertBox("돌봄 종료에 실패했습니다");
        console.log(err);
      });
  };

  const handleCancel = (careMatchingId: number) => {
    instanceJson
      .post(`/care/incomplete`, {
        careMatchingId: careMatchingId,
        reason: "비정상 종료",
      })
      .then((res) => {
        console.log(res.data);
        alertBox("돌봄을 비정상 종료했습니다");
        navigate("/reservation/care/partner/applier");
      })
      .catch((err) => {
        alertBox("돌봄 비정상 종료에 실패했습니다");
        console.log(err);
      });
  };

  return (
    <>
      <Topbar backUrl="/reservation/care/partner/applier" title="진행중인 돌봄 내역" />
      <div className="w-full h-screen p-4">
        <div className="mt-16">
          {progressList.length === 0 ? (
            <p>현재 진행중인 돌봄 내역이 없습니다.</p>
          ) : (
            progressList.map((progress) => (
              <div key={progress.careMatchingId} className="border rounded-lg p-4 mb-4 shadow-md">
                <img src={progress.petImage} alt={progress.petName} className="w-24 h-24 object-cover rounded-full mb-4" />
                <h2 className="text-xl font-bold mb-2">{progress.petName}</h2>
                <p>종: {progress.species}</p>
                <p>성별: {progress.petGender === "male" ? "수컷" : "암컷"}</p>
                <p>생년: {progress.petBirthYear}</p>
                <p>체중: {progress.weight} kg</p>
                <p>중성화 여부: {progress.neutering ? "예" : "아니오"}</p>
                <p>예방 접종 여부: {progress.vaccination ? "예" : "아니오"}</p>
                <p>기타: {progress.etc}</p>
                <p>금액: {progress.amount}원</p>
                <p>예약 시작 시간: {new Date(progress.reservationStartDate).toLocaleString()}</p>
                <p>예약 종료 시간: {new Date(progress.reservationEndDate).toLocaleString()}</p>
                <p>요청 사항: {progress.requestMessage}</p>
                <p>돌봄 시작 시간: {new Date(progress.careStartDate).toLocaleString()}</p>
                <div className="flex flex-col justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      handleAccept(progress.careMatchingId);
                    }}
                    className={"px-4 py-2 font-bold text-white rounded-lg w-full bg-main"}>
                    돌봄 종료
                  </button>
                  <button
                    onClick={() => {
                      handleCancel(progress.careMatchingId);
                    }}
                    className={"px-4 py-2 font-bold text-white rounded-lg w-full bg-red-500"}>
                    문제발생(비정상 종료)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ReservationCarePartnerProgress;
