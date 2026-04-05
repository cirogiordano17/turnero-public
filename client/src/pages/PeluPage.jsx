import "../styles/base.css";
import "../styles/pelu.css";
import "../styles/booking.css";
import Services from "../components/booking/Services";

function PeluPage() {
  return (
    <>
      {/* HERO */}
      <header id="inicio" className="hero d-flex align-items-center">
        <div className="container py-5">
          <h1 className="display-5 fw-bold">Reservá tu turno</h1>

          <div className="d-flex gap-2 mt-3">
            <a className="btn btn-success btn-lg" href="#reservar">
              Reservar turno
            </a>
            <a className="btn btn-outline-light btn-lg" href="#servicios">
              Ver servicios
            </a>
          </div>

          <p className="muted small mt-3 mb-0">
            Lunes a Sábado · 09:00–13:00 y 15:00–20:00
          </p>
        </div>
      </header>

      {/* INFO */}
      <section className="container py-5">
        <div className="card-dark p-4">
          <h3 className="h6 text-uppercase muted mb-2">Importante</h3>
          <ul className="mb-0 muted">
            <li>Si necesitás cancelar, avisá por WhatsApp.</li>
            <li>Si no venís, se reprograma.</li>
            <li>Algunos servicios pueden combinarse el mismo día.</li>
          </ul>
        </div>
      </section>

      <Services />
    </>
  );
}

export default PeluPage;