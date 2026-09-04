import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { getTransferSettings, updateTransferSettings } from "../api/admin.api";
import "../styles/admin-modal.css";

function AdminTransferModal({ open, onClose }) {
  const [form, setForm] = useState({
    transfer_cvu: "",
    transfer_alias: "",
    transfer_cuit: "",
    transfer_holder_name: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSuccess(false);
    setError(null);
    setLoading(true);
    getTransferSettings()
      .then((data) => setForm({
        transfer_cvu: data.transfer_cvu || "",
        transfer_alias: data.transfer_alias || "",
        transfer_cuit: data.transfer_cuit || "",
        transfer_holder_name: data.transfer_holder_name || "",
        whatsapp: data.whatsapp || "",
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateTransferSettings(form);
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div className="admin-modal__header-left">
            <CreditCard size={18} strokeWidth={2.2} />
            <h2 className="admin-modal__title">Datos de transferencia</h2>
          </div>
          <button className="admin-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-modal__body">
          {loading ? (
            <p className="admin-modal__hint">Cargando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="admin-modal__form">
              <div className="admin-modal__field">
                <label className="admin-modal__label">CVU</label>
                <input
                  className="admin-modal__input"
                  value={form.transfer_cvu}
                  onChange={(e) => set("transfer_cvu", e.target.value)}
                  placeholder="CVU de la cuenta"
                />
              </div>
              <div className="admin-modal__field">
                <label className="admin-modal__label">Alias</label>
                <input
                  className="admin-modal__input"
                  value={form.transfer_alias}
                  onChange={(e) => set("transfer_alias", e.target.value)}
                  placeholder="Alias de la cuenta"
                />
              </div>
              <div className="admin-modal__field">
                <label className="admin-modal__label">CUIT</label>
                <input
                  className="admin-modal__input"
                  value={form.transfer_cuit}
                  onChange={(e) => set("transfer_cuit", e.target.value)}
                  placeholder="CUIT del titular"
                />
              </div>
              <div className="admin-modal__field">
                <label className="admin-modal__label">Nombre del titular</label>
                <input
                  className="admin-modal__input"
                  value={form.transfer_holder_name}
                  onChange={(e) => set("transfer_holder_name", e.target.value)}
                  placeholder="Nombre y apellido"
                />
              </div>
              <div className="admin-modal__field">
                <label className="admin-modal__label">WhatsApp para comprobantes (sin + ni espacios)</label>
                <input
                  className="admin-modal__input"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="Ej: 5493512345678"
                />
              </div>

              {error && <p className="admin-modal__error">{error}</p>}
              {success && <p className="admin-modal__success">Guardado correctamente.</p>}

              <div className="admin-modal__actions">
                <button type="button" className="admin-modal__btn admin-modal__btn--ghost" onClick={onClose}>
                  Cerrar
                </button>
                <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTransferModal;
