import "../styles/pages/akashicos.css";

function AkashicosPage() {
  return (
    <div className="akashicos-page">
      <header className="hero-akash d-flex align-items-center">
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Registros Akáshicos</h1>
          <p className="lead-akash">
            Un espacio para tu conexión espiritual, claridad y sanación profunda.
          </p>

          <div className="d-flex gap-2">
            <a className="btn-akash btn-akash--primary" href="#reservar">
              Reservar sesión
            </a>
            <a className="btn-akash btn-akash--ghost" href="#info">
              Más información
            </a>
          </div>
        </div>
      </header>

      <section id="info" className="container py-5">
        <div className="card-dark rounded p-4">
          <h3 className="h6 text-uppercase muted mb-2">Importante</h3>
          <ul className="mb-0 muted">
            <li>La sesión se confirma luego del pago.</li>
            <li>Si necesitás reprogramar, avisá con anticipación.</li>
            <li>Podés dejar una consulta o intención para la sesión.</li>
          </ul>
        </div>
      </section>

      <section id="reservar" className="container pb-5">
        <div className="card-dark rounded p-3 p-md-4 booking-shell">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="h4 fw-bold m-0">Elegí tu sesión</h2>
          </div>

          <div className="row g-3">
            <div className="col-12">
              <div className="services-wrap">
                <div className="services-grid">
                  <label className="svc">
                    <div className="svc-inner">
                      <input type="radio" name="service" />
                      <div>
                        <div className="fw-semibold">Lectura Akáshica</div>
                        <div className="muted small">120 min · $45000</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="month-row">
                <div className="h5 m-0">abril</div>
                <div className="h5 m-0 month-muted">mayo</div>
              </div>

              <div className="day-strip mt-3">
                <button className="day-btn active">
                  <span className="dow">lun</span>
                  <span className="dom">7</span>
                </button>
                <button className="day-btn">
                  <span className="dow">mar</span>
                  <span className="dom">8</span>
                </button>
                <button className="day-btn">
                  <span className="dow">mié</span>
                  <span className="dom">9</span>
                </button>
              </div>

              <div className="time-group mt-3">
                <div className="muted small mb-2">Horarios disponibles</div>
                <div className="slots-grid">
                  <button className="btn btn-outline-light">10:00</button>
                  <button className="btn btn-outline-light">12:00</button>
                  <button className="btn btn-outline-light">16:00</button>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card-dark rounded p-3 booking-summary">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-bold">Resumen</div>
                  <div className="text-end">
                    <div className="muted small">120 min</div>
                    <div className="fw-bold">$45000</div>
                  </div>
                </div>

                <div className="summary-services">
                  <div className="sum-svc">
                    <div>
                      <div className="name">Lectura Akáshica</div>
                      <div className="meta">120 min</div>
                    </div>
                    <div>$45000</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Apellido</label>
                  <input className="form-control" />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">WhatsApp</label>
                  <input className="form-control" />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Email (opcional)</label>
                  <input className="form-control" />
                </div>

                <div className="col-12">
                  <label className="form-label">Consulta / intención</label>
                  <input className="form-control" />
                </div>
              </div>

              <div className="d-grid mt-3">
                <button className="btn btn-success btn-lg" id="btnBook">
                  Confirmar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AkashicosPage;