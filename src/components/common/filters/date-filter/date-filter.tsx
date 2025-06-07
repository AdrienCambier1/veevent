import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./date-filter.scss";
import { Calendar, NavArrowLeft, NavArrowRight } from "iconoir-react";

type DateType = Date | null;

export default function DateFilter() {
  const [startDate, setStartDate] = useState<DateType>(null);
  const [endDate, setEndDate] = useState<DateType>(null);
  const [calendarOpen, setCalendarOpen] = useState<"start" | "end" | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Formatter les dates
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Passer au mois précédent
  const prevMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  // Passer au mois suivant
  const nextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Gérer la sélection d'une date
  const handleDateSelect = (date: Date): void => {
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
  };

  // Générer les jours du mois
  const generateDays = (): JSX.Element[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const dayElements: JSX.Element[] = [];

    // Ajouter les jours vides avant le premier jour du mois
    const firstDay = firstDayOfMonth.getDay(); // 0 = Dimanche
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1; // 0 = Lundi

    for (let i = 0; i < firstDayIndex; i++) {
      dayElements.push(
        <div
          key={`empty-${i}`}
          className="date-filter__calendar-day date-filter__calendar-day--empty"
        ></div>
      );
    }

    // Ajouter les jours du mois
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const isToday =
        new Date().setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0);
      const isSelected =
        (startDate &&
          startDate.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)) ||
        (endDate && endDate.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0));
      const isInRange =
        startDate &&
        endDate &&
        date >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        date <= new Date(endDate.setHours(0, 0, 0, 0));

      dayElements.push(
        <div
          key={day}
          className={`date-filter__calendar-day ${
            isToday ? "date-filter__calendar-day--today" : ""
          } ${isSelected ? "date-filter__calendar-day--selected" : ""} ${
            isInRange && !isSelected
              ? "date-filter__calendar-day--in-range"
              : ""
          }`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }

    return dayElements;
  };

  // Fermer le calendrier si on clique à l'extérieur
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
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [calendarOpen]);

  // Nom du mois courant
  const currentMonthName = currentMonth.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="date-filter">
      <div className="flex flex-col">
        <h2 className="date-filter__title">Plage de dates</h2>
        <p className="date-filter__subtitle">Sélectionnez une plage de dates</p>
      </div>

      <div>
        <div className="date-filter__inputs">
          <div
            className="date-filter__input-container"
            onClick={() => setCalendarOpen("start")}
          >
            <input
              type="text"
              className="date-filter__input"
              placeholder="Du..."
              value={startDate ? formatDate(startDate) : ""}
              readOnly
            />
            <Calendar />
          </div>
          <div
            className="date-filter__input-container"
            onClick={() => setCalendarOpen("end")}
          >
            <input
              type="text"
              className="date-filter__input"
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
              className="date-filter__calendar-wrapper"
              ref={calendarRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="date-filter__calendar">
                <div className="date-filter__calendar-header">
                  <button
                    className="date-filter__calendar-nav"
                    onClick={prevMonth}
                    aria-label="Mois précédent"
                  >
                    <NavArrowLeft />
                  </button>
                  <span className="date-filter__calendar-month">
                    {currentMonthName}
                  </span>
                  <button
                    className="date-filter__calendar-nav"
                    onClick={nextMonth}
                    aria-label="Mois suivant"
                  >
                    <NavArrowRight />
                  </button>
                </div>

                <div className="date-filter__calendar-weekdays">
                  <span>Lu</span>
                  <span>Ma</span>
                  <span>Me</span>
                  <span>Je</span>
                  <span>Ve</span>
                  <span>Sa</span>
                  <span>Di</span>
                </div>

                <div className="date-filter__calendar-days">
                  {generateDays()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
