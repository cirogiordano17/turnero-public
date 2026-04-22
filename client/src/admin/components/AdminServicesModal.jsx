import { useEffect, useState } from "react";
import {
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

  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState(EMPTY_FORM);
  const [editingService, setEditingService] = useState(null);

  const [confirmState, setConfirmState] = useState({
    open: false,
    nextActive: null,
    service: null,
  });

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

  function cancelEdit() {
    setEditingId(null);
    setEditingService(null);
    setEditingForm(EMPTY_FORM);
  }

  function handleEdit(service) {
    setEditingId(service.id);
    setEditingService(service);
    setEditingForm({
      name: service.name ?? "",
      description: service.description ?? "",
      duration_min: service.duration_min ?? 30,
      price: service.price ?? 0,
      category: service.category ?? "pelu",
    });
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editingId || !editingService) return;

    try {
      setSaving(true);
      setError("");

      await updateAdminService(editingId, {
        name: editingForm.name,
        description: editingForm.description,
        duration_min: Number(editingForm.duration_min),
        price: Number(editingForm.price),
        category: editingForm.category,
        active: !!editingService.active,
      });

      cancelEdit();
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

      const payload =
        service.id === editingId
          ? {
              name: editingForm.name,
              description: editingForm.description,
              duration_min: Number(editingForm.duration_min),
              price: Number(editingForm.price),
              category: editingForm.category,
              active: confirmState.nextActive,
            }
          : {
              name: service.name,
              description: service.description,
              duration_min: Number(service.duration_min),
              price: Number(service.price),
              category: service.category,
              active: confirmState.nextActive,
            };

      await updateAdminService(service.id, payload);

      if (editingId === service.id) {
        cancelEdit();
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
          <div className="admin-modal__header admin-modal__header--with-close">
            <h3 className="admin-modal__title">Gestionar servicios</h3>

            <button
                type="button"
                className="admin-modal__close"
                onClick={onClose}
                aria-label="Cerrar modal"
            >
                ×
            </button>
          </div>

          <div className="admin-modal__body admin-services-manager">
            {error ? <div className="admin-login__error">{error}</div> : null}

            <div className="admin-services-manager__list-head">
              <strong>Servicios</strong>
            </div>

            {loading ? (
              <div className="admin-empty">Cargando servicios...</div>
            ) : services.length === 0 ? (
              <div className="admin-empty">No hay servicios cargados.</div>
            ) : (
              <div className="admin-services-items">
                {services.map((service) => {
                  const isEditing = editingId === service.id;

                  return (
                    <article
                      key={service.id}
                      className={`admin-services-item ${
                        isEditing ? "is-selected" : ""
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
                          {isEditing ? "Editando..." : "Editar"}
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

                      {isEditing && (
                        <form
                          className="admin-services-inline-form"
                          onSubmit={handleEditSubmit}
                        >
                          <label className="admin-login__field">
                            <span>Nombre</span>
                            <input
                              type="text"
                              value={editingForm.name}
                              onChange={(e) =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </label>

                          <label className="admin-login__field">
                            <span>Descripción</span>
                            <input
                              type="text"
                              value={editingForm.description}
                              onChange={(e) =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                            />
                          </label>

                          <div className="admin-services-inline-form__grid">
                            <label className="admin-login__field">
                              <span>Duración (min)</span>
                              <input
                                type="number"
                                min="1"
                                value={editingForm.duration_min}
                                onChange={(e) =>
                                  setEditingForm((prev) => ({
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
                                value={editingForm.price}
                                onChange={(e) =>
                                  setEditingForm((prev) => ({
                                    ...prev,
                                    price: e.target.value,
                                  }))
                                }
                              />
                            </label>
                          </div>

                          <label className="admin-login__field">
                            <span>Categoría</span>
                            <select
                              className="admin-services-form__select"
                              value={editingForm.category}
                              onChange={(e) =>
                                setEditingForm((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                }))
                              }
                            >
                              <option value="pelu">pelu</option>
                              <option value="akashicos">akashicos</option>
                            </select>
                          </label>

                          <div className="admin-services-inline-form__actions">
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Cancelar edición
                            </button>

                            <button
                              type="submit"
                              className="admin-btn admin-btn--confirm"
                              disabled={saving}
                            >
                              {saving ? "Guardando..." : "Guardar cambios"}
                            </button>
                          </div>
                        </form>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
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