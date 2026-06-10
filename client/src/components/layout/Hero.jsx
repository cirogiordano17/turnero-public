import "./styles/hero.css";
import { Button } from "../ui/Button";
import { CONTACT } from "../../config/contact";

export default function Hero({ onOpenBooking }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

   return (
    <section className="hero">
      <div className="hero__overlay" />

      <div className="hero__content">
        <h1 className="hero__title">{CONTACT.salonName}</h1>
        <p className="hero__subtitle">Estilo, bienestar y transformación</p>

        <div className="hero__actions">
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollToSection("servicios")}
          >
            Ver servicios
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onOpenBooking()}
          >
            Reservar turno
          </Button>
        </div>
      </div>

      <div className="hero__scroll">
        <span className="hero__chevron">⌄</span>
      </div>
    </section>
  );
}