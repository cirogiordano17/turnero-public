import AppointmentItem from "./AppointmentItem";

function formatGroupDate(dateString) {
  const date = new Date(dateString);

  const formatted = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function DayGroup({ date, items, onActionDone }) {
  return (
    <section className="admin-day-group">
      <div className="admin-day-group__header">{formatGroupDate(date)}</div>

      <div className="admin-day-group__body">
        {items.map((appointment) => (
          <AppointmentItem
            key={appointment.id}
            appointment={appointment}
            onActionDone={onActionDone}
          />
        ))}
      </div>
    </section>
  );
}

export default DayGroup;