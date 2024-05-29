import { useParams } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useEffect, useState } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Loading from "../../../Component/loading/loading";

// {
//   "careRecodeId": 1,
//   "userNickname": "sdc6",
//   "userImage": "https://storage.googleapis.com/swr-bucket/default.jpg",
//   "caregiverNickname": "AAA",
//   "caregiverImage": "https://storage.googleapis.com/swr-bucket/default.jpg",
//   "petName": "떄철이",
//   "petImage": "https://storage.googleapis.com/swr-bucket/c35a9083-0606-4613-a017-18375fd13236",
//   "petGender": "male",
//   "petSpecies": "시골잡종",
//   "petBirthYear": 2014,
//   "startDate": "2024-05-28T00:00:00",
//   "endDate": "2024-05-28T19:02:40",
//   "latitude": 0,
//   "longitude": 0,
//   "administrativeAddress1": "인천광역시",
//   "administrativeAddress2": "중구",
//   "streetAddress": "도로명주",
//   "detailAddress": "아파트1",
//   "title": "테스트 돌봄글",
//   "content": "테스트 돌봄글",
//   "status": 3,
//   "reason": null,
//   "amount": 40000
// }

type CareDetailType = {
  careRecodeId: number;
  userNickname: string;
  userImage: string;
  caregiverNickname: string;
  caregiverImage: string;
  petName: string;
  petImage: string;
  petGender: string;
  petSpecies: string;
  petBirthYear: number;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  administrativeAddress1: string;
  administrativeAddress2: string;
  streetAddress: string;
  detailAddress: string;
  title: string;
  content: string;
  status: number;
  reason: string;
  amount: number;
};

function UsageCareDetail() {
  const { id } = useParams();
  const alertBox = useAlert();
  const [loading, setLoading] = useState(true);
  const [careDetail, setCareDetail] = useState<CareDetailType | null>(null);

  // id에 해당하는 돌봄 상세내역을 가져옵니다.
  useEffect(() => {
    instanceJson
      .post(`/usageDetails/care/detail?care_record_id=${id}`, {})
      .then((res) => {
        setCareDetail(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        alertBox("상세내역을 불러오는데 실패했습니다");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("ko-KR", options);
  };

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <Topbar backUrl="/profile/usage/user" title="돌봄 상세내역" />
      <div className="w-full h-screen p-6">
        <div className="bg-white rounded-lg  mt-16">
          {/*돌봄 시작 | 종료*/}
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{careDetail?.title}</h2>
            <p className="text-black font-semibold">{careDetail && `돌봄시작 :  ${formatDate(careDetail.startDate)}`}</p>
            <p className="text-black font-semibold">{careDetail && `돌봄종료 : ${formatDate(careDetail.endDate)}`}</p>
          </div>
          {/*이용자 정보*/}
          <div className="mb-4">
            <h3 className="text-lg font-bold">이용자 정보</h3>
            <div className="flex items-center mt-2">
              <img src={careDetail?.userImage} alt="User" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <div className="font-bold">{careDetail?.userNickname}</div>
                <div className="text-zinc-500 font-semibold">
                  <div>
                    {careDetail?.administrativeAddress1}
                    {careDetail?.administrativeAddress2}
                    {careDetail?.streetAddress}
                  </div>
                  <div>{careDetail?.detailAddress}</div>
                </div>
              </div>
            </div>
          </div>
          {/*돌봄러 정보*/}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">돌봄러 정보</h3>
            <div className="flex items-center mt-2">
              <img src={careDetail?.caregiverImage} alt="Caregiver" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-bold">{careDetail?.caregiverNickname}</p>
              </div>
            </div>
          </div>
          {/*펫 정보 */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">펫 정보</h3>
            <div className="flex items-center mt-2">
              <img src={careDetail?.petImage} alt="Pet" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-bold">{careDetail?.petName}</p>
                <p className="text-gray-600">
                  {careDetail?.petSpecies} ({careDetail?.petGender}), {new Date().getFullYear() - Number(careDetail?.petBirthYear)}세
                </p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">상세 내용</h3>
            <p>제목 : {careDetail?.title}</p>
            <p className="text-gray-600">내용 : {careDetail?.content}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">결제 정보</h3>
            <p className="text-gray-600">금액: {careDetail?.amount.toLocaleString()}원</p>
          </div>
          {careDetail?.reason && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-red-600">취소 사유</h3>
              <p className="text-red-600">{careDetail?.reason}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UsageCareDetail;
