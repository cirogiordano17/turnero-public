import { useEffect, useRef, useState } from "react";
import "./styles/experience-section.css";
import { CONTACT } from "../../config/contact";

function FadeInStat({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(element);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`experience-stat ${visible ? "experience-stat--visible" : ""}`}
    >
      <span className="experience-stat__value">{value}</span>
      <span className="experience-stat__label">{label}</span>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section className="experience-section">
      <div className="experience-section__grid">
        <div className="experience-section__image-wrapper">
          <img
            src="/img/experience.jpg"
            alt={`Experiencia ${CONTACT.salonName}`}
            className="experience-section__image"
          />
        </div>

        <div className="experience-section__content">
          <h2 className="experience-section__title">
            Una experiencia que transforma
          </h2>

          <p className="experience-section__text">
            En {CONTACT.salonName} creemos que cada visita es una oportunidad para
            renovarte. Combinamos técnicas profesionales de belleza con un
            enfoque integral que cuida tanto tu apariencia como tu bienestar
            interior.
          </p>

          <p className="experience-section__text">
            Nuestro espacio está diseñado para ser un refugio de calma en medio
            de la rutina diaria. Aquí encontrarás un ambiente donde el
            profesionalismo se encuentra con la calidez humana.
          </p>

          <p className="experience-section__text">
            Desde cortes y tratamientos capilares hasta sesiones de registros
            akáshicos, cada servicio está pensado para que te reconectes contigo
            mismo y salgas transformado, por dentro y por fuera.
          </p>

          <div className="experience-section__stats">
            <FadeInStat value="10+" label="Años de experiencia" delay={0} />
            <FadeInStat value="500+" label="Clientes felices" delay={150} />
            <FadeInStat value="100%" label="Dedicación" delay={300} />
          </div>
        </div>
      </div>
    </section>
  );
}