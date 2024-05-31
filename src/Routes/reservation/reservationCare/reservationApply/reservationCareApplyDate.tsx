import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, setCareSelectedAvailableDates, alertOn } from "../../../../Store/store";
import Calendar from "react-calendar";
import Topbar from "../../../../Component/topbar/topbar";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import "./calender.css";
import { useAlert } from "../../../../hook/useAlert/useAlert";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function ReservationCareApplyDate() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unavailableDates = useSelector((state: RootState) => state.reservationCare.unavailableDates);
  const selectedAvailableDates = useSelector((state: RootState) => state.careSelectedAvailableDates);
  const [value, setValue] = useState<Value>([null, null]);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());
  const alertBox = useAlert();

  useEffect(() => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const max = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of the month 2 months ahead
    setMinDate(min);
    setMaxDate(max);
  }, []);

  const handleDateChange = (value: Value) => {
    const dateRange = value as [Date, Date];
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toLocaleDateString("en-CA");
      const endDate = dateRange[1].toLocaleDateString("en-CA");

      const rangeContainsUnavailable = unavailableDates.some((date) => {
        const currentDate = new Date(date);
        return currentDate >= dateRange[0] && currentDate <= dateRange[1];
      });

      if (rangeContainsUnavailable) {
        alertBox("예약이 불가능한 날짜가 포함되어 있습니다");
        return;
      }

      dispatch(setCareSelectedAvailableDates({ reservationStartDate: startDate, reservationEndDate: endDate }));
    }
    setValue(dateRange);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const formattedDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
      if (unavailableDates.includes(formattedDate)) {
        return "unavailable-date";
      } else if (selectedAvailableDates.reservationStartDate && selectedAvailableDates.reservationEndDate && new Date(selectedAvailableDates.reservationStartDate) <= date && date <= new Date(selectedAvailableDates.reservationEndDate)) {
        return "selected-date-apply";
      }
    }
    return "";
  };

  return (
    <>
      <Topbar backUrl={`/reservation/care/detail/${id}`} title="돌봄 글 작성" />
      <div className="mt-16">
        <Calendar
          selectRange
          onChange={handleDateChange}
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
          tileClassName={tileClassName}
          calendarType="gregory" // Set the calendar to start the week on Sunday
        />
        <div className="mt-4 flex flex-col justify-center items-center">
          <h1 className="px-6 font-bold text-lg">빨간색 칸은 예약이 불가능한 날짜입니다.</h1>
          <h1 className="px-6 font-bold text-lg">예약이 가능한 날짜를 선택해 주세요</h1>
        </div>
        {selectedAvailableDates.reservationStartDate && selectedAvailableDates.reservationEndDate && (
          <div className="mt-2 flex items-center justify-center">
            <h1 className="px-6 font-bold text-lg">{`예약 시작 날짜: ${selectedAvailableDates.reservationStartDate}, 예약 종료 날짜: ${selectedAvailableDates.reservationEndDate}`}</h1>
          </div>
        )}
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => {
            navigate(`/reservation/care/apply/pet/${id}`);
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
}

export default ReservationCareApplyDate;
