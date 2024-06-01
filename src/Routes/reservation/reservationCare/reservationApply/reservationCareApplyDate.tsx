import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, setCareSelectedAvailableDates } from "../../../../Store/store";
import Calendar from "react-calendar";
import Topbar from "../../../../Component/topbar/topbar";
import ActionBtn from "../../../../Component/actionBtn/actionBtn";
import { useAlert } from "../../../../hook/useAlert/useAlert";
import Select from "react-select";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function ReservationCareApplyDate() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unavailableDates = useSelector((state: RootState) => state.reservationCare.unavailableDates);
  const selectedAvailableDates = useSelector((state: RootState) => state.careSelectedAvailableDates);
  const [value, setValue] = useState<Value>([null, null]);
  const [startTime, setStartTime] = useState<number | null>(1);
  const [endTime, setEndTime] = useState<number | null>(1);
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

  const handleDateChange = (dateRange: Value) => {
    if (Array.isArray(dateRange) && dateRange[0] !== null && dateRange[1] !== null && startTime !== null && endTime !== null) {
      const startDate = dateRange[0].toLocaleDateString("en-CA") + " " + startTime + ":00:00";
      const endDate = dateRange[1].toLocaleDateString("en-CA") + " " + endTime + ":00:00";

      const rangeContainsUnavailable = unavailableDates.some((date) => {
        if (dateRange[0] === null || dateRange[1] === null) return false;
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
      } else if (
        selectedAvailableDates.reservationStartDate &&
        selectedAvailableDates.reservationEndDate &&
        new Date(new Date(selectedAvailableDates.reservationStartDate).setDate(new Date(selectedAvailableDates.reservationStartDate).getDate() - 1)) <= date &&
        date <= new Date(selectedAvailableDates.reservationEndDate)
      ) {
        return "selected-date-apply";
      }
    }
    return "";
  };

  useEffect(() => {
    if (value && Array.isArray(value) && value[0] && value[1] && startTime !== null && endTime !== null) {
      handleDateChange(value);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    console.log(selectedAvailableDates);
  }, [selectedAvailableDates]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i}:00`,
  }));

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
        <div className="mt-4 flex justify-center items-center">
          <div className="time-picker">
            <label>Start Time</label>
            <Select
              value={timeOptions.find((option) => option.value === startTime)}
              onChange={(selectedOption) => setStartTime(selectedOption ? selectedOption.value : null)}
              options={timeOptions}
              placeholder="Select start time"
              maxMenuHeight={200} // Limit to 5 options, each approximately 30px high
            />
          </div>
          <div className="time-picker">
            <label>End Time</label>
            <Select
              value={timeOptions.find((option) => option.value === endTime)}
              onChange={(selectedOption) => setEndTime(selectedOption ? selectedOption.value : null)}
              options={timeOptions}
              placeholder="Select end time"
              maxMenuHeight={200} // Limit to 5 options, each approximately 30px high
            />
          </div>
        </div>
        {selectedAvailableDates.reservationStartDate && selectedAvailableDates.reservationEndDate && (
          <div className="mt-2 flex flex-col items-center justify-center">
            <h1 className="px-6 font-bold text-lg">{`예약 시작 날짜: ${selectedAvailableDates.reservationStartDate}`}</h1>
            <h1 className="px-6 font-bold text-lg">{`예약 종료 날짜: ${selectedAvailableDates.reservationEndDate}`}</h1>
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
        }}
      />
    </>
  );
}

export default ReservationCareApplyDate;
