import {
  formatDateISO,
  formatMonthLabel,
  formatDayName,
  formatDayNumber,
} from "../../utils/dates";

function DateSelector({ days, selectedDate, onSelectDate, onPrev, onNext }) {
  const selected = days.find((day) => formatDateISO(day) === selectedDate);
  const nextMonthDay = days.find(
    (day) => formatMonthLabel(day) !== formatMonthLabel(days[0])
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-1">
        <div>
          <div className="muted small">Fecha</div>

          <div className="month-row">
            <div className="h5 m-0" id="monthLabel">
              {days[0] ? formatMonthLabel(days[0]) : "—"}
            </div>

            <div className="h5 m-0 month-muted">
              {nextMonthDay ? formatMonthLabel(nextMonthDay) : "—"}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <button type="button" className="btn btn-outline-light btn-md" onClick={onPrev}>
            ‹
          </button>

          <span className="days-nav-label">Ver otros días</span>

          <button type="button" className="btn btn-outline-light btn-md" onClick={onNext}>
            ›
          </button>
        </div>
      </div>

      <div className="day-strip mt-3">
        {days.map((day) => {
          const iso = formatDateISO(day);
          const active = iso === selectedDate;

          return (
            <button
              key={iso}
              type="button"
              className={`day-btn ${active ? "active" : ""}`}
              onClick={() => onSelectDate(iso)}
            >
              <span className="dow">{formatDayName(day)}</span>
              <span className="dom">{formatDayNumber(day)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DateSelector;