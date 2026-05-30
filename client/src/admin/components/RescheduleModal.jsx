import { useState, useEffect } from "react";
import { getAvailability, rescheduleAppointment } from "../api/admin.api";

function RescheduleModal({ open, appointment, onClose, onDone }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDate("");
      setSlots([]);
      setSelectedSlot(null);
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!date || !open) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    const ids = appointment?.services?.map((s) => s.id) ?? [];
    setLoadingSlots(true);
    setError("");
    setSelectedSlot(null);

    getAvailability(date, ids)
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setError("No se pudo cargar la disponibilidad"))
      .finally(() => setLoadingSlots(false));
  }, [date, open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleConfirm() {
    if (!selectedSlot) return;
    setSaving(true);
    setError("");
    try {
      await rescheduleAppointment(appointment.id, date, selectedSlot);
      onDone?.();
      onClose();
    } catch (err) {
      setError(err.message || "No se pudo reprogramar el turno");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);
  const fullName = `${appointment?.first_name ?? ""} ${appointment?.last_name ?? ""}`.trim();

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal admin-modal--reschedule"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-modal__header admin-modal__header--with-close">
          <h3 className="admin-modal__title">Reprogramar turno</h3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        <div className="admin-modal__body">
          <p className="admin-reschedule__client">{fullName}</p>

          <div className="admin-reschedule__field">
            <label className="admin-reschedule__label">Elegí una fecha</label>
            <input
              type="date"
              className="admin-reschedule__date-input"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              disabled={saving}
            />
          </div>

          {date && (
            <div className="admin-reschedule__slots-section">
              <p className="admin-reschedule__label">Elegí un horario</p>
              {loadingSlots ? (
                <p className="admin-reschedule__empty">Cargando horarios...</p>
              ) : slots.length === 0 ? (
                <p className="admin-reschedule__empty">
                  No hay horarios disponibles para este día.
                </p>
              ) : (
                <div className="admin-reschedule__slots-grid">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`admin-reschedule__slot${
                        selectedSlot === slot
                          ? " admin-reschedule__slot--selected"
                          : ""
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                      disabled={saving}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <p className="admin-reschedule__error">{error}</p>}
        </div>

        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cerrar
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--reschedule"
            onClick={handleConfirm}
            disabled={!selectedSlot || saving}
          >
            {saving ? "Guardando..." : "Confirmar cambio"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RescheduleModal;
