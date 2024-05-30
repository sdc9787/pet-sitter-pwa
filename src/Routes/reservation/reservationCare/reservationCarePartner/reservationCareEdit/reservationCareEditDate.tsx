import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "../../../../../Component/topbar/topbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import the CSS for react-calendar
import "./ReservationCareEditDate.css"; // Custom CSS for styling
import { RootState, setUnavailableDate, setCareDateState } from "../../../../../Store/store";
import ActionBtn from "../../../../../Component/actionBtn/actionBtn";
import { useNavigate, useParams } from "react-router-dom";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const ReservationCareEditDate: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unavailableDates = useSelector((state: RootState) => state.reservationCare.unavailableDates);
  const [value, setValue] = useState<Value>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [maxDate, setMaxDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const max = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of the month 2 months ahead
    setMinDate(min);
    setMaxDate(max);
  }, []);

  const handleDateChange = (value: Value) => {
    const date = value as Date; // Type assertion
    const formattedDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
    let updatedDates;
    if (!unavailableDates.includes(formattedDate)) {
      updatedDates = [...unavailableDates, formattedDate];
    } else {
      updatedDates = unavailableDates.filter((d) => d !== formattedDate);
    }
    dispatch(setUnavailableDate(updatedDates));
    dispatch(setCareDateState(true)); // Set care date state to true when dates are changed
    setSelectedDate(formattedDate);
    setValue(date);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const formattedDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
      if (unavailableDates.includes(formattedDate)) {
        return "unavailable-date";
      } else if (formattedDate === selectedDate) {
        return "selected-date";
      }
    }
    return "";
  };

  return (
    <>
      <Topbar backUrl="/reservation/care/partner" title="돌봄 글 작성" />
      <div className="mt-16">
        <Calendar
          onChange={handleDateChange}
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })}
          tileClassName={tileClassName}
          calendarType="gregory" // Set the calendar to start the week on Sunday
        />
        <div className="mt-4 flex flex-col justify-center items-center">
          <h1 className="px-6 font-bold text-lg">예약이 불가능한 날짜를 선택해 주세요</h1>
          <ul>
            {unavailableDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      </div>
      <ActionBtn
        buttonCount={1}
        button1Props={{
          text: "다음",
          onClick: () => {
            navigate(`/reservation/care/partner/edit/images/${id}`);
          },
          color: "bg-main",
        }}></ActionBtn>
    </>
  );
};

export default ReservationCareEditDate;
