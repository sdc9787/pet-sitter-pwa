import { useEffect, useState } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../hook/useAlert/useAlert";

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
        <div className="flex justify-center items-center w-full h-screen px-6">
          <p>Loading...</p>
        </div>
      ) : appliers.length == 0 ? (
        <div className="flex justify-center items-center w-full h-screen px-6">
          <p className="text-center text-gray-500 font-bold text-xl">신청자가 없습니다.</p>
        </div>
      ) : (
        <ul className="w-full mt-20">
          {appliers.map((applier, index) => (
            <li key={applier.id} className="w-full flex items-center p-4 bg-white rounded-lg shadow-md">
              <img src={applier.profileImage} alt={`${applier.name} 프로필 이미지`} className="w-16 h-16 rounded-full object-cover mr-4" />
              <div className="flex-grow">
                <h3 className="text-lg font-bold">{applier.name}</h3>
                <p className="text-gray-600">평점: {applier.rating} / 5</p>
                <p className="text-gray-600">리뷰: {applier.reviewCount}</p>
              </div>
              <button onClick={() => handleApplierSelection(index)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
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
