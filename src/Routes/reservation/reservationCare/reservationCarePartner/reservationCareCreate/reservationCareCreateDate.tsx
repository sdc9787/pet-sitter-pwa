import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "../../../../../Component/topbar/topbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import the CSS for react-calendar
import "./ReservationCareCreateDate.css"; // Custom CSS for styling
import { RootState, setUnavailableDate } from "../../../../../Store/store";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const ReservationCareCreateDate: React.FC = () => {
  const dispatch = useDispatch();
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
      <Topbar backUrl="/reservation/care" title="돌봄 글 작성" />
      <div className="mt-16">
        <Calendar onChange={handleDateChange} value={value} minDate={minDate} maxDate={maxDate} formatDay={(locale, date) => date.toLocaleString("en", { day: "numeric" })} tileClassName={tileClassName} />
        <div className="mt-4">
          <h3>선택한 불가능한 날짜들:</h3>
          <ul>
            {unavailableDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ReservationCareCreateDate;
