import { formatDateLong } from "../../../utils/dates";
import ClientForm from "../ClientForm";

function ConfirmStep({ category, booking, onBack }) {
  return (
    <div className="card-dark rounded p-3 p-md-4 booking-shell">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <button className="booking-back-btn" onClick={onBack}>
        <span className="booking-back-icon">←</span>
        <span>Anterior</span>
      </button>

        <div className="text-end">
          <div className="fw-bold">Confirmar</div>
          <div className="muted small">
            {category === "pelu" ? "Turno" : "Sesión"}
          </div>
        </div>
      </div>

      <div className="card-dark rounded p-3 booking-summary mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="fw-bold">Resumen</div>
          <div className="text-end">
            <div className="muted small">
              {booking.totalDuration > 0 ? `${booking.totalDuration} min` : "—"}
            </div>
            <div className="fw-bold">
              ${booking.totalPrice.toLocaleString("es-AR")}
            </div>
          </div>
        </div>

        <div className="summary-row">
          <div className="muted small">Fecha</div>
          <div className="fw-semibold">
            {formatDateLong(booking.selectedDate)}
          </div>
        </div>

        <div className="summary-row mt-2">
          <div className="muted small">Horario</div>
          <div className="fw-semibold">{booking.selectedSlot || "—"}</div>
        </div>

        <hr className="border-secondary my-3" />

        <div className="muted small mb-2">Servicios</div>

        <div className="summary-services">
          {booking.selectedServices.map((service) => (
            <div key={service.id} className="sum-svc">
              <div>
                <div className="name">{service.name}</div>
                <div className="meta">{service.duration_min} min</div>
              </div>
              <div>${(service.price || 0).toLocaleString("es-AR")}</div>
            </div>
          ))}
        </div>
      </div>

      <ClientForm
        firstName={booking.firstName}
        lastName={booking.lastName}
        whatsapp={booking.whatsapp}
        email={booking.email}
        comment={booking.comment}
        submitting={booking.submitting}
        submitError={booking.submitError}
        bookingSuccess={booking.bookingSuccess}
        fieldErrors={booking.fieldErrors}
        setFirstName={booking.setFirstName}
        setLastName={booking.setLastName}
        setWhatsapp={booking.setWhatsapp}
        setEmail={booking.setEmail}
        setComment={booking.setComment}
        setFieldErrors={booking.setFieldErrors}
        handleSubmit={booking.handleSubmit}
        resetBooking={booking.resetBooking}
        successTitle={category === "pelu" ? "Turno confirmado" : "Reserva confirmada"}
        successText={
            category === "pelu"
            ? "Tu turno quedó agendado correctamente."
            : "Tu sesión quedó agendada correctamente."
        }
        resetButtonText={
            category === "pelu" ? "Agendar otro turno" : "Agendar otra sesión"
        }
        commentLabel={
            category === "pelu" ? "Comentario (opcional)" : "Consulta / intención"
        }
        commentPlaceholder={
            category === "pelu" ? "Ej: mechas rubias" : "Ej: intención para la sesión"
        }
        confirmButtonText={
            category === "pelu" ? "Confirmar turno" : "Confirmar reserva"
        }
        />
    </div>
  );
}

export default ConfirmStep;