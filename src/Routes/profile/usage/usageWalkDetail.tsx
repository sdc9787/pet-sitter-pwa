import { useParams } from "react-router-dom";
import Topbar from "../../../Component/topbar/topbar";
import { useEffect, useState } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import { useAlert } from "../../../hook/useAlert/useAlert";
import Loading from "../../../Component/loading/loading";

type WalkDetailType = {
  walkRecodeId: number;
  userNickname: string;
  userImage: string;
  walkerNickname: string;
  walkerImage: string;
  petName: string;
  petImage: string;
  petGender: string;
  petSpecies: string;
  petBirthYear: number;
  walkTime: number;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  address: string;
  detailAddress: string;
  title: string;
  content: string;
  status: number;
  reason: string;
  amount: number;
};

function UsageWalkDetail() {
  const { id } = useParams();
  const alertBox = useAlert();
  const [loading, setLoading] = useState(true);
  const [walkDetail, setWalkDetail] = useState<WalkDetailType | null>(null);

  // id에 해당하는 산책 상세내역을 가져옵니다.
  useEffect(() => {
    instanceJson
      .post(`/usageDetails/walk/detail?walk_recode_id=${id}`, {})
      .then((res) => {
        setWalkDetail(res.data);
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
      <Topbar backUrl="/profile/usage/user" title="산책 상세내역" />
      <div className="w-full h-screen">
        <div className=" mt-16 flex flex-col gap-4">
          {/*산책 시작 | 종료*/}
          <div className="w-full bg-zinc-100 h-4"></div>
          <div className="mb-4 px-6">
            <h2 className="text-2xl font-bold">{walkDetail?.title}</h2>
            <p className="font-semibold">{walkDetail?.content}</p>
          </div>
          <div className="mb-4 px-6">
            <h3 className="text-lg font-bold">산책 정보</h3>
            <p className="font-semibold">산책 시간 : {walkDetail?.walkTime} 분</p>
            <p className="text-black font-semibold">{walkDetail && `산책 시작 :  ${formatDate(walkDetail.startTime)}`}</p>
            <p className="text-black font-semibold">{walkDetail && `산책 종료 : ${formatDate(walkDetail.endTime)}`}</p>
          </div>
          {walkDetail?.reason && (
            <div className="mb-4 px-6">
              <h3 className="text-lg font-semibold text-red-600">취소 사유</h3>
              <p className="text-red-600">{walkDetail?.reason}</p>
            </div>
          )}
          <div className="w-full bg-zinc-100 h-4"></div>
          <div className="mb-4 px-6">
            <h3 className="text-lg font-semibold">결제 정보</h3>
            <p className="font-semibold">금액 : {walkDetail?.amount.toLocaleString()} P</p>
          </div>
          <div className="w-full bg-zinc-100 h-4"></div>
          {/*이용자 정보*/}
          <div className="mb-4 px-6">
            <h3 className="text-lg font-bold">이용자 정보</h3>
            <div className="flex items-center mt-2">
              <img src={walkDetail?.userImage} alt="User" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <div className="font-bold">{walkDetail?.userNickname}</div>
                <div className="text-zinc-500 font-semibold">
                  <div>{walkDetail?.address}</div>
                  <div>{walkDetail?.detailAddress}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            {/*산책러 정보*/}
            <div className="mb-4 px-6">
              <h3 className="text-lg font-bold">산책러 정보</h3>
              <div className="flex items-center mt-2">
                <img src={walkDetail?.walkerImage} alt="Walker" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold">{walkDetail?.walkerNickname}</p>
                </div>
              </div>
            </div>
            {/*펫 정보 */}
            <div className="mb-4 px-6">
              <h3 className="text-lg font-bold">펫 정보</h3>
              <div className="flex items-center mt-2">
                <img src={walkDetail?.petImage} alt="Pet" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold">{walkDetail?.petName}</p>
                  <p className="font-semibold text-sm">
                    {walkDetail?.petSpecies} ({walkDetail?.petGender == "male" ? "남" : "여"}), {new Date().getFullYear() - Number(walkDetail?.petBirthYear)}세
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-zinc-100 h-4"></div>
        </div>
      </div>
    </>
  );
}

export default UsageWalkDetail;
