import { useEffect, useState } from "react";
import { Users, ChevronLeft, Phone, Mail, Calendar } from "lucide-react";
import { getAdminClients, getAdminClientAppointments } from "../api/admin.api";
import "../styles/admin-clients-modal.css";

const STATUS_LABEL = {
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  NO_SHOW: "No asistió",
  PENDIENTE_PAGO: "Pend. de pago",
};

const STATUS_CLASS = {
  CONFIRMADO: "acm-badge--confirmado",
  CANCELADO: "acm-badge--cancelado",
  NO_SHOW: "acm-badge--noshow",
  PENDIENTE_PAGO: "acm-badge--pendiente",
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Argentina/Cordoba",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Cordoba",
  });
}

function ClientDetail({ client, onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAdminClientAppointments(client.id)
      .then(setAppointments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [client.id]);

  return (
    <div className="acm__detail">
      <div className="acm__detail-header">
        <button className="acm__back-btn" onClick={onBack}>
          <ChevronLeft size={16} />
          Volver
        </button>
        <div className="acm__client-info">
          <div className="acm__client-avatar">
            {client.first_name[0]}{client.last_name[0]}
          </div>
          <div>
            <p className="acm__client-name">
              {client.first_name} {client.last_name}
            </p>
            <div className="acm__client-meta">
              <span><Phone size={12} /> {client.whatsapp}</span>
              <span><Mail size={12} /> {client.email || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="acm__appointments-header">
        <Calendar size={15} />
        <span>Historial de turnos</span>
        {!loading && !error && (
          <span className="acm__appointments-count">{appointments.length}</span>
        )}
      </div>

      <div className="acm__appointments-list">
        {loading && <p className="acm__hint">Cargando turnos...</p>}
        {error && <p className="acm__hint acm__hint--error">{error}</p>}
        {!loading && !error && appointments.length === 0 && (
          <p className="acm__hint">Este cliente no tiene turnos registrados.</p>
        )}
        {!loading && !error && appointments.map((appt) => (
          <div key={appt.id} className="acm__appt-card">
            <div className="acm__appt-top">
              <div className="acm__appt-date">
                <span className="acm__appt-day">{formatDate(appt.start_at)}</span>
                <span className="acm__appt-time">
                  {formatTime(appt.start_at)} — {formatTime(appt.end_at)}
                </span>
              </div>
              <span className={`acm__badge ${STATUS_CLASS[appt.status]}`}>
                {STATUS_LABEL[appt.status] ?? appt.status}
              </span>
            </div>

            <div className="acm__appt-services">
              {appt.services.length > 0
                ? appt.services.map((s) => s.name).join(" + ")
                : <span className="acm__appt-no-services">Sin servicios</span>
              }
            </div>

            <div className="acm__appt-bottom">
              <span className="acm__appt-meta">{appt.duration_total} min</span>
              <span className="acm__appt-price">
                ${Number(appt.price_total).toLocaleString("es-AR")}
              </span>
            </div>

            {appt.comment && (
              <p className="acm__appt-comment">{appt.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminClientsModal({ open, onClose }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setSearch("");
    setLoading(true);
    setError(null);
    getAdminClients()
      .then(setClients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.whatsapp.includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="acm-overlay" onClick={onClose}>
      <div className="acm" onClick={(e) => e.stopPropagation()}>
        <div className="acm__header">
          <div className="acm__header-left">
            <Users size={18} strokeWidth={2.2} />
            <h2 className="acm__title">Clientes</h2>
          </div>
          <button className="acm__close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {selected ? (
          <ClientDetail
            client={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <div className="acm__list-view">
            <div className="acm__search-wrap">
              <input
                className="acm__search"
                type="text"
                placeholder="Buscar por nombre, teléfono o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading && <p className="acm__hint">Cargando clientes...</p>}
            {error && <p className="acm__hint acm__hint--error">{error}</p>}

            {!loading && !error && filtered.length === 0 && (
              <p className="acm__hint">
                {search ? "Sin resultados." : "No hay clientes registrados."}
              </p>
            )}

            {!loading && !error && filtered.length > 0 && (
              <ul className="acm__client-list">
                {filtered.map((c) => (
                  <li
                    key={c.id}
                    className="acm__client-row"
                    onClick={() => setSelected(c)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(c)}
                  >
                    <div className="acm__client-avatar acm__client-avatar--sm">
                      {c.first_name[0]}{c.last_name[0]}
                    </div>
                    <div className="acm__client-row-info">
                      <span className="acm__client-row-name">
                        {c.last_name}, {c.first_name}
                      </span>
                      <span className="acm__client-row-phone">{c.whatsapp}</span>
                    </div>
                    <span className="acm__client-row-email">
                      {c.email || "—"}
                    </span>
                    <ChevronLeft size={16} className="acm__client-row-arrow" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminClientsModal;
