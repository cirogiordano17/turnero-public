import "./styles/hero.css";
import { MapPin } from "lucide-react";
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
    <section className="hero" id="inicio">
      <div className="hero__overlay" />

      <div className="hero__content">
        <img
          src="/img/home-name.png"
          alt={CONTACT.salonName}
          className="hero__logo"
        />

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