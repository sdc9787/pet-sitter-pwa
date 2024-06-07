import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import instanceJson from "../../../../Component/axios/axiosJson";
import Topbar from "../../../../Component/topbar/topbar";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import Loding from "../../../../Component/loading/loading";
import { setCarePostData } from "../../../../Store/store";

type CarePost = {
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

function ReservationCarePartnerMain() {
  const navigate = useNavigate();
  const alertBox = useAlert();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [careData, setCareData] = useState<CarePost | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    instanceJson
      .get("/care/myPost")
      .then((res) => {
        console.log(res.data);
        setCareData(res.data);

        const formattedUnavailableDates = res.data.unavailableDate.map((date: string) => date.split("T")[0]);
        // Dispatch action to store data in Redux
        dispatch(
          setCarePostData({
            title: res.data.title,
            content: res.data.content,
            administrativeAddress1: res.data.administrativeAddress1,
            administrativeAddress2: res.data.administrativeAddress2,
            streetNameAddress: res.data.streetNameAddress,
            detailAddress: res.data.detailAddress,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            images: res.data.careImages,
            unavailableDates: formattedUnavailableDates,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handlePreviousImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNextImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (careData ? (prevIndex < careData.careImages.length - 1 ? prevIndex + 1 : prevIndex) : prevIndex));
  };

  const handleRemoveCarePost = (postId: number) => {
    instanceJson
      .get(`/care/delete/post?carePostId=${postId}`)
      .then((res) => {
        alertBox("돌봄 글이 삭제되었습니다");
        navigate("/reservation");
      })
      .catch((err) => {
        console.log(err);
        alertBox("글 삭제에 실패했습니다");
      });
  };

  return (
    <>
      <Topbar backUrl="/reservation" title="내 돌봄 글"></Topbar>
      {loading ? (
        <Loding />
      ) : (
        <>
          {!careData ? (
            <div className="w-full h-screen flex justify-center items-center font-semibold">
              <div className="h-full flex flex-col gap-5 justify-center items-center">
                <span className="text-xl font-semibold">작성된 돌봄 글이 없습니다</span>
                <span>지금 바로 작성해보세요</span>
                <button onClick={() => navigate("/reservation/care/partner/create/date")} className="mb-20 px-20 py-4 bg-main text-white text-lg font-bold rounded-full">
                  돌봄 글 작성
                </button>
              </div>
              <ActionBtn buttonCount={1} button1Props={{ text: "예약신청", color: "bg-zinc-400", onClick: () => navigate("/reservation/care") }}></ActionBtn>
            </div>
          ) : (
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
                <div className="w-full mt-4 flex flex-col p-4 relative">
                  <img src={careData.caregiverProfileImage} className="absolute  w-14 h-14 object-cover -top-12 rounded-full left-8 border-2 border-white" alt="" />
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">{careData.title}</div>
                    <div className="flex ">
                      <div onClick={() => navigate(`/reservation/care/partner/edit/date/${careData.carePostId}`)} className="p-1 font-semibold text-sm text-zinc-500">
                        수정
                      </div>
                      <div onClick={() => handleRemoveCarePost(careData.carePostId)} className="p-1 font-semibold text-sm text-zinc-500">
                        삭제
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    {/*닉네임*/}
                    <div className="text-lg font-bold">{careData.caregiverNickname}</div>
                    {/*평점*/}
                    <div className="flex items-center justify-center">
                      <i className="xi-star text-main"></i>
                      <div className="text-base font-bold">{careData.caregiverRating}</div>
                    </div>
                    {/*리뷰 수*/}
                    <div className="text-base font-bold text-zinc-500 underline">리뷰 {careData.caregiverReviewCount}개</div>
                    {/*주소*/}
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
                  <div className="mt-5 text-base font-bold">{careData.content}</div>
                </div>
              </div>
              <ActionBtn
                buttonCount={2}
                button1Props={{
                  text: "예약하러 가기",
                  color: "bg-main",
                  onClick: () => navigate(`/reservation/care`),
                }}
                button2Props={{
                  text: "돌봄 관리",
                  color: "bg-main",
                  onClick: () => {
                    navigate("/reservation/care/partner/applier");
                  },
                }}></ActionBtn>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ReservationCarePartnerMain;
