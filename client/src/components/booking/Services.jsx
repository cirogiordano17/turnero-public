import { useEffect, useState } from "react";
import { getServices } from "../../api/services";
import "./styles/services.css";

function Services({ category = "pelu", selectedIds, onToggle, onServicesLoaded }) {
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

  if (loading) return <div id="servicesLoading">Cargando servicios...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="services-wrap">
      <div className="services-grid">
        {services.map((service) => {
          const active = selectedIds.includes(service.id);

          return (
            <label key={service.id} className="svc">
              <div className={`svc-inner ${active ? "active" : ""}`}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggle(service.id)}
                />

                <div>
                  <div className="fw-semibold">{service.name}</div>
                  <div className="muted small">
                    {service.duration_min} min · ${service.price ?? 0}
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default Services;