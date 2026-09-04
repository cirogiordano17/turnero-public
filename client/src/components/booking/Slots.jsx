  import "./styles/slots.css";

  function splitSlotsByRange(slots) {
    const morning = [];
    const afternoon = [];
    const night = [];

    slots.forEach((slot) => {
      const hour = Number(slot.split(":")[0]);

      if (hour < 13) {
        morning.push(slot);
      } else if (hour < 18) {
        afternoon.push(slot);
      } else {
        night.push(slot);
      }
    });

    return { morning, afternoon, night };
  }

 function SlotGroup({ title, slots = [], selectedSlot, onSelect }) {
  const safeSlots = Array.isArray(slots) ? slots : [];

  if (safeSlots.length === 0) return null;

  return (
    <section className="slot-group-card">
      <h3 className="slot-group-card__title">{title}</h3>

      <div className="slots-grid">
        {safeSlots.map((slot) => {
          const active = selectedSlot === slot;

          return (
            <button
              key={slot}
              type="button"
              className={`slot-btn ${active ? "slot-btn--active" : ""}`}
              onClick={() => onSelect(slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </section>
  );
}
function Slots({ slots, selectedSlot, onSelect, isClosed }) {
  const safeSlots = Array.isArray(slots) ? slots : [];
  const { morning, afternoon, night } = splitSlotsByRange(safeSlots);

    return (
  <div className="slots-section">
    <label className="slots-section__label">Horarios disponibles</label>

    {isClosed ? (
      <div className="slots-closed">
        Este día el salón está cerrado
      </div>
    ) : safeSlots.length === 0 ? (
      <div className="slots-closed">
        Sin cupos disponibles para este día. Elegí otra fecha.
      </div>
    ) : (
      <>
        <SlotGroup
          title="Mañana"
          slots={morning}
          selectedSlot={selectedSlot}
          onSelect={onSelect}
        />

        <SlotGroup
          title="Tarde"
          slots={afternoon}
          selectedSlot={selectedSlot}
          onSelect={onSelect}
        />

        <SlotGroup
          title="Noche"
          slots={night}
          selectedSlot={selectedSlot}
          onSelect={onSelect}
        />
      </>
    )}
  </div>
);
  }

  export default Slots;