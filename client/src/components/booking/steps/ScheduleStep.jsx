import DateSelector from "../DateSelector";
import Slots from "../Slots";
import { formatDateLong } from "../../../utils/dates";
import "../styles/booking-flow.css";

function ScheduleStep({ booking, onBack, onNext }) {
  const canContinue = booking.selectedDate && booking.selectedSlot;

  return (
    <div className="card-dark rounded p-3 p-md-4 booking-shell">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="booking-back-btn" onClick={onBack}>
            <span className="booking-back-icon">←</span>
            <span>Anterior</span>
        </button>

        <div className="text-end">
          <div className="fw-bold">Elegí Fecha y horario</div>
          <div className="muted small">
            {formatDateLong(booking.selectedDate)}
          </div>
        </div>
      </div>

      <DateSelector
        days={booking.visibleDays}
        selectedDate={booking.selectedDate}
        onSelectDate={booking.setSelectedDate}
        onPrev={booking.handlePrevDays}
        onNext={booking.handleNextDays}
        canGoPrev={booking.canGoPrev}
      />

      <div className="mt-3">
        {booking.selectedIds.length === 0 ? (
          <div className="muted small">Primero elegí un servicio.</div>
        ) : booking.loadingSlots ? (
          <div className="muted small">Cargando horarios...</div>
        ) : booking.slotsError ? (
          <div className="text-warning small">{booking.slotsError}</div>
        ) : (
          <Slots
            slots={booking.slots}
            selectedSlot={booking.selectedSlot}
            onSelect={booking.setSelectedSlot}
          />
        )}
      </div>

    <div className="booking-bottom-bar">
  <div className="booking-bottom-bar__info">
    <div className="booking-bottom-bar__title">
      {booking.selectedServices.length > 0
        ? booking.selectedServices.map((s) => s.name).join(" + ")
        : "Elegí un horario"}
    </div>

    {booking.totalPrice > 0 && (
      <div className="booking-bottom-bar__price">
        ${booking.totalPrice.toLocaleString("es-AR")}
      </div>
        )}

        <div className="booking-bottom-bar__meta">
          {booking.selectedSlot
            ? `${formatDateLong(booking.selectedDate)} · ${booking.selectedSlot}${
                booking.endTime ? ` - ${booking.endTime}` : ""
              }`
            : "Seleccioná fecha y horario para continuar"}
        </div>
      </div>

      <button
        className="booking-bottom-bar__button"
        type="button"
        onClick={onNext}
        disabled={!canContinue}
      >
        Siguiente
      </button>
    </div>
    </div>
  );
}

export default ScheduleStep;