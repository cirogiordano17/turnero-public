import { Clock3 } from "lucide-react";
import "./styles/hours-section.css";
import { CONTACT } from "../../config/contact";

export default function HoursSection() {
  return (
    <section className="hours-section">
      <div className="hours-section__card">
        <div className="hours-section__icon">
          <Clock3 size={32} strokeWidth={2.2} />
        </div>

        <div className="hours-section__content">
          <h2 className="hours-section__title">Horario de atención</h2>

          <div className="hours-section__list">
            {CONTACT.hours.map((h) => (
              <div key={h.days} className="hours-section__row">
                <span className="hours-section__days">{h.days}</span>
                <span className="hours-section__range">{h.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
