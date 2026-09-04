function AdminHeader({ mode }) {
  const isHistory = mode === "history";

  return (
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
      </div>
    </header>
  );
}

export default AdminHeader;
