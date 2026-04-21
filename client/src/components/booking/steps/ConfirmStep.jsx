import { formatDateLong } from "../../../utils/dates";
import ClientForm from "../ClientForm";
import { CONTACT } from "../../../config/contact";

function ConfirmStep({ category, booking, onBack, onRestart }) {
  const whatsappMessage = encodeURIComponent(
    `Hola, te envío el comprobante de pago de mi sesión de Registros Akáshicos.`
  );

  return (
    <div className="card-dark rounded p-3 p-md-4 booking-shell">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="booking-back-btn" onClick={onBack}>
          <span className="booking-back-icon">←</span>
          <span>Anterior</span>
        </button>
      </div>

      {category === "akashicos" && (
        <>
          <div className="alert-akashicos">
            <div className="alert-akashicos__title">ATENCIÓN</div>
            <div className="alert-akashicos__text">
              Para confirmar la sesión se debe abonar por transferencia.
              <br />
              Luego de reservar, tenés <strong>24 hs</strong> para realizar el
              pago o el turno se libera automáticamente.
              <br />
              La sesión de Registros Akáshicos se paga con anticipación.
            </div>
          </div>

          <div className="transfer-box">
            <div className="transfer-box__title">Datos para la transferencia</div>

            <div className="transfer-box__grid">
              <div className="transfer-box__row">
                <span className="transfer-box__label">CVU</span>
                <span className="transfer-box__value">
                  {CONTACT.transfer.cvu}
                </span>
              </div>

              <div className="transfer-box__row">
                <span className="transfer-box__label">Alias</span>
                <span className="transfer-box__value">
                  {CONTACT.transfer.alias}
                </span>
              </div>

              <div className="transfer-box__row">
                <span className="transfer-box__label">CUIT</span>
                <span className="transfer-box__value">
                  {CONTACT.transfer.cuit}
                </span>
              </div>

              <div className="transfer-box__row">
                <span className="transfer-box__label">Nombre</span>
                <span className="transfer-box__value">
                  {CONTACT.transfer.holderName}
                </span>
              </div>
            </div>

            <a
              className="transfer-box__cta"
              href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
            >
              Enviar comprobante
            </a>
          </div>
        </>
      )}

      <div className="confirm-summary-card mb-4">
        <div className="confirm-summary-card__header">
          <div className="confirm-summary-card__title">Resumen</div>
        </div>

        <div className="confirm-summary-card__section">
          <div className="confirm-summary-row">
            <div className="confirm-summary-row__label">Fecha</div>
            <div className="confirm-summary-row__value">
              {formatDateLong(booking.selectedDate)}
            </div>
          </div>

          <div className="confirm-summary-row">
            <div className="confirm-summary-row__label">Horario</div>
            <div className="confirm-summary-row__value">
              {booking.selectedSlot || "—"}
              {booking.endTime ? ` - ${booking.endTime}` : ""}
            </div>
          </div>
        </div>

        <div className="confirm-summary-divider" />

        <div className="confirm-summary-card__section">
          <div className="confirm-summary-section-title">Detalle</div>

          <div className="confirm-summary-services">
            {booking.selectedServices.map((service) => (
              <div key={service.id} className="confirm-summary-service">
                <div className="confirm-summary-service__left">
                  <div className="confirm-summary-service__name">
                    {service.name}
                  </div>
                  <div className="confirm-summary-service__meta">
                    {service.duration_min} min
                  </div>
                </div>

                <div className="confirm-summary-service__right">
                  ${(service.price || 0).toLocaleString("es-AR")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="confirm-summary-divider" />

        <div className="confirm-summary-total">
          <div>
            <div className="confirm-summary-total__label">Total</div>
            <div className="confirm-summary-total__meta">
              {booking.totalDuration > 0 ? `${booking.totalDuration} min` : "—"}
            </div>
          </div>

          <div className="confirm-summary-total__price">
            ${booking.totalPrice.toLocaleString("es-AR")}
          </div>
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
        resetBooking={onRestart}
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