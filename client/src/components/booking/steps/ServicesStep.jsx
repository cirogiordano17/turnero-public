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

      </div>

      <Services
        category={category}
        selectedIds={booking.selectedIds}
        onToggle={booking.toggleService}
        onServicesLoaded={booking.setServices}
      />

      <div className="booking-bottom-bar">
          <div className="booking-bottom-bar__info">
            {booking.selectedServices.length > 0 ? (
              <>
                <div className="booking-bottom-bar__title">
                  {booking.selectedServices.length} servicio
                  {booking.selectedServices.length > 1 ? "s" : ""}
                </div>
                <div className="booking-bottom-bar__price">
                  ${booking.totalPrice.toLocaleString("es-AR")}
                </div>
              </>
            ) : (
              <div className="booking-bottom-bar__meta">
                Elegí al menos un servicio para continuar
              </div>
            )}
          </div>

          <button
            className="booking-bottom-bar__button"
            type="button"
            onClick={onNext}
            disabled={booking.selectedServices.length === 0}
          >
            Siguiente
          </button>
        </div>
    </div>
  );
}

export default ServicesStep;