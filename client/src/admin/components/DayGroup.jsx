import AppointmentItem from "./AppointmentItem";

function formatGroupDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const formatted = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function DayGroup({ date, items, onActionDone, isHistory = false }) {
  return (
    <section className="admin-day-group">
      <div className="admin-day-group__header">{formatGroupDate(date)}</div>

      <div className="admin-day-group__body">
        {items.map((appointment) => (
          <AppointmentItem
            key={appointment.id}
            appointment={appointment}
            onActionDone={onActionDone}
            isHistory={isHistory}
          />
        ))}
      </div>
    </section>
  );
}

export default DayGroup;