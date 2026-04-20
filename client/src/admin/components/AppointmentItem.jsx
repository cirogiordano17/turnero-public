import { cancelAppointment, confirmPayment } from "../api/admin.api";

function AppointmentItem({ appointment, onActionDone }) {
  const {
    id,
    category,
    status,
    first_name,
    last_name,
    start_hhmm,
    end_hhmm,
  } = appointment;

  async function handleCancel() {
    try {
      await cancelAppointment(id);
      await onActionDone?.();
    } catch (err) {
      alert(err.message || "No se pudo cancelar el turno");
    }
  }

  async function handleConfirmPayment() {
    try {
      await confirmPayment(id);
      await onActionDone?.();
    } catch (err) {
      alert(err.message || "No se pudo confirmar el pago");
    }
  }

  return (
    <article className="admin-appointment-item">
      <div className="admin-appointment-item__row">
        <span className="admin-appointment-item__meta">
          🕒 {start_hhmm} - {end_hhmm}
        </span>

        <span className="admin-appointment-item__name">
          {first_name} {last_name}
        </span>
      </div>

      <div className="admin-appointment-item__row admin-appointment-item__row--badges">
        <span className={`admin-badge admin-badge--category admin-badge--${category}`}>
          {category === "pelu" ? "PELUQUERÍA" : "REGISTROS AKASHICOS"}
        </span>

        <span className={`admin-badge admin-badge--status admin-badge--status-${status}`}>
          {status === "CONFIRMADO"
            ? "Confirmado"
            : status === "PENDIENTE_PAGO"
            ? "Pendiente de pago"
            : status === "CANCELADO"
            ? "Cancelado"
            : status}
        </span>
      </div>

      <div className="admin-appointment-item__actions">
        {category === "akashicos" && status === "PENDIENTE_PAGO" && (
          <button
            type="button"
            className="admin-btn admin-btn--confirm"
            onClick={handleConfirmPayment}
          >
            Confirmar reserva
          </button>
        )}

        {status !== "CANCELADO" && (
          <button
            type="button"
            className="admin-btn admin-btn--cancel"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </article>
  );
}

export default AppointmentItem;