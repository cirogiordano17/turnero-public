function AdminHeader({ mode, setMode, onLogout }) {
  return (
    <div className="admin-header">
      <div className="admin-header__top">
        <div>
          <h1 className="admin-header__title">Panel de Administración</h1>
          <p className="admin-header__subtitle">Gestión de turnos</p>
        </div>

        <button
          type="button"
          className={`admin-history-btn ${mode === "history" ? "active" : ""}`}
          onClick={() =>
            setMode(mode === "upcoming" ? "history" : "upcoming")
          }
        >
          Historial
        </button>
      </div>

      <div className="admin-header__controls">
        <button type="button" className="admin-logout-btn" onClick={onLogout}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;