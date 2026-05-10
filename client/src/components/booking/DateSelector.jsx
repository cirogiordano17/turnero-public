import "react-day-picker/dist/style.css";
import "./styles/days.css";
import { DayPicker } from "react-day-picker";

function DateSelector({
  selectedDate,
  onSelectDate,
  closedDays = [],
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // clave

  const selected = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : undefined;

  const blockedDates = closedDays.map(
    (iso) => new Date(`${iso}T00:00:00`)
  );

  return (
      <div className="date-selector">
        <div className="muted small mb-2">Fecha</div>

        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) return;

            const iso = date.toLocaleDateString("sv-SE");
            const isSunday = date.getDay() === 0;
            const isBlocked = closedDays.includes(iso);
            const isPastOrToday = date <= today;

            if (isSunday || isBlocked || isPastOrToday) return;

            onSelectDate(iso);
          }}
          disabled={[
            { dayOfWeek: [0] },     // domingos
            { before: new Date(today.getTime() + 1) }, // todo hasta hoy inclusive
            ...blockedDates,        // admin
          ]}
          modifiers={{
            blocked: blockedDates,
          }}
          modifiersClassNames={{
            selected: "calendar-selected",
            blocked: "calendar-blocked",
            disabled: "calendar-disabled",
          }}
          showOutsideDays
          weekStartsOn={1}
        />
      </div>
  );
}

export default DateSelector;