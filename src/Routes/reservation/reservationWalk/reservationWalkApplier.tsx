import { useEffect, useState } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";

interface Applier {
  id: number;
  userId: number;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
}

function ReservationWalkApplier() {
  const [appliers, setAppliers] = useState<Applier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    instanceJson
      .get("/walk/myPost/applier")
      .then((res: any) => {
        setAppliers(res.data);
        setLoading(false);
      })
      .catch((error: any) => {
        setError(error.response.data);
        setLoading(false);
      });
  }, []);

  function handleApplierSelection(id: number) {
    // Implement the function to handle applier selection
    console.log(`Selected applier ID: ${id}`);
  }

  return (
    <>
      <Topbar backUrl="/reservation/walk" title="신청내역확인"></Topbar>
      <div className="w-fill h-screen">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : appliers.length === 0 ? (
          <p className="text-center text-gray-500">신청자가 없습니다.</p>
        ) : (
          <ul className="space-y-4 mt-20">
            {appliers.map((applier) => (
              <li key={applier.id} className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <img src={applier.profileImage} alt={`${applier.name} 프로필 이미지`} className="w-16 h-16 rounded-full object-cover mr-4" />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{applier.name}</h3>
                  <p className="text-gray-600">Rating: {applier.rating} / 5</p>
                  <p className="text-gray-600">Reviews: {applier.reviewCount}</p>
                </div>
                <button onClick={() => handleApplierSelection(applier.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Select
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ReservationWalkApplier;
