import { useEffect, useState, useMemo } from "react";
import {
  getClosedDays,
  getAllClosedDays,
  blockDay,
  unblockDay,
  getAllBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
  getWorkingHours,
  getAppointmentsByDate,
} from "../api/admin.api";

const TZ = "America/Argentina/Cordoba";

function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function makeSlots(startHHMM, endHHMM) {
  const [sh, sm] = startHHMM.split(":").map(Number);
  const [eh, em] = endHHMM.split(":").map(Number);
  const slots = [];
  let mins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  while (mins < endMins) {
    slots.push(
      `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`
    );
    mins += 30;
  }
  return slots;
}

function getIsoDow(dateStr) {
  const day = new Date(dateStr + "T12:00:00").getDay();
  return day === 0 ? 7 : day;
}

function formatDateLong(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

function formatDay(isoStr) {
  return new Date(isoStr).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: TZ,
  });
}

function durationLabel(startHHMM, endBlockHHMM) {
  const [sh, sm] = startHHMM.split(":").map(Number);
  const [eh, em] = endBlockHHMM.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 60) return `${mins} min`;
  if (mins % 60 === 0) return `${mins / 60}h`;
  return `${Math.floor(mins / 60)}h ${mins % 60}min`;
}

function AdminManageDaysModal({ onClose }) {
  const [tab, setTab] = useState("dias");

  // ── Días tab ──
  const [dayDate, setDayDate] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [closedDaysList, setClosedDaysList] = useState([]);
  const [dayLoading, setDayLoading] = useState(false);

  // ── Horarios tab ──
  const [slotDate, setSlotDate] = useState("");
  const [workingHours, setWorkingHours] = useState([]);
  const [blockedForDay, setBlockedForDay] = useState([]);
  const [allBlockedSlots, setAllBlockedSlots] = useState([]);
  const [appointmentsForDay, setAppointmentsForDay] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // ── Selección de rango ──
  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd] = useState(null);

  // ── Confirm dialog ──
  const [confirm, setConfirm] = useState(null);

  // ─────────────────────────────────────────
  // Carga inicial
  // ─────────────────────────────────────────

  useEffect(() => {
    refreshClosedDaysList();
    refreshAllBlockedSlots();
    loadWorkingHours();
  }, []);

  useEffect(() => {
    if (dayDate) refreshClosed();
    else setIsClosed(false);
  }, [dayDate]);

  useEffect(() => {
    setSelStart(null);
    setSelEnd(null);
    if (slotDate) refreshSlotData(slotDate);
    else {
      setBlockedForDay([]);
      setAppointmentsForDay([]);
    }
  }, [slotDate]);

  // ─────────────────────────────────────────
  // Data loaders
  // ─────────────────────────────────────────

  async function loadWorkingHours() {
    try {
      setWorkingHours(await getWorkingHours());
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshClosed() {
    try {
      const data = await getClosedDays(dayDate, dayDate);
      setIsClosed(data.length > 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshClosedDaysList() {
    try {
      setClosedDaysList(await getAllClosedDays());
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshAllBlockedSlots() {
    try {
      setAllBlockedSlots(await getAllBlockedSlots());
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshSlotData(date) {
    setSlotsLoading(true);
    try {
      const [blocked, appts] = await Promise.all([
        getAllBlockedSlots(date),
        getAppointmentsByDate(date),
      ]);
      setBlockedForDay(blocked);
      setAppointmentsForDay(appts);
    } catch (err) {
      console.error(err);
    } finally {
      setSlotsLoading(false);
    }
  }

  // ─────────────────────────────────────────
  // Working hours para slotDate
  // ─────────────────────────────────────────

  const todayWH = useMemo(() => {
    if (!slotDate || workingHours.length === 0) return null;
    const dow = getIsoDow(slotDate);
    return workingHours.find((wh) => wh.day_of_week === dow) || null;
  }, [slotDate, workingHours]);

  const isSlotDateFullyClosed = useMemo(
    () => closedDaysList.some((d) => d.closed_date.split("T")[0] === slotDate),
    [slotDate, closedDaysList]
  );

  const timeGrid = useMemo(() => {
    if (!todayWH) return [];
    const sections = [];
    const sm = todayWH.start_morning?.slice(0, 5);
    const em = todayWH.end_morning?.slice(0, 5);
    const sa = todayWH.start_afternoon?.slice(0, 5);
    const ea = todayWH.end_afternoon?.slice(0, 5);
    if (sm && em) sections.push({ label: `Mañana · ${sm}–${em}`, slots: makeSlots(sm, em) });
    if (sa && ea) sections.push({ label: `Tarde · ${sa}–${ea}`, slots: makeSlots(sa, ea) });
    return sections;
  }, [todayWH]);

  // ─────────────────────────────────────────
  // Estado de cada slot
  // ─────────────────────────────────────────

  function getSlotStatus(hhmm) {
    const s = new Date(`${slotDate}T${hhmm}:00-03:00`).getTime();
    const e = s + 30 * 60 * 1000;

    const block = blockedForDay.find(
      (b) => new Date(b.start_at).getTime() < e && new Date(b.end_at).getTime() > s
    );
    if (block) return { type: "blocked", id: block.id };

    const appt = appointmentsForDay.find(
      (a) => new Date(a.start_at).getTime() < e && new Date(a.end_at).getTime() > s
    );
    if (appt) return { type: "booked" };

    return { type: "free" };
  }

  function isInSelection(hhmm) {
    if (!selStart) return false;
    const end = selEnd || selStart;
    return hhmm >= selStart && hhmm <= end;
  }

  // ─────────────────────────────────────────
  // Handlers de slots
  // ─────────────────────────────────────────

  function handleSlotTap(hhmm, status) {
    if (status.type === "booked") return;

    if (status.type === "blocked") {
      setSelStart(null);
      setSelEnd(null);
      setConfirm({
        message: `¿Desbloquear el horario de las ${hhmm}?`,
        onConfirm: async () => {
          await deleteBlockedSlot(status.id);
          await Promise.all([refreshSlotData(slotDate), refreshAllBlockedSlots()]);
        },
      });
      return;
    }

    // Slot libre
    if (!selStart) {
      setSelStart(hhmm);
      setSelEnd(null);
      return;
    }

    if (hhmm < selStart) {
      setSelStart(hhmm);
      setSelEnd(null);
      return;
    }

    setSelEnd(hhmm);
  }

  function cancelSelection() {
    setSelStart(null);
    setSelEnd(null);
  }

  async function confirmBlock() {
    const end = selEnd || selStart;
    const start_at = `${slotDate}T${selStart}:00-03:00`;
    const endMs = new Date(`${slotDate}T${end}:00-03:00`).getTime() + 30 * 60 * 1000;
    const end_at = new Date(endMs).toISOString();

    cancelSelection();
    await createBlockedSlot({ start_at, end_at, reason: "Bloqueo admin" });
    await Promise.all([refreshSlotData(slotDate), refreshAllBlockedSlots()]);
  }

  // ─────────────────────────────────────────
  // Handlers de días
  // ─────────────────────────────────────────

  function handleToggleDay() {
    if (!dayDate) return;
    setConfirm({
      message: isClosed
        ? `¿Habilitar el día ${formatDateLong(dayDate)}?`
        : `¿Bloquear el día completo ${formatDateLong(dayDate)}?`,
      onConfirm: async () => {
        setDayLoading(true);
        try {
          if (isClosed) await unblockDay(dayDate);
          else await blockDay(dayDate, "Bloqueado por admin");
          await refreshClosed();
          await refreshClosedDaysList();
        } finally {
          setDayLoading(false);
        }
      },
    });
  }

  function handleDeleteClosedDay(dateStr) {
    setConfirm({
      message: `¿Habilitar el día ${formatDateLong(dateStr)}?`,
      onConfirm: async () => {
        await unblockDay(dateStr);
        await refreshClosedDaysList();
        if (dateStr === dayDate) await refreshClosed();
      },
    });
  }

  function handleDeleteBlockedSlot(slot) {
    setConfirm({
      message: `¿Eliminar el bloqueo del ${formatDay(slot.start_at)} · ${formatTime(slot.start_at)}–${formatTime(slot.end_at)}?`,
      onConfirm: async () => {
        await deleteBlockedSlot(slot.id);
        await Promise.all([
          refreshAllBlockedSlots(),
          slotDate ? refreshSlotData(slotDate) : Promise.resolve(),
        ]);
      },
    });
  }

  // ─────────────────────────────────────────
  // Etiqueta de la barra de confirmación
  // ─────────────────────────────────────────

  const blockEnd = selEnd ? addMinutes(selEnd, 30) : selStart ? addMinutes(selStart, 30) : null;
  const confirmBarLabel = selStart
    ? `${selStart} → ${blockEnd}  ·  ${durationLabel(selStart, blockEnd)}`
    : null;

  const now = new Date();
  const futureBlocked = allBlockedSlots.filter((b) => new Date(b.end_at) > now);

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <div
      className="admin-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mdm">
        {/* Header */}
        <div className="mdm__header">
          <h2 className="mdm__title">Gestión de agenda</h2>
          <button className="mdm__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="mdm__tabs">
          <button
            className={`mdm__tab ${tab === "dias" ? "mdm__tab--active" : ""}`}
            onClick={() => setTab("dias")}
          >
            Días
          </button>
          <button
            className={`mdm__tab ${tab === "horarios" ? "mdm__tab--active" : ""}`}
            onClick={() => setTab("horarios")}
          >
            Horarios
          </button>
        </div>

        {/* ══════ TAB DÍAS ══════ */}
        {tab === "dias" && (
          <div className="mdm__content">
            <div className="mdm__field">
              <label className="mdm__label">Seleccionar fecha</label>
              <input
                type="date"
                className="mdm__input"
                value={dayDate}
                onChange={(e) => setDayDate(e.target.value)}
              />
            </div>

            {dayDate && (
              <div className="mdm__day-row">
                <span
                  className={`mdm__status-badge ${
                    isClosed ? "mdm__status-badge--closed" : "mdm__status-badge--open"
                  }`}
                >
                  {isClosed ? "Bloqueado" : "Disponible"}
                </span>
                <button
                  className={`mdm__action-btn ${
                    isClosed ? "mdm__action-btn--green" : "mdm__action-btn--red"
                  }`}
                  onClick={handleToggleDay}
                  disabled={dayLoading}
                >
                  {dayLoading ? "..." : isClosed ? "Habilitar día" : "Bloquear día"}
                </button>
              </div>
            )}

            <div className="mdm__section">
              <h3 className="mdm__section-title">Días bloqueados</h3>
              {closedDaysList.length === 0 ? (
                <p className="mdm__empty">No hay días bloqueados.</p>
              ) : (
                <ul className="mdm__list">
                  {closedDaysList.map((d) => {
                    const ds = d.closed_date.split("T")[0];
                    return (
                      <li className="mdm__list-item" key={ds}>
                        <span className="mdm__list-item-text">
                          {new Date(ds + "T12:00:00").toLocaleDateString("es-AR", {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                        <button
                          className="mdm__unblock-btn"
                          onClick={() => handleDeleteClosedDay(ds)}
                        >
                          Habilitar
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ══════ TAB HORARIOS ══════ */}
        {tab === "horarios" && (
          <div className="mdm__content">
            <div className="mdm__field">
              <label className="mdm__label">Seleccionar fecha</label>
              <input
                type="date"
                className="mdm__input"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
              />
            </div>

            {!slotDate && (
              <p className="mdm__hint">Elegí una fecha para ver y gestionar los horarios.</p>
            )}

            {slotDate && slotsLoading && (
              <p className="mdm__hint">Cargando horarios...</p>
            )}

            {slotDate && !slotsLoading && isSlotDateFullyClosed && (
              <div className="mdm__notice mdm__notice--warn">
                <span>⚠️</span>
                <p>
                  Este día está bloqueado por completo. Para gestionar horarios
                  individuales, habilitá el día primero en la pestaña "Días".
                </p>
              </div>
            )}

            {slotDate && !slotsLoading && !isSlotDateFullyClosed && !todayWH && (
              <div className="mdm__notice">
                <span>⛔</span>
                <p>La peluquería no trabaja este día.</p>
              </div>
            )}

            {slotDate && !slotsLoading && !isSlotDateFullyClosed && todayWH && (
              <>
                <p className="mdm__date-heading">{formatDateLong(slotDate)}</p>

                <div className="mdm__legend">
                  <span className="mdm__legend-chip mdm__legend-chip--free">Libre</span>
                  <span className="mdm__legend-chip mdm__legend-chip--sel">Seleccionado</span>
                  <span className="mdm__legend-chip mdm__legend-chip--blocked">Bloqueado</span>
                  <span className="mdm__legend-chip mdm__legend-chip--booked">Con turno</span>
                </div>

                <p className="mdm__grid-hint">
                  Tocá un slot para iniciar la selección, tocá otro para extenderla.
                </p>

                {timeGrid.map((section) => (
                  <div className="mdm__time-section" key={section.label}>
                    <h4 className="mdm__time-label">{section.label}</h4>
                    <div className="mdm__time-grid">
                      {section.slots.map((hhmm) => {
                        const status = getSlotStatus(hhmm);
                        const inSel = isInSelection(hhmm);
                        const chipState = inSel ? "sel" : status.type;
                        return (
                          <button
                            key={hhmm}
                            className={`mdm__slot mdm__slot--${chipState}`}
                            onClick={() => handleSlotTap(hhmm, status)}
                            disabled={status.type === "booked"}
                            title={
                              status.type === "booked"
                                ? "Turno existente"
                                : status.type === "blocked"
                                ? "Clic para desbloquear"
                                : "Clic para seleccionar"
                            }
                          >
                            {hhmm}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              </>
            )}

            {/* Lista global de bloqueos activos */}
            <div className="mdm__section" style={{ marginTop: 28 }}>
              <h3 className="mdm__section-title">
                Bloqueos activos{futureBlocked.length > 0 ? ` (${futureBlocked.length})` : ""}
              </h3>
              {futureBlocked.length === 0 ? (
                <p className="mdm__empty">No hay horarios bloqueados.</p>
              ) : (
                <ul className="mdm__list">
                  {futureBlocked.map((b) => (
                    <li className="mdm__list-item" key={b.id}>
                      <span className="mdm__list-item-text">
                        {formatDay(b.start_at)} · {formatTime(b.start_at)}–{formatTime(b.end_at)}
                      </span>
                      <button
                        className="mdm__unblock-btn"
                        onClick={() => handleDeleteBlockedSlot(b)}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Barra de confirmación de bloqueo (fuera del scroll) */}
        {tab === "horarios" && selStart && (
          <div className="mdm__confirm-bar">
            <span className="mdm__confirm-bar-label">
              Bloquear {confirmBarLabel}
            </span>
            <div className="mdm__confirm-bar-actions">
              <button className="mdm__confirm-bar-cancel" onClick={cancelSelection}>
                Cancelar
              </button>
              <button className="mdm__confirm-bar-ok" onClick={confirmBlock}>
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* ══════ CONFIRM DIALOG ══════ */}
        {confirm && (
          <div className="admin-modal-backdrop">
            <div className="mdm__dialog">
              <p className="mdm__dialog-msg">{confirm.message}</p>
              <div className="mdm__dialog-actions">
                <button
                  className="mdm__action-btn mdm__action-btn--primary"
                  onClick={async () => {
                    await confirm.onConfirm();
                    setConfirm(null);
                  }}
                >
                  Confirmar
                </button>
                <button
                  className="mdm__action-btn mdm__action-btn--ghost"
                  onClick={() => setConfirm(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManageDaysModal;
