import { useState } from "react";
import AdminSettingsMenu from "./AdminSettingsMenu";
import AdminManageDaysModal from "./AdminManageDaysModal";

function AdminHeader({ mode, setMode, onLogout, onManageServices, onManageClients, onManageTransfer, onMonthlyReport }) {
  const isHistory = mode === "history";
  const [showManageDays, setShowManageDays] = useState(false);

  return (
    <>
      <header
        className={`admin-header ${
          isHistory ? "admin-header--history" : "admin-header--upcoming"
        }`}
      >
        <div className="admin-header__top">
          <div>
            <h1 className="admin-header__title">Panel de Administración</h1>
            <p className="admin-header__subtitle">
              {isHistory ? "Consulta de turnos anteriores" : "Gestión de turnos"}
            </p>
          </div>

          <div className="admin-header__tools">
            <div
              className="admin-view-toggle"
              role="tablist"
              aria-label="Vista de turnos"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "upcoming"}
                className={`admin-view-toggle__btn ${
                  mode === "upcoming" ? "is-active" : ""
                }`}
                onClick={() => setMode("upcoming")}
              >
                Próximos
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === "history"}
                className={`admin-view-toggle__btn ${
                  mode === "history" ? "is-active" : ""
                }`}
                onClick={() => setMode("history")}
              >
                Historial
              </button>
            </div>

            <AdminSettingsMenu
              onManageServices={onManageServices}
              onManageDays={() => setShowManageDays(true)}
              onManageClients={onManageClients}
              onManageTransfer={onManageTransfer}
              onMonthlyReport={onMonthlyReport}
              onLogout={onLogout}
            />
          </div>
        </div>
      </header>

      {showManageDays && (
        <AdminManageDaysModal onClose={() => setShowManageDays(false)} />
      )}
    </>
  );
}

export default AdminHeader;