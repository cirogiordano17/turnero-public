import { useNavigate, useLocation } from "react-router-dom";
import "./styles/navbar.css";

const SCROLL_LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <nav className="navbar__links">
          <button
            type="button"
            className="navbar__link"
            onClick={() => scrollToSection("inicio")}
          >
            Inicio
          </button>

          <button
            type="button"
            className={`navbar__link${location.pathname === "/productos" ? " navbar__link--active" : ""}`}
            onClick={() => navigate("/productos")}
          >
            Productos
          </button>

          <button
            type="button"
            className="navbar__link"
            onClick={() => scrollToSection("nosotros")}
          >
            Nosotros
          </button>

          <button
            type="button"
            className="navbar__link"
            onClick={() => scrollToSection("contacto")}
          >
            Contacto
          </button>
        </nav>
      </div>
    </header>
  );
}
