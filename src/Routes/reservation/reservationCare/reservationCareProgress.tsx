import { useEffect, useState } from "react";
import Topbar from "../../../Component/topbar/topbar";
import instanceJson from "../../../Component/axios/axiosJson";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";

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

function ReservationCareProgress() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [progressList, setProgressList] = useState<Progress[]>([]); // 진행중인 돌봄 리스트

  useEffect(() => {
    instanceJson
      .get(`/care/myReservation/progress`)
      .then((res) => {
        console.log(res.data);
        setProgressList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Topbar backUrl="/reservation/care/list" title="진행중인 돌봄 내역" />
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
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ReservationCareProgress;
