import Services from "../Services";
import "../styles/booking-flow.css";

function ServicesStep({ category, booking, onNext, onBack }) {
  return (
    <div className="card-dark rounded p-3 p-md-4 booking-shell">
      <div className="d-flex justify-content-between align-items-center mb-3">
       <button className="booking-back-btn" onClick={onBack}>
            <span className="booking-back-icon">←</span>
            <span>Anterior</span>
        </button>

        <div className="text-end">
          <div className="fw-bold">Elegí tus servicios</div>
          <div className="muted small">
            {category === "pelu" ? "Peluquería" : "Registros Akáshicos"}
          </div>
        </div>
      </div>

      <Services
        category={category}
        selectedIds={booking.selectedIds}
        onToggle={booking.toggleService}
        onServicesLoaded={booking.setServices}
      />

      {booking.selectedServices.length === 0 ? (
        <div className="muted small mt-3">Elegí al menos un servicio para seguir.</div>
        ) : null}

        {booking.selectedServices.length > 0 && (
        <div className="booking-bottom-bar">
            <div className="booking-bottom-bar__info">
            <div className="booking-bottom-bar__title">
                {booking.selectedServices.length} servicio
                {booking.selectedServices.length > 1 ? "s" : ""}
            </div>
            <div className="booking-bottom-bar__price">
                ${booking.totalPrice.toLocaleString("es-AR")}
            </div>
            </div>

            <button
            className="booking-bottom-bar__button"
            type="button"
            onClick={onNext}
            >
            Siguiente
            </button>
        </div>
        )}
    </div>
  );
}

export default ServicesStep;