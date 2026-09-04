import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";

function AdminSettingsMenu({ onManageServices, onManageDays, onManageClients, onManageTransfer, onManageProducts, onMonthlyReport, onLogout, userRole }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-settings" ref={rootRef}>
      <button
        type="button"
        className="admin-settings__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir ajustes"
      >
        <Settings size={18} strokeWidth={2.2} />
      </button>

      {open && (
        <div className="admin-settings__menu">
          <button
            type="button"
            className="admin-settings__item"
            onClick={() => {
              setOpen(false);
              onManageServices?.();
            }}
          >
            Gestionar servicios
          </button>

          <button
            type="button"
            className="admin-settings__item"
            onClick={() => {
              setOpen(false);
              onManageDays?.();
            }}
          >
            Administrar días
          </button>

          <button
            type="button"
            className="admin-settings__item"
            onClick={() => {
              setOpen(false);
              onManageClients?.();
            }}
          >
            Clientes
          </button>

          <button
            type="button"
            className="admin-settings__item"
            onClick={() => {
              setOpen(false);
              onMonthlyReport?.();
            }}
          >
            Resumen mensual
          </button>

          <button
            type="button"
            className="admin-settings__item"
            onClick={() => {
              setOpen(false);
              onManageTransfer?.();
            }}
          >
            Datos de transferencia
          </button>

          {userRole === "super_admin" && (
            <button
              type="button"
              className="admin-settings__item"
              onClick={() => {
                setOpen(false);
                onManageProducts?.();
              }}
            >
              Gestionar productos
            </button>
          )}

          <button
            type="button"
            className="admin-settings__item admin-settings__item--danger"
            onClick={() => {
              setOpen(false);
              onLogout?.();
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminSettingsMenu;