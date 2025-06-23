import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./date-filter.scss";
import { Calendar, NavArrowLeft, NavArrowRight } from "iconoir-react";
import { JSX } from "react";
import { useFilters } from "@/contexts/FilterContext";

type CalendarState = "start" | "end" | null;

export default function DateFilter() {
  const { tempFilters, updateTempFilters } = useFilters();
  
  // Obtenir la date actuelle pour les comparaisons
  const today = useMemo(() => {
    const now = new Date();
    // Réinitialiser à minuit pour éviter les problèmes d'heure
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  
  // État local pour les dates sélectionnées
  const [startDate, setStartDate] = useState<Date | null>(
    tempFilters.startDate ? new Date(tempFilters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    tempFilters.endDate ? new Date(tempFilters.endDate) : null
  );
  const [calendarOpen, setCalendarOpen] = useState<CalendarState>(null);
  // Initialiser le mois courant à la date actuelle
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Synchroniser avec les filtres temporaires du contexte
  useEffect(() => {
    if (tempFilters.startDate && tempFilters.startDate !== startDate?.toISOString().split('T')[0]) {
      setStartDate(new Date(tempFilters.startDate));
    }
    if (tempFilters.endDate && tempFilters.endDate !== endDate?.toISOString().split('T')[0]) {
      setEndDate(new Date(tempFilters.endDate));
    }
  }, [tempFilters.startDate, tempFilters.endDate, startDate, endDate]);

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

  // Convertir une date en format ISO (YYYY-MM-DD)
  const formatDateForAPI = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  // Vérifier si une date est dans le passé
  const isDateInPast = useCallback((date: Date): boolean => {
    return date < today;
  }, [today]);

  // ✅ Navigation mois optimisée avec restriction
  const prevMonth = useCallback((): void => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    // Ne pas permettre de naviguer vers un mois antérieur au mois actuel
    if (newMonth.getFullYear() > today.getFullYear() || 
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() >= today.getMonth())) {
      setCurrentMonth(newMonth);
    }
  }, [currentMonth, today]);

  const nextMonth = useCallback((): void => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  }, []);

  // Vérifier si le bouton précédent doit être désactivé
  const isPrevMonthDisabled = useMemo(() => {
    return currentMonth.getFullYear() === today.getFullYear() && 
           currentMonth.getMonth() === today.getMonth();
  }, [currentMonth, today]);

  // ✅ Sélection de date optimisée avec vérification des dates passées
  const handleDateSelect = useCallback(
    (date: Date): void => {
      // Ne pas permettre la sélection de dates passées
      if (isDateInPast(date)) {
        return;
      }

      if (calendarOpen === "start") {
        setStartDate(date);
        
        // Mettre à jour les filtres temporaires (pas appliqués immédiatement)
        updateTempFilters({
          startDate: formatDateForAPI(date)
        });

        if (!endDate || date > endDate) {
          setEndDate(null);
          updateTempFilters({
            startDate: formatDateForAPI(date),
            endDate: undefined
          });
          setCalendarOpen("end");
        } else {
          setCalendarOpen(null);
        }
      } else if (calendarOpen === "end") {
        if (startDate && date < startDate) {
          setEndDate(startDate);
          setStartDate(date);
          updateTempFilters({
            startDate: formatDateForAPI(date),
            endDate: formatDateForAPI(startDate)
          });
        } else {
          setEndDate(date);
          updateTempFilters({
            endDate: formatDateForAPI(date)
          });
        }
        setCalendarOpen(null);
      }
    },
    [calendarOpen, endDate, startDate, updateTempFilters, formatDateForAPI, isDateInPast]
  );

  // Fonction pour effacer les dates
  const clearDates = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    updateTempFilters({
      startDate: undefined,
      endDate: undefined
    });
  }, [updateTempFilters]);

  // ✅ Génération des jours avec useMemo (évite recalculs inutiles)
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

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
      const isPast = isDateInPast(date);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""} ${
            isSelected ? "selected" : ""
          } ${isInRange ? "in-range" : ""} ${isPast ? "past disabled" : ""}`}
          onClick={() => !isPast && handleDateSelect(date)}
          style={{
            cursor: isPast ? "not-allowed" : "pointer",
            opacity: isPast ? 0.4 : 1,
          }}
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
    today,
    isSameDay,
    isInDateRange,
    isDateInPast,
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

  // Vérifier si des dates sont sélectionnées
  const hasSelectedDates = startDate || endDate;

  const calendarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="date-filter">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="title">Plage de dates</h2>
          {hasSelectedDates && (
            <button
              onClick={clearDates}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Effacer
            </button>
          )}
        </div>
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
                    className={`calendar-nav ${isPrevMonthDisabled ? 'disabled' : ''}`}
                    onClick={prevMonth}
                    disabled={isPrevMonthDisabled}
                    aria-label="Mois précédent"
                    style={{
                      opacity: isPrevMonthDisabled ? 0.4 : 1,
                      cursor: isPrevMonthDisabled ? "not-allowed" : "pointer",
                    }}
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
