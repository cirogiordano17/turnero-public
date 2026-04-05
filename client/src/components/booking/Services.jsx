import { useEffect, useState } from "react";
import { getServices } from "../../api/services";

function Services() {
  const [services, setServices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const data = await getServices("pelu");
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los servicios.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  function toggleService(serviceId) {
    setSelectedIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  }

  return (
    <div className="col-12">
      <div className="services-wrap">
        <div className="services-grid">
          {loading && <div>Cargando servicios...</div>}

          {error && <div className="text-danger">{error}</div>}

          {!loading &&
            !error &&
            services.map((service) => {
              const checked = selectedIds.includes(service.id);

              return (
                <label key={service.id} className="svc">
                  <div className="svc-inner">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(service.id)}
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
    </div>
  );
}

export default Services;