import { useEffect, useState } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Loading from "../../../Component/loading/loading";

interface Applier {
  id: number;
  userId: number;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
}

function ReservationWalkApplier() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const [appliers, setAppliers] = useState<Applier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    instanceJson
      .get("/walk/myPost/applier")
      .then((res: any) => {
        console.log(res.data);
        setAppliers(res.data);
        setLoading(false);
      })
      .catch((error: any) => {
        alertBox("신청자 정보를 불러오는데 실패했습니다.");
        setError(error.response.data);
        setLoading(false);
      });
  }, []);

  function handleApplierSelection(index: number) {
    instanceJson
      .post("/walk/accept", { waiter_list_id: Number(appliers[index].id), post_id: Number(id), waiter_id: Number(appliers[index].userId) })
      .then((res: any) => {
        alertBox("매칭이 성사되었습니다");
        navigate("/reservation/walk");
      })
      .catch((error: any) => {
        console.log(error.response.data);
      });
  }

  return (
    <>
      <Topbar backUrl="/reservation/walk" title="신청내역확인"></Topbar>
      {loading ? (
        <Loading></Loading>
      ) : appliers.length == 0 ? (
        <div className="flex justify-center items-center w-full h-screen px-6">
          <p className="text-center text-gray-500 font-bold text-xl">신청자가 없습니다.</p>
        </div>
      ) : (
        <ul className="w-full mt-20 px-6 space-y-4">
          {appliers.map((applier, index) => (
            <li key={applier.id} className="w-full flex items-center p-4 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
              <img src={applier.profileImage} alt={`${applier.name} 프로필 이미지`} className="w-16 h-16 rounded-full object-cover mr-4 " />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{applier.name}</h3>
                <p className="font-semibold text-gray-600">평점: {applier.rating} / 5</p>
                <p onClick={() => navigate(`/profile/review/walk/view/${applier.userId}`)} className="font-semibold text-blue-500 underline cursor-pointer">
                  받은 리뷰: {applier.reviewCount}개
                </p>
              </div>
              <button onClick={() => handleApplierSelection(index)} className="px-4 py-2 font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-button">
                수락
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ReservationWalkApplier;
