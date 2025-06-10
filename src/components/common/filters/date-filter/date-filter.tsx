import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./date-filter.scss";
import { Calendar, NavArrowLeft, NavArrowRight } from "iconoir-react";
import { JSX } from "react";

type CalendarState = "start" | "end" | null;

export default function DateFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<CalendarState>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // ✅ Fonctions utilitaires pures (évitent les mutations)
  const isSameDay = useCallback((date1: Date | null, date2: Date): boolean => {
    if (!date1) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }, []);

  const isInDateRange = useCallback(
    (date: Date, start: Date | null, end: Date | null): boolean => {
      if (!start || !end) return false;
      return date >= start && date <= end;
    },
    []
  );

  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  }, []);

  // ✅ Navigation mois optimisée
  const prevMonth = useCallback((): void => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  }, []);

  const nextMonth = useCallback((): void => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  }, []);

  // ✅ Sélection de date optimisée
  const handleDateSelect = useCallback(
    (date: Date): void => {
      if (calendarOpen === "start") {
        setStartDate(date);
        if (!endDate || date > endDate) {
          setEndDate(null);
          setCalendarOpen("end");
        } else {
          setCalendarOpen(null);
        }
      } else if (calendarOpen === "end") {
        if (startDate && date < startDate) {
          setEndDate(startDate);
          setStartDate(date);
        } else {
          setEndDate(date);
        }
        setCalendarOpen(null);
      }
    },
    [calendarOpen, endDate, startDate]
  );

  // ✅ Génération des jours avec useMemo (évite recalculs inutiles)
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Lundi = 0

    const days: JSX.Element[] = [];

    // Jours vides
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Jours du mois
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);

      const isToday = isSameDay(today, date);
      const isSelected = isSameDay(startDate, date) || isSameDay(endDate, date);
      const isInRange = isInDateRange(date, startDate, endDate) && !isSelected;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""} ${
            isSelected ? "selected" : ""
          } ${isInRange ? "in-range" : ""}`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  }, [
    currentMonth,
    startDate,
    endDate,
    isSameDay,
    isInDateRange,
    handleDateSelect,
  ]);

  // ✅ Nom du mois avec useMemo
  const currentMonthName = useMemo(() => {
    return currentMonth.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  // ✅ Click extérieur optimisé
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(null);
      }
    };

    if (calendarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [calendarOpen]);

  // ✅ Handlers pour les inputs
  const handleStartDateClick = useCallback(() => setCalendarOpen("start"), []);
  const handleEndDateClick = useCallback(() => setCalendarOpen("end"), []);

  return (
    <div className="date-filter">
      <div className="flex flex-col">
        <h2 className="title">Plage de dates</h2>
        <p className="subtitle">Sélectionnez une plage de dates</p>
      </div>

      <div>
        <div className="inputs">
          <div className="input-container" onClick={handleStartDateClick}>
            <input
              type="text"
              className="input"
              placeholder="Du..."
              value={startDate ? formatDate(startDate) : ""}
              readOnly
            />
            <Calendar />
          </div>
          <div className="input-container" onClick={handleEndDateClick}>
            <input
              type="text"
              className="input"
              placeholder="Au..."
              value={endDate ? formatDate(endDate) : ""}
              readOnly
            />
            <Calendar />
          </div>
        </div>

        <AnimatePresence>
          {calendarOpen && (
            <motion.div
              className="calendar-wrapper"
              ref={calendarRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="calendar">
                <div className="calendar-header">
                  <button
                    className="calendar-nav"
                    onClick={prevMonth}
                    aria-label="Mois précédent"
                  >
                    <NavArrowLeft />
                  </button>
                  <span className="calendar-month">{currentMonthName}</span>
                  <button
                    className="calendar-nav"
                    onClick={nextMonth}
                    aria-label="Mois suivant"
                  >
                    <NavArrowRight />
                  </button>
                </div>

                <div className="calendar-weekdays">
                  {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="calendar-days">{calendarDays}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
