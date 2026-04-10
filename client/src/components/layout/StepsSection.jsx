import { useEffect, useRef, useState } from "react";
import {
  Search,
  CalendarDays,
  Sparkles,
  Star,
} from "lucide-react";
import "./styles/steps-section.css";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Elegí tu servicio",
    text: "Encontrá la propuesta que mejor se adapte a lo que necesitás hoy.",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Reservá tu turno",
    text: "Seleccioná día y horario de forma rápida y sin complicaciones.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Viví la experiencia",
    text: "Disfrutá de una atención profesional, personalizada y enfocada en vos.",
  },
  {
    number: "04",
    icon: Star,
    title: "Salí renovado/a",
    text: "Llevate una transformación que se note por fuera y se sienta por dentro.",
  },
];

function StepCard({ number, Icon, title, text, delay }) {
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
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

 return (
  <article
    ref={ref}
    className={`step-card ${visible ? "step-card--visible" : ""}`}
  >
    <div className="step-card__icon">
      <Icon size={40} strokeWidth={2.2} />
    </div>

    <div className="step-card__number">{number}</div>
    <h3 className="step-card__title">{title}</h3>
    <p className="step-card__text">{text}</p>
  </article>
);
}

export default function StepsSection() {
  return (
    <section className="steps-section">
      <div className="steps-section__container">
        <header className="steps-section__header">
          <h2 className="steps-section__title">Tu experiencia paso a paso</h2>
          <p className="steps-section__subtitle">
            Un proceso simple para que disfrutes cada momento
          </p>
        </header>

        <div className="steps-section__grid">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              Icon={step.icon}
              title={step.title}
              text={step.text}
              delay={index * 140}
            />
          ))}
        </div>
      </div>
    </section>
  );
}