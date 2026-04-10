import { useEffect, useRef, useState } from "react";
import "./styles/results-section.css";

export default function ResultsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), 120); // delay
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="results-section">
      <div
        ref={ref}
        className={`results-section__card ${
          visible ? "results-section--visible" : ""
        }`}
      >
        <div className="results-section__image-wrapper">
          <img
            src="/img/results.jpg"
            alt="Resultados que inspiran"
            className="results-section__image"
          />
        </div>

        <div className="results-section__content">
          <h2 className="results-section__title">
            Resultados que inspiran
          </h2>

          <p className="results-section__text">
            Cada transformación es única y refleja la esencia de quien la vive.
            Nos enorgullece ser parte de tu camino hacia la mejor versión de ti mismo.
          </p>

          <div className="results-section__tags">
            <span className="results-section__tag">Profesionalismo</span>
            <span className="results-section__tag">Atención personalizada</span>
            <span className="results-section__tag">Productos premium</span>
          </div>
        </div>
      </div>
    </section>
  );
}