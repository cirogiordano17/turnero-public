import { useEffect, useState } from "react";
import { getServices } from "../../api/services";
import "./styles/services.css";

const serviceDescriptions = {
  Corte:
    "Corte personalizado según tu estilo y tipo de pelo, con terminación prolija y asesoramiento.",
  Color:
    "Aplicación profesional de color según el estado y objetivo de tu cabello.",
  Mechas:
    "Trabajo de iluminación capilar para dar dimensión y un resultado natural o marcado.",
  Alisado:
    "Tratamiento para reducir frizz y mejorar el manejo del cabello.",
  Keratina:
    "Nutrición profunda para fortalecer, suavizar y dar brillo.",
  Balayage:
    "Técnica de coloración progresiva para reflejos suaves y naturales.",
};

function Services({
  category = "pelu",
  selectedIds,
  onToggle,
  onServicesLoaded,
}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getServices(category);
        setServices(data);

        if (onServicesLoaded) {
          onServicesLoaded(data);
        }
      } catch (err) {
        console.error(err);
        setError("Error cargando servicios");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category, onServicesLoaded]);

  if (loading) return <div>Cargando servicios...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="services-list">
      {services.map((service) => {
        const active = selectedIds.includes(service.id);

        const description =
          serviceDescriptions[service.name] ||
          "Servicio profesional adaptado a tus necesidades.";

        return (
          <div
            key={service.id}
            className={`service-card ${active ? "active" : ""}`}
          >
            <div className="service-card__content">
              <div className="service-card__header">
                <h3>{service.name}</h3>
                <span className="service-price">
                  ${service.price ?? 0}
                </span>
              </div>

              <div className="service-meta">
                {service.duration_min} min
              </div>

              <p className="service-desc">{description}</p>

              <div className="service-actions">
                <button
                  className={`service-btn ${
                    active ? "selected" : ""
                  }`}
                  onClick={() => onToggle(service.id)}
                >
                  {active ? "Seleccionado" : "Agendar servicio"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Services;