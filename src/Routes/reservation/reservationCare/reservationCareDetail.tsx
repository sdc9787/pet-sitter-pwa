import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../Store/store";
import { useEffect, useState } from "react";
import instanceJson from "../../../Component/axios/axiosJson";
import Topbar from "../../../Component/topbar/topbar";
import ActionBtn from "../../../Component/actionBtn/actionBtn";
import { setCarePostData, setUnavailableDate } from "../../../Store/store";

type CareDetail = {
  carePostId: number;
  caregiverNickname: string;
  caregiverRating: number;
  caregiverReviewCount: number;
  title: string;
  content: string;
  administrativeAddress1: string;
  administrativeAddress2: string;
  streetNameAddress: string;
  detailAddress: string;
  distance: number;
  unavailableDate: string[];
  careImages: string[];
  caregiverProfileImage: string;
};

function ReservationCareDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locate = useSelector((state: RootState) => state.reservationCare);
  const [careData, setCareData] = useState<CareDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (id && locate.latitude && locate.longitude) {
      instanceJson
        .post("/care/detail", {
          carePostId: Number(id),
          homeLatitude: Number(locate.latitude),
          homeLongitude: Number(locate.longitude),
        })
        .then((r: any) => {
          console.log(r.data);
          const formattedUnavailableDates = r.data.unavailableDate.map((date: string) => new Date(date).toLocaleDateString("sv-SE"));
          dispatch(setUnavailableDate(formattedUnavailableDates));
          setCareData({ ...r.data, unavailableDate: formattedUnavailableDates });
          setLoading(false);
        })
        .catch((e: any) => {
          console.log(e);
          setLoading(false);
        });
    }
  }, [id]);

  const handlePreviousImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (careData ? (prevIndex < careData.careImages.length - 1 ? prevIndex + 1 : prevIndex) : prevIndex));
  };

  if (loading) {
    return (
      <>
        <Topbar backUrl="/reservation/care/list" title="파트너" />
        <div className="w-full h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!careData) {
    return (
      <>
        <Topbar backUrl="/reservation/care/list" title="파트너" />
        <div className="w-full h-screen flex items-center justify-center">
          <p>No data available.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar backUrl="/reservation/care/list" title="파트너" />
      <div className="w-full h-screen">
        <div className="flex flex-col items-center">
          <div className="relative w-full mt-16 flex items-center justify-center h-60 overflow-hidden">
            <button onClick={handlePreviousImage} className="absolute left-0 rounded-full p-2">
              <i className="xi-angle-left-min xi-2x font-bold"></i>
            </button>
            <img src={careData.careImages[currentImageIndex]} alt="care" className="w-full h-full object-cover " />
            <button onClick={handleNextImage} className="absolute right-0 rounded-full p-2">
              <i className="xi-angle-right-min xi-2x font-bold"></i>
            </button>
          </div>
          <div className="w-full mt-4 flex flex-col gap-2  p-4 relative">
            <img src={careData.caregiverProfileImage} className="absolute  w-14 h-14 object-cover -top-12 rounded-full left-8 border-2 border-white" alt="" />
            <div className="text-lg font-bold">{careData.title}</div>
            <div className="flex items-center justify-start gap-2">
              <div className="text-lg font-bold">{careData.caregiverNickname}</div>
              <div className="flex items-center justify-center">
                <i className="xi-star text-main"></i>
                <div className="text-base font-bold">{careData.caregiverRating}</div>
              </div>
              <div onClick={() => (careData.caregiverReviewCount == 0 ? null : navigate(`/profile/review/care/view/${careData.carePostId}`))} className="text-base font-bold text-zinc-500 underline">
                리뷰 {careData.caregiverReviewCount}개
              </div>
              <div className="flex gap-1">
                <div className="text-base font-bold text-zinc-500">{careData.administrativeAddress1}</div>
                <div className="text-base font-bold text-zinc-500">{careData.administrativeAddress2}</div>
              </div>
            </div>
            <div className="text-base font-bold text-zinc-500">
              {careData.streetNameAddress} {careData.detailAddress}
            </div>
            {/* 돌봄 인증 내역 */}
            <div className="flex flex-col justify-center items-center my-8 gap-8">
              <div className="self-start font-bold">
                인증 / 보장 내역 <i className="xi-check-circle text-main xi-x"></i>
              </div>
              <div className="w-full flex items-center justify-evenly">
                <div className="flex flex-col justify-center items-center gap-2">
                  <i className="xi-profile-o xi-2x text-main"></i>
                  <div className="font-semibold ">신원 인증</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <i className="xi-book xi-2x text-main"></i>
                  <div className="font-semibold">교육 수료</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <i className="xi-shield-checked xi-2x text-main"></i>
                  <div className="font-semibold">안정성 검증</div>
                </div>
              </div>
            </div>
            <div className="text-base font-bold">{careData.content}</div>
          </div>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "예약하기",
          onClick: () => navigate(`/reservation/care/apply/date/${id}`),
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationCareDetail;
