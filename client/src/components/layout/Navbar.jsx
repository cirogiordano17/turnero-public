import "./styles/navbar.css";

const LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "productos", label: "Productos", comingSoon: true },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
  // Próximamente: Opiniones (falta definir contenido)
];

export default function Navbar() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderLink = (link) => {
    if (link.comingSoon) {
      return (
        <span key={link.id} className="navbar__link navbar__link--disabled">
          {link.label}
          <span className="navbar__badge">Próximamente</span>
        </span>
      );
    }

    return (
      <button
        key={link.id}
        type="button"
        className="navbar__link"
        onClick={() => scrollToSection(link.id)}
      >
        {link.label}
      </button>
    );
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <nav className="navbar__links">{LINKS.map(renderLink)}</nav>
      </div>
    </header>
  );
}
