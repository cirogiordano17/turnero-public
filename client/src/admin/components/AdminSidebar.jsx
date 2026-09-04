import { useState } from "react";
import {
  CalendarClock,
  History,
  Sparkles,
  CalendarOff,
  Users,
  BarChart3,
  CreditCard,
  Package,
  LogOut,
} from "lucide-react";
import AdminManageDaysModal from "./AdminManageDaysModal";

function getInitial(username) {
  return username?.trim()?.[0]?.toUpperCase() || "?";
}

function AdminSidebar({
  admin,
  mode,
  setMode,
  onLogout,
  onManageServices,
  onManageClients,
  onManageTransfer,
  onManageProducts,
  onMonthlyReport,
}) {
  const [showManageDays, setShowManageDays] = useState(false);
  const userRole = admin?.userRole;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__user">
        <div className="admin-sidebar__avatar">{getInitial(admin?.username)}</div>
        <p className="admin-sidebar__username">{admin?.username}</p>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Navegación admin">
        <button
          type="button"
          className={`admin-sidebar__item${mode === "upcoming" ? " admin-sidebar__item--active" : ""}`}
          onClick={() => setMode("upcoming")}
        >
          <CalendarClock size={18} strokeWidth={2.2} />
          <span>Próximos</span>
        </button>

        <button
          type="button"
          className={`admin-sidebar__item${mode === "history" ? " admin-sidebar__item--active" : ""}`}
          onClick={() => setMode("history")}
        >
          <History size={18} strokeWidth={2.2} />
          <span>Historial</span>
        </button>

        <div className="admin-sidebar__divider" />

        <button type="button" className="admin-sidebar__item" onClick={onManageServices}>
          <Sparkles size={18} strokeWidth={2.2} />
          <span>Servicios</span>
        </button>

        <button type="button" className="admin-sidebar__item" onClick={() => setShowManageDays(true)}>
          <CalendarOff size={18} strokeWidth={2.2} />
          <span>Administrar días</span>
        </button>

        <button type="button" className="admin-sidebar__item" onClick={onManageClients}>
          <Users size={18} strokeWidth={2.2} />
          <span>Clientes</span>
        </button>

        <button type="button" className="admin-sidebar__item" onClick={onMonthlyReport}>
          <BarChart3 size={18} strokeWidth={2.2} />
          <span>Resumen mensual</span>
        </button>

        <button type="button" className="admin-sidebar__item" onClick={onManageTransfer}>
          <CreditCard size={18} strokeWidth={2.2} />
          <span>Datos de transferencia</span>
        </button>

        {userRole === "super_admin" && (
          <button type="button" className="admin-sidebar__item" onClick={onManageProducts}>
            <Package size={18} strokeWidth={2.2} />
            <span>Gestionar productos</span>
          </button>
        )}
      </nav>

      <button
        type="button"
        className="admin-sidebar__item admin-sidebar__item--logout"
        onClick={onLogout}
      >
        <LogOut size={18} strokeWidth={2.2} />
        <span>Cerrar sesión</span>
      </button>

      {showManageDays && (
        <AdminManageDaysModal onClose={() => setShowManageDays(false)} />
      )}
    </aside>
  );
}

export default AdminSidebar;
