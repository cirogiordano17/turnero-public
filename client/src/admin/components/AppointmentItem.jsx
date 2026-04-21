import { useState } from "react";
import { cancelAppointment, confirmPayment } from "../api/admin.api";
import AdminConfirmModal from "./AdminConfirmModal";

function AppointmentItem({ appointment, onActionDone }) {
  const {
    id,
    category,
    status,
    first_name,
    last_name,
    start_hhmm,
    end_hhmm,
    email,
    comment,
  } = appointment;

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: null,
  });
  const [loadingAction, setLoadingAction] = useState(false);

  const fullName = `${first_name} ${last_name}`.trim();
  const hasEmail = !!email?.trim();
  const hasComment = !!comment?.trim();

  function openCancelModal() {
    setConfirmState({ open: true, type: "cancel" });
  }

  function openConfirmPaymentModal() {
    setConfirmState({ open: true, type: "confirmPayment" });
  }

  function closeModal() {
    if (loadingAction) return;
    setConfirmState({ open: false, type: null });
  }

  async function handleConfirmAction() {
    try {
      setLoadingAction(true);

      if (confirmState.type === "cancel") {
        await cancelAppointment(id);
      }

      if (confirmState.type === "confirmPayment") {
        await confirmPayment(id);
      }

      closeModal();
      await onActionDone?.();
    } catch (err) {
      alert(
        err.message ||
          (confirmState.type === "cancel"
            ? "No se pudo cancelar el turno"
            : "No se pudo confirmar el pago")
      );
    } finally {
      setLoadingAction(false);
    }
  }

  const modalTitle =
    confirmState.type === "cancel" ? "Cancelar turno" : "Confirmar pago";

  const modalMessage =
    confirmState.type === "cancel"
      ? `¿Seguro que querés cancelar el turno de ${fullName}? Esta acción no se puede deshacer.`
      : `${fullName} ya realizó el pago del turno. ¿Querés confirmarlo?`;

  const modalConfirmText =
    confirmState.type === "cancel" ? "Sí, cancelar" : "Sí, confirmar";

  const modalVariant =
    confirmState.type === "cancel" ? "danger" : "success";

  return (
    <>
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
          <span
            className={`admin-badge admin-badge--category admin-badge--${category}`}
          >
            {category === "pelu" ? "PELUQUERÍA" : "REGISTROS AKASHICOS"}
          </span>

          <span
            className={`admin-badge admin-badge--status admin-badge--status-${status}`}
          >
            {status === "CONFIRMADO"
              ? "Confirmado"
              : status === "PENDIENTE_PAGO"
              ? "Pendiente de pago"
              : status === "CANCELADO"
              ? "Cancelado"
              : status}
          </span>
        </div>

        {(hasEmail || hasComment) && (
          <div className="admin-appointment-item__extra">
            {hasEmail && (
              <div className="admin-appointment-item__extra-row">
                <span className="admin-appointment-item__extra-label">Email:</span>
                <span className="admin-appointment-item__extra-value">{email}</span>
              </div>
            )}

            {hasComment && (
              <div className="admin-appointment-item__extra-row">
                <span className="admin-appointment-item__extra-label">Comentario:</span>
                <span className="admin-appointment-item__extra-value">{comment}</span>
              </div>
            )}
          </div>
        )}

        <div className="admin-appointment-item__actions">
          {category === "akashicos" && status === "PENDIENTE_PAGO" && (
            <button
              type="button"
              className="admin-btn admin-btn--confirm"
              onClick={openConfirmPaymentModal}
            >
              Confirmar reserva
            </button>
          )}

          {status !== "CANCELADO" && (
            <button
              type="button"
              className="admin-btn admin-btn--cancel"
              onClick={openCancelModal}
            >
              Cancelar
            </button>
          )}
        </div>
      </article>

      <AdminConfirmModal
        open={confirmState.open}
        title={modalTitle}
        message={modalMessage}
        confirmText={modalConfirmText}
        confirmVariant={modalVariant}
        loading={loadingAction}
        onCancel={closeModal}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}

export default AppointmentItem;