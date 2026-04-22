import { useEffect, useMemo, useState } from "react";
import {
  createAdminService,
  getAdminServices,
  updateAdminService,
} from "../api/admin.api";
import AdminConfirmModal from "./AdminConfirmModal";

const EMPTY_FORM = {
  name: "",
  description: "",
  duration_min: 30,
  price: 0,
  category: "pelu",
};

function AdminServicesModal({ open, onClose }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [confirmState, setConfirmState] = useState({
    open: false,
    nextActive: null,
    service: null,
  });

  const title = useMemo(
    () => (editingId ? "Editar servicio" : "Nuevo servicio"),
    [editingId]
  );

  useEffect(() => {
    if (!open) return;
    loadServices();
  }, [open]);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setEditingService(null);
  }

  function handleEdit(service) {
    setEditingId(service.id);
    setEditingService(service);
    setForm({
      name: service.name || "",
      description: service.description || "",
      duration_min: service.duration_min || 30,
      price: service.price || 0,
      category: service.category || "pelu",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name,
        description: form.description,
        duration_min: Number(form.duration_min),
        price: Number(form.price),
        category: form.category,
      };

      if (editingId) {
        await updateAdminService(editingId, {
          ...payload,
          active: !!editingService?.active,
        });
      } else {
        await createAdminService({
          ...payload,
          active: true,
        });
      }

      resetForm();
      await loadServices();
    } catch (err) {
      setError(err.message || "No se pudo guardar el servicio");
    } finally {
      setSaving(false);
    }
  }

  function openToggleActiveModal(service) {
    setConfirmState({
      open: true,
      nextActive: !service.active,
      service,
    });
  }

  function closeToggleActiveModal() {
    if (saving) return;
    setConfirmState({
      open: false,
      nextActive: null,
      service: null,
    });
  }

  async function handleConfirmToggleActive() {
    const service = confirmState.service;
    if (!service) return;

    try {
      setSaving(true);
      setError("");

      const updated = await updateAdminService(service.id, {
        name: service.id === editingId ? form.name : service.name,
        description:
          service.id === editingId ? form.description : service.description,
        duration_min:
          service.id === editingId
            ? Number(form.duration_min)
            : Number(service.duration_min),
        price:
          service.id === editingId
            ? Number(form.price)
            : Number(service.price),
        category: service.id === editingId ? form.category : service.category,
        active: confirmState.nextActive,
      });

      if (editingId === service.id) {
        setEditingService(updated);
      }

      closeToggleActiveModal();
      await loadServices();
    } catch (err) {
      setError(err.message || "No se pudo actualizar el estado del servicio");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const toggleModalTitle = confirmState.nextActive
    ? "Activar servicio"
    : "Desactivar servicio";

  const toggleModalMessage = confirmState.service
    ? confirmState.nextActive
      ? `¿Seguro que querés activar el servicio "${confirmState.service.name}"?`
      : `¿Seguro que querés desactivar el servicio "${confirmState.service.name}"?`
    : "";

  const toggleModalConfirmText = confirmState.nextActive
    ? "Sí, activar"
    : "Sí, desactivar";

  return (
    <>
      <div className="admin-modal-backdrop" onClick={onClose}>
        <div
          className="admin-modal admin-modal--services"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="admin-modal__header">
            <h3 className="admin-modal__title">Gestionar servicios</h3>
          </div>

          <div className="admin-modal__body admin-services-manager">
            <div className="admin-services-manager__grid">
              <section className="admin-services-manager__list">
                <div className="admin-services-manager__list-head">
                  <strong>Servicios</strong>
                </div>

                {loading ? (
                  <div className="admin-empty">Cargando servicios...</div>
                ) : services.length === 0 ? (
                  <div className="admin-empty">No hay servicios cargados.</div>
                ) : (
                  <div className="admin-services-items">
                    {services.map((service) => (
                      <article
                        key={service.id}
                        className={`admin-services-item ${
                          editingId === service.id ? "is-selected" : ""
                        } ${service.active ? "" : "is-inactive"}`}
                      >
                        <div className="admin-services-item__top">
                          <div>
                            <div className="admin-services-item__name">
                              {service.name}
                            </div>
                            <div className="admin-services-item__meta">
                              {service.category} · {service.duration_min} min · $
                              {Number(service.price || 0).toLocaleString("es-AR")}
                            </div>
                          </div>
                        </div>

                        {service.description && (
                          <p className="admin-services-item__description">
                            {service.description}
                          </p>
                        )}

                        <div className="admin-services-item__actions">
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            onClick={() => handleEdit(service)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className={`admin-btn ${
                              service.active
                                ? "admin-btn--cancel"
                                : "admin-btn--confirm"
                            }`}
                            onClick={() => openToggleActiveModal(service)}
                          >
                            {service.active ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="admin-services-manager__form">
                <div className="admin-services-manager__form-head">
                  <strong>{title}</strong>
                </div>

                <form className="admin-services-form" onSubmit={handleSubmit}>
                  <label className="admin-login__field">
                    <span>Nombre</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </label>

                  <label className="admin-login__field">
                    <span>Descripción</span>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="admin-login__field">
                    <span>Duración (min)</span>
                    <input
                      type="number"
                      min="1"
                      value={form.duration_min}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          duration_min: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="admin-login__field">
                    <span>Precio</span>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, price: e.target.value }))
                      }
                    />
                  </label>

                  <label className="admin-login__field">
                    <span>Categoría</span>
                    <select
                      className="admin-services-form__select"
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, category: e.target.value }))
                      }
                    >
                      <option value="pelu">pelu</option>
                      <option value="akashicos">akashicos</option>
                    </select>
                  </label>

                  {error ? <div className="admin-login__error">{error}</div> : null}

                  <div className="admin-modal__actions admin-modal__actions--services">
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={editingId ? resetForm : onClose}
                      disabled={saving}
                    >
                      {editingId ? "Cancelar edición" : "Cerrar"}
                    </button>

                    <button
                      type="submit"
                      className="admin-btn admin-btn--confirm"
                      disabled={saving}
                    >
                      {saving
                        ? "Guardando..."
                        : editingId
                        ? "Guardar cambios"
                        : "Crear servicio"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>

      <AdminConfirmModal
        open={confirmState.open}
        title={toggleModalTitle}
        message={toggleModalMessage}
        confirmText={toggleModalConfirmText}
        confirmVariant={confirmState.nextActive ? "success" : "danger"}
        loading={saving}
        onCancel={closeToggleActiveModal}
        onConfirm={handleConfirmToggleActive}
      />
    </>
  );
}

export default AdminServicesModal;