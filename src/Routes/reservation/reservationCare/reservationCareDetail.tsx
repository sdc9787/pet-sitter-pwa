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
        <div className="flex flex-col items-center p-4">
          <div className="relative w-full mt-16 flex items-center justify-center h-60 overflow-hidden rounded-xl">
            <button onClick={handlePreviousImage} className="absolute left-0 rounded-full p-2">
              <i className="xi-angle-left-min xi-2x font-bold"></i>
            </button>
            <img src={careData.careImages[currentImageIndex]} alt="care" className="w-full h-full object-cover " />
            <button onClick={handleNextImage} className="absolute right-0 rounded-full p-2">
              <i className="xi-angle-right-min xi-2x font-bold"></i>
            </button>
          </div>
          <div className="w-full mt-4 flex flex-col gap-2">
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
            <div className="mt-5 text-base font-bold">{careData.content}</div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">예약 불가능 날짜</h3>
              <ul className="list-disc list-inside">
                {careData.unavailableDate.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
            </div>
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
