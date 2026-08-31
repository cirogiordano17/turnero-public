import "./styles/services-section.css";
import { Button } from "../ui/Button";

export default function ServicesSection({ onOpenBooking }) {
  return (
    <section className="services-section" id="servicios">
      <h2 className="services-section__title">Nuestros Servicios</h2>
      <p className="services-section__subtitle">
        Todos nuestros servicios se realizan en Villa Allende, Córdoba.
      </p>

      <div className="services-section__grid">
        <div className="service-card">
          <div className="service-card__image">
            <img src="/img/pelu.jpg" alt="Peluquería" />
          </div>

          <div className="service-card__content">
            <h3>Peluquería</h3>
            <p>
              Corte, color y styling profesional. Transformamos tu cabello con
              las últimas tendencias y técnicas.
            </p>

            <Button onClick={() => onOpenBooking?.("pelu")}>
              Reservar
            </Button>
          </div>
        </div>

        <div className="service-card">
          <div className="service-card__image">
            <img src="/img/akash.jpg" alt="Registros Akáshicos" />
          </div>

          <div className="service-card__content">
            <div className="service-card__title-row">
              <h3>Registros Akáshicos</h3>
              <span className="service-card__badge">Virtual o presencial</span>
            </div>
            <p>
              Bienestar espiritual y conexión profunda. Sesiones personalizadas
              para tu transformación interior.
            </p>

            <Button onClick={() => onOpenBooking?.("akashicos")}>
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}