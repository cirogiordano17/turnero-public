import { MessageCircle, Phone, Camera, Clock3 } from "lucide-react";
import "./styles/contact-section.css";
import { CONTACT } from "../../config/contact";

export default function ContactSection() {
  return (
    <section className="contact-section" id="contacto">
      <div className="contact-section__container">
        <header className="contact-section__header">
          <h2 className="contact-section__title"> Contactanos</h2>
          <p className="contact-section__subtitle">
            Elegí el método que prefieras para contactarnos
          </p>
        </header>

        <div className="contact-section__grid">

          {/* WHATSAPP */}
          <article className="contact-card contact-card--primary">
            <div className="contact-card__left">
              <div className="contact-card__icon contact-card__icon--whatsapp">
                <MessageCircle size={36} strokeWidth={2.2} />
              </div>

              <div className="contact-card__content">
                <h3>WhatsApp</h3>
                <p>La forma más rápida de reservar</p>
              </div>
            </div>

            <a
              className="contact-card__cta"
              href={`https://wa.me/${CONTACT.whatsapp}?text=Hola,%20quiero%20reservar%20un%20turno`}
              target="_blank"
              rel="noreferrer"
            >
              Enviar mensaje
            </a>
          </article>

          {/* TELÉFONO */}
          <article className="contact-card">
            <div className="contact-card__left">
              <div className="contact-card__icon">
                <Phone size={32} strokeWidth={2.2} />
              </div>

              <div className="contact-card__content">
                <h3>Teléfono</h3>
                <p>Llamanos directamente</p>
                <span>{CONTACT.phone}</span>
              </div>
            </div>
          </article>

          {/* INSTAGRAM */}
          <article className="contact-card">
            <div className="contact-card__left">
              <div className="contact-card__icon">
                <Camera size={32} strokeWidth={2.2} />
              </div>

              <div className="contact-card__content">
                <h3>Instagram</h3>
                <p>Seguinos en redes</p>
                <a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {CONTACT.instagram}
                </a>
              </div>
            </div>
          </article>

          {/* HORARIOS */}
          <article className="contact-card contact-card--hours">
            <div className="contact-card__left contact-card__left--top">
              <div className="contact-card__icon">
                <Clock3 size={32} strokeWidth={2.2} />
              </div>

              <div className="contact-card__content">
                <h3>Horarios de atención</h3>
              </div>
            </div>

            <div className="contact-hours">
              {CONTACT.hours.map((h) => (
                <div key={h.days} className="contact-hours__item">
                  <p>{h.days}</p>
                  <span>{h.range}</span>
                </div>
              ))}
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}