import { useState } from "react";
import { Sparkles, Lock } from "lucide-react";

function AdminLoginForm({ onSubmit, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ username, password, rememberMe });
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <Sparkles size={26} strokeWidth={2.4} />
        </div>

        <h1 className="admin-login__title">Panel de Administración</h1>
        <p className="admin-login__subtitle">Gestión de turnos</p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-login__field">
            <span>Usuario</span>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="admin-login__field">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <label className="admin-login__checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Recordarme</span>
          </label>

          {error ? <div className="admin-login__error">{error}</div> : null}

          <button className="admin-login__button" type="submit" disabled={loading}>
            <Lock size={18} strokeWidth={2.3} />
            <span>{loading ? "Ingresando..." : "Iniciar Sesión"}</span>
          </button>
        </form>

        <p className="admin-login__hint">
          Acceso restringido solo para administración
        </p>
      </div>
    </div>
  );
}

export default AdminLoginForm;