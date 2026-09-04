import { useEffect, useState } from "react";
import { Users, ChevronLeft, Phone, Mail, Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import {
  getAdminClients,
  getAdminClientAppointments,
  createAdminClient,
  updateAdminClient,
  deleteAdminClient,
} from "../api/admin.api";
import "../styles/admin-clients-modal.css";

const STATUS_LABEL = {
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  NO_SHOW: "No asistió",
  PENDIENTE_PAGO: "Pend. de pago",
  ASISTIDO: "Asistió",
};

const STATUS_CLASS = {
  CONFIRMADO: "acm-badge--confirmado",
  CANCELADO: "acm-badge--cancelado",
  NO_SHOW: "acm-badge--noshow",
  PENDIENTE_PAGO: "acm-badge--pendiente",
  ASISTIDO: "acm-badge--confirmado",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-AR", {
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

const EMPTY_FORM = { first_name: "", last_name: "", whatsapp: "", email: "", notes: "" };

function ClientForm({ initial = EMPTY_FORM, onSave, onCancel, loading, error }) {
  const [form, setForm] = useState(initial);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form className="acm__form" onSubmit={handleSubmit}>
      <div className="acm__form-row">
        <label className="acm__form-label">Nombre *</label>
        <input
          className="acm__form-input"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          placeholder="Nombre"
          required
        />
      </div>
      <div className="acm__form-row">
        <label className="acm__form-label">Apellido *</label>
        <input
          className="acm__form-input"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          placeholder="Apellido"
          required
        />
      </div>
      <div className="acm__form-row">
        <label className="acm__form-label">WhatsApp *</label>
        <input
          className="acm__form-input"
          value={form.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
          placeholder="Ej: 3512345678"
          required
        />
      </div>
      <div className="acm__form-row">
        <label className="acm__form-label">Email</label>
        <input
          className="acm__form-input"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="opcional"
        />
      </div>
      <div className="acm__form-row">
        <label className="acm__form-label">Notas</label>
        <textarea
          className="acm__form-input acm__form-textarea"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Notas internas..."
          rows={2}
        />
      </div>

      {error && <p className="acm__hint acm__hint--error">{error}</p>}

      <div className="acm__form-actions">
        <button type="button" className="acm__btn acm__btn--ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="acm__btn acm__btn--primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

function ClientDetail({ client, onBack, onUpdated, onDeleted }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAdminClientAppointments(client.id)
      .then(setAppointments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [client.id]);

  async function handleSave(form) {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateAdminClient(client.id, form);
      setEditing(false);
      onUpdated(updated);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAdminClient(client.id);
      onDeleted(client.id);
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="acm__detail">
        <div className="acm__detail-header">
          <button className="acm__back-btn" onClick={() => { setEditing(false); setSaveError(null); }}>
            <ChevronLeft size={16} /> Volver
          </button>
          <p className="acm__section-title">Editar cliente</p>
        </div>
        <ClientForm
          initial={{
            first_name: client.first_name,
            last_name: client.last_name,
            whatsapp: client.whatsapp,
            email: client.email || "",
            notes: client.notes || "",
          }}
          onSave={handleSave}
          onCancel={() => { setEditing(false); setSaveError(null); }}
          loading={saving}
          error={saveError}
        />
      </div>
    );
  }

  return (
    <div className="acm__detail">
      <div className="acm__detail-header">
        <button className="acm__back-btn" onClick={onBack}>
          <ChevronLeft size={16} /> Volver
        </button>
        <div className="acm__client-info">
          <div className="acm__client-avatar">
            {client.first_name[0]}{client.last_name[0]}
          </div>
          <div>
            <p className="acm__client-name">{client.first_name} {client.last_name}</p>
            <div className="acm__client-meta">
              <span><Phone size={12} /> {client.whatsapp}</span>
              <span><Mail size={12} /> {client.email || "—"}</span>
            </div>
          </div>
        </div>
        <div className="acm__detail-actions">
          <button className="acm__icon-btn acm__icon-btn--edit" onClick={() => setEditing(true)} title="Editar">
            <Pencil size={15} />
          </button>
          <button className="acm__icon-btn acm__icon-btn--delete" onClick={() => setConfirmDelete(true)} title="Eliminar">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {client.notes && (
        <div className="acm__notes">
          <span className="acm__notes-label">Notas:</span> {client.notes}
        </div>
      )}

      {confirmDelete && (
        <div className="acm__confirm-delete">
          <p>¿Eliminar a <strong>{client.first_name} {client.last_name}</strong>? El cliente dejará de aparecer en el sistema.</p>
          <div className="acm__form-actions">
            <button className="acm__btn acm__btn--ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
              Cancelar
            </button>
            <button className="acm__btn acm__btn--danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      )}

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
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setCreating(false);
    setSearch("");
    load();
  }, [open]);

  function load() {
    setLoading(true);
    setError(null);
    getAdminClients()
      .then(setClients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  async function handleCreate(form) {
    setSaving(true);
    setSaveError(null);
    try {
      const newClient = await createAdminClient(form);
      setClients((prev) => [...prev, newClient].sort((a, b) =>
        a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name)
      ));
      setCreating(false);
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleUpdated(updated) {
    setClients((prev) => prev.map((c) => c.id === updated.id ? { ...c, ...updated } : c));
    setSelected((prev) => ({ ...prev, ...updated }));
  }

  function handleDeleted(id) {
    setClients((prev) => prev.filter((c) => c.id !== id));
    setSelected(null);
  }

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

        {creating ? (
          <div className="acm__detail">
            <div className="acm__detail-header">
              <button className="acm__back-btn" onClick={() => { setCreating(false); setSaveError(null); }}>
                <ChevronLeft size={16} /> Volver
              </button>
              <p className="acm__section-title">Nuevo cliente</p>
            </div>
            <ClientForm
              onSave={handleCreate}
              onCancel={() => { setCreating(false); setSaveError(null); }}
              loading={saving}
              error={saveError}
            />
          </div>
        ) : selected ? (
          <ClientDetail
            client={selected}
            onBack={() => setSelected(null)}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
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
              <button
                className="acm__btn acm__btn--primary acm__btn--new"
                onClick={() => { setCreating(true); setSaveError(null); }}
              >
                <Plus size={15} /> Nuevo
              </button>
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
                    <span className="acm__client-row-email">{c.email || "—"}</span>
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
