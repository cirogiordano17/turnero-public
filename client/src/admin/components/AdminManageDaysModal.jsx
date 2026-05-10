import { useEffect, useState } from "react";
import { getClosedDays, blockDay, unblockDay } from "../api/admin.api";
import { getAvailability } from "../api/admin.api";

function AdminManageDaysModal({ onClose }) {
  const [date, setDate] = useState("");
  const [isClosed, setIsClosed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [slots, setSlots] = useState([]);
  const [from, setFrom] = useState("");
  const [duration, setDuration] = useState(30);

  const [blockedList, setBlockedList] = useState([]);
  const [closedDaysList, setClosedDaysList] = useState([]);

  const [confirmData, setConfirmData] = useState(null);

  // ========================
  // REFRESH FUNCTIONS
  // ========================

  async function refreshClosed() {
    if (!date) return;

    const data = await getClosedDays(date, date);
    setIsClosed(data.length > 0);
  }

  async function refreshBlocked() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/blocked-slots`,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("adminToken") ||
            sessionStorage.getItem("adminToken")
          }`,
        },
      }
    );

    const data = await res.json();

    setBlockedList(data);
  }

  async function refreshClosedDaysList() {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/closed-days/all`,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("adminToken") ||
            sessionStorage.getItem("adminToken")
          }`,
        },
      }
    );

    const data = await res.json();

    setClosedDaysList(data);
  }

  // ========================
  // EFFECTS
  // ========================

  useEffect(() => {
    if (!date) return;

    refreshClosed();
  }, [date]);

  useEffect(() => {
    refreshBlocked();
    refreshClosedDaysList();
  }, []);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }

    async function fetchSlots() {
      try {
        const data = await getAvailability(date, [1]);

        if (Array.isArray(data)) {
          setSlots(data);
        } else if (Array.isArray(data?.slots)) {
          setSlots(data.slots);
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error(err);
        setSlots([]);
      }
    }

    fetchSlots();
  }, [date]);

  // ========================
  // ACTIONS
  // ========================

  function handleToggleDay() {
    if (!date) return;

    setConfirmData({
      message: isClosed
        ? "¿Desbloquear este día?"
        : "¿Bloquear día completo?",
      onConfirm: async () => {
        try {
          setLoading(true);

          if (isClosed) {
            await unblockDay(date);
          } else {
            await blockDay(date, "Bloqueado por admin");
          }

          await refreshClosed();
          await refreshClosedDaysList();
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
    });
  }

  function handleDeleteClosedDay(closedDate) {
    setConfirmData({
      message: "¿Desbloquear este día?",
      onConfirm: async () => {
        try {
          await unblockDay(closedDate);

          await refreshClosedDaysList();

          if (closedDate === date) {
            await refreshClosed();
          }
        } catch (err) {
          console.error(err);
        }
      },
    });
  }

  function handleBlockSlot() {
    if (!date || !from) return;

    setConfirmData({
      message: "¿Bloquear este horario?",
      onConfirm: async () => {
        try {
          const start_at = `${date}T${from}:00-03:00`;

          const endDate = new Date(start_at);
          endDate.setMinutes(endDate.getMinutes() + duration);

          const end_at = endDate.toISOString();

          await fetch(
            `${import.meta.env.VITE_API_URL}/admin/blocked-slots`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  localStorage.getItem("adminToken") ||
                  sessionStorage.getItem("adminToken")
                }`,
              },
              body: JSON.stringify({
                start_at,
                end_at,
                reason: "Bloqueo admin",
              }),
            }
          );

          await refreshBlocked();
        } catch (err) {
          console.error(err);
        }
      },
    });
  }

  function handleDeleteBlocked(id) {
    setConfirmData({
      message: "¿Eliminar este bloqueo?",
      onConfirm: async () => {
        await fetch(
          `${import.meta.env.VITE_API_URL}/admin/blocked-slots/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("adminToken") ||
                sessionStorage.getItem("adminToken")
              }`,
            },
          }
        );

        await refreshBlocked();
      },
    });
  }

  // ========================
  // UI
  // ========================

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <h2>Administrar días</h2>

        {/* DIA */}
        <section>
          <h3>Bloquear día completo</h3>

          <div className="admin-modal__row">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              onClick={handleToggleDay}
              disabled={!date || loading}
              style={{
                background: isClosed ? "#16a34a" : "#dc2626",
                color: "white",
              }}
            >
              {isClosed ? "Desbloquear" : "Bloquear"}
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <h4>Días bloqueados</h4>

            {closedDaysList.length === 0 && (
              <p>No hay días bloqueados.</p>
            )}

            {closedDaysList.map((d) => (
              <div
                className="admin-blocked-row"
                key={d.closed_date}
              >
                <span> {d.closed_date.split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")
                }</span>

                <button
                  onClick={() =>
                    handleDeleteClosedDay(
                      d.closed_date.split("T")[0]
                    )
                  }
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* HORARIO */}
        <section>
          <h3>Bloquear horario</h3>

          <div className="admin-modal__row">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Desde</option>

              {(Array.isArray(slots) ? slots : []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value={30}>30 min</option>
              <option value={60}>1 hora</option>
              <option value={90}>1 hora y media</option>
              <option value={120}>2 horas</option>
              <option value={180}>3 horas</option>
              <option value={240}>4 horas</option>
            </select>

            <button onClick={handleBlockSlot}>
              Bloquear
            </button>
          </div>

          <div>
            <h4>Bloqueos</h4>

            {blockedList.length === 0 && (
              <p>No hay horarios bloqueados.</p>
            )}

            {blockedList.map((b) => {
              const startDate = new Date(b.start_at);

              const day = startDate.toLocaleDateString("es-AR");

              const start = startDate.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const end = new Date(b.end_at).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div className="admin-blocked-row" key={b.id}>
                  <span>
                    {day} — {start} → {end}
                  </span>

                  <button onClick={() => handleDeleteBlocked(b.id)}>
                    X
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <button onClick={onClose}>
          Cerrar
        </button>

        {confirmData && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal">
              <p>{confirmData.message}</p>

              <button
                onClick={async () => {
                  await confirmData.onConfirm();
                  setConfirmData(null);
                }}
              >
                Confirmar
              </button>

              <button onClick={() => setConfirmData(null)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManageDaysModal;