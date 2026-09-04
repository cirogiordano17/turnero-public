import { Menu, Search } from "lucide-react";

function AdminHeader({ mode, onToggleSidebar }) {
  const isHistory = mode === "history";

  return (
    <header
      className={`admin-header ${
        isHistory ? "admin-header--history" : "admin-header--upcoming"
      }`}
    >
      <div className="admin-header__top">
        <button
          type="button"
          className="admin-header__menu-btn"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        <div className="admin-header__titles">
          <h1 className="admin-header__title">Panel de Administración</h1>
          <p className="admin-header__subtitle">
            {isHistory ? "Consulta de turnos anteriores" : "Gestión de turnos"}
          </p>
        </div>

        <div className="admin-header__search">
          <Search size={16} strokeWidth={2.2} />
          <input type="search" placeholder="Buscar..." aria-label="Buscar" />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
