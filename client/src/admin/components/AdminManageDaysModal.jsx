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

  // 🔥 NUEVO: modal confirm
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
    if (!date) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/blocked-slots?date=${date}`,
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

  // ========================
  // EFFECTS
  // ========================

  useEffect(() => {
    refreshClosed();
  }, [date]);

  useEffect(() => {
    if (!date) return;

    async function fetchSlots() {
      const data = await getAvailability(date, [1]);
      setSlots(data);
    }

    fetchSlots();
  }, [date]);

  useEffect(() => {
    refreshBlocked();
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

          await refreshClosed(); // 🔥 FIX
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
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

          await refreshBlocked(); // 🔥 FIX
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

        await refreshBlocked(); // 🔥 FIX
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

            <button onClick={handleBlockSlot}>Bloquear</button>
          </div>

          {/* LISTADO */}
          <div>
            <h4>Bloqueos</h4>

            {blockedList.map((b) => {
              const start = new Date(b.start_at).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const end = new Date(b.end_at).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div className="admin-blocked-row" key={b.id}>
                  <span>{start} → {end}</span>

                  <button onClick={() => handleDeleteBlocked(b.id)}>
                    X
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <button onClick={onClose}>Cerrar</button>

        {/* 🔥 MODAL CONFIRM */}
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