function AdminConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Volver",
  confirmVariant = "danger",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">{title}</h3>
        </div>

        <div className="admin-modal__body">
          <p className="admin-modal__message">{message}</p>
        </div>

        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`admin-btn ${
              confirmVariant === "success"
                ? "admin-btn--confirm"
                : "admin-btn--cancel"
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminConfirmModal;