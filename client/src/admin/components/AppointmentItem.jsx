import { useState } from "react";
import { cancelAppointment, confirmPayment, markAttendance } from "../api/admin.api";
import AdminConfirmModal from "./AdminConfirmModal";
import RescheduleModal from "./RescheduleModal";

function AppointmentItem({ appointment, onActionDone, isHistory = false }) {
  const {
    id,
    category,
    status,
    first_name,
    last_name,
    start_hhmm,
    end_hhmm,
    whatsapp,
    email,
    comment,
    services,
  } = appointment;

  const serviceLabel =
    category === "pelu" && Array.isArray(services) && services.length > 0
      ? services.map((s) => s.name).join(" + ")
      : null;

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: null,
  });
  const [loadingAction, setLoadingAction] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const fullName = `${first_name} ${last_name}`.trim();
  const hasWhatsapp = !!whatsapp?.trim();
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
      } else if (confirmState.type === "confirmPayment") {
        await confirmPayment(id);
      } else if (confirmState.type === "attended") {
        await markAttendance(id, true);
      } else if (confirmState.type === "noshow") {
        await markAttendance(id, false);
      }

      closeModal();
      await onActionDone?.();
    } catch (err) {
      alert(err.message || "No se pudo completar la acción");
    } finally {
      setLoadingAction(false);
    }
  }

  const modalTitle =
    confirmState.type === "cancel" ? "Cancelar turno"
    : confirmState.type === "confirmPayment" ? "Confirmar pago"
    : confirmState.type === "attended" ? "Marcar asistencia"
    : "Marcar inasistencia";

  const modalMessage =
    confirmState.type === "cancel"
      ? `¿Seguro que querés cancelar el turno de ${fullName}? Esta acción no se puede deshacer.`
      : confirmState.type === "confirmPayment"
      ? `${fullName} ya realizó el pago del turno. ¿Querés confirmarlo?`
      : confirmState.type === "attended"
      ? `¿Confirmás que ${fullName} asistió al turno?`
      : `¿Confirmás que ${fullName} no asistió al turno?`;

  const modalConfirmText =
    confirmState.type === "cancel" ? "Sí, cancelar"
    : confirmState.type === "attended" ? "Sí, asistió"
    : confirmState.type === "noshow" ? "Sí, no asistió"
    : "Sí, confirmar";

  const modalVariant =
    confirmState.type === "cancel" || confirmState.type === "noshow" ? "danger" : "success";

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
            {status === "CONFIRMADO" ? "Confirmado"
              : status === "PENDIENTE_PAGO" ? "Pendiente de pago"
              : status === "CANCELADO" ? "Cancelado"
              : status === "ASISTIDO" ? "Asistió"
              : status === "NO_SHOW" ? "No asistió"
              : status}
          </span>
        </div>

        {serviceLabel && (
          <div className="admin-appointment-item__services">
            {serviceLabel}
          </div>
        )}

        {(hasEmail || hasComment || hasWhatsapp) && (
          <div className="admin-appointment-item__extra">
            {hasWhatsapp && (
              <div className="admin-appointment-item__extra-row">
                <span className="admin-appointment-item__extra-label">
                  WhatsApp:
                </span>

                <span className="admin-appointment-item__extra-value">
                  {whatsapp}
                </span>
              </div>
            )}
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

        {!isHistory && status !== "CANCELADO" && (
          <div
            className={`admin-appointment-item__actions${
              category === "akashicos" && status === "PENDIENTE_PAGO"
                ? " admin-appointment-item__actions--three"
                : ""
            }`}
          >
            <button
              type="button"
              className="admin-btn admin-btn--cancel"
              onClick={openCancelModal}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="admin-btn admin-btn--reschedule"
              onClick={() => setRescheduleOpen(true)}
            >
              Reprogramar
            </button>

            {category === "akashicos" && status === "PENDIENTE_PAGO" && (
              <button
                type="button"
                className="admin-btn admin-btn--confirm"
                onClick={openConfirmPaymentModal}
              >
                Confirmar reserva
              </button>
            )}
          </div>
        )}

        {isHistory && status !== "ASISTIDO" && status !== "NO_SHOW" && status !== "CANCELADO" && (
          <div className="admin-appointment-item__actions">
            <button
              type="button"
              className="admin-btn admin-btn--confirm"
              onClick={() => setConfirmState({ open: true, type: "attended" })}
            >
              Asistió
            </button>

            <button
              type="button"
              className="admin-btn admin-btn--cancel"
              onClick={() => setConfirmState({ open: true, type: "noshow" })}
            >
              No asistió
            </button>
          </div>
        )}
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

      <RescheduleModal
        open={rescheduleOpen}
        appointment={appointment}
        onClose={() => setRescheduleOpen(false)}
        onDone={onActionDone}
      />
    </>
  );
}

export default AppointmentItem;