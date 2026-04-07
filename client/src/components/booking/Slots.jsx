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

function SlotGroup({ title, slots, selectedSlot, onSelect }) {
  return (
    <div className="time-group mt-3">
      <div className="muted small mb-2">{title}</div>

      <div className="slots-grid">
        {slots.length === 0 ? (
          <div className="muted small">Sin horarios.</div>
        ) : (
          slots.map((slot) => {
            const active = selectedSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                className={`btn ${active ? "btn-success" : "btn-outline-light"}`}
                onClick={() => onSelect(slot)}
              >
                {slot}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function Slots({ slots, selectedSlot, onSelect }) {
  const { morning, afternoon, night } = splitSlotsByRange(slots);

  return (
    <div>
      <label className="form-label mt-3">Horarios disponibles</label>

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
    </div>
  );
}

export default Slots;