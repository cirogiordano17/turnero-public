import "./styles/services-section.css";
import { Button } from "../ui/Button";

export default function ServicesSection() {
  return (
    <section className="services-section" id="servicios">
      <h2 className="services-section__title">Nuestros Servicios</h2>

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

          </div>
        </div>

        <div className="service-card">
          <div className="service-card__image">
            <img src="/img/akash.jpg" alt="Registros Akáshicos" />
          </div>

          <div className="service-card__content">
            <h3>Registros Akáshicos</h3>
            <p>
              Bienestar espiritual y conexión profunda. Sesiones personalizadas
              para tu transformación interior.
            </p>

         
          </div>
        </div>
      </div>
    </section>
  );
}