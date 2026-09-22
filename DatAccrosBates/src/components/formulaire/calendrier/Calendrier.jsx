import React from "react";
import "react-calendar/dist/Calendar.css";
import "./calendrier.css";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Calendrier = ({ date, setDate, isLimite, isModify }) => {
  // Vérifier si la date est valide
  const isValidDate = (date) => {
    return dayjs(date).isValid();
  };

  return (
    <div>
      <div>
        {isModify ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              showDaysOutsideCurrentMonth
              onChange={(newDate) => setDate(newDate)}
              value={isValidDate(date) ? dayjs(date) : null}
              maxDate={isLimite ? dayjs(isLimite) : null}
              views={["year", "month", "day"]}
              style={{ color: "var(--text-100" }}
            />
          </LocalizationProvider>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              showDaysOutsideCurrentMonth
              onChange={(newDate) => setDate(newDate)}
              value={isValidDate(date) ? dayjs(date) : null}
              minDate={isLimite ? dayjs(new Date()) : dayjs(new Date())}
              maxDate={isLimite ? dayjs(isLimite) : null}
              views={["year", "month", "day"]}
              style={{ color: "var(--text-100" }}
            />
          </LocalizationProvider>
        )}
      </div>
    </div>
  );
};

export default Calendrier;
