function getInitial(username) {
  return username?.trim()?.[0]?.toUpperCase() || "?";
}

function AdminSidebar({ admin }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__user">
        <div className="admin-sidebar__avatar">{getInitial(admin?.username)}</div>
        <p className="admin-sidebar__username">{admin?.username}</p>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Navegación admin">
        {/* Los ítems de navegación se agregan en el próximo paso */}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
