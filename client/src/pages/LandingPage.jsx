import { Link } from "react-router-dom";
import "../styles/pages/landing.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header__inner">
          <a href="#inicio" className="brand">
            Servicios
          </a>
        </div>
      </header>

      <main id="inicio" className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__content">
            <h1 className="landing-hero__title">Bienvenido</h1>
            <p className="landing-hero__text">
              Descubrí nuestros servicios especializados diseñados para tu bienestar y transformación.
            </p>
          </div>
        </section>

        <section className="services-section">
          <div className="landing-services-grid">
            <article className="service-card">
              <Link
                className="service-card__link"
                to="/peluqueria"
                aria-label="Ir a Peluquería"
              >
                <div className="service-card__image-wrap">
                  <img
                    src="/img/pelu.jpg"
                    alt="Peluquería"
                    className="service-card__image"
                  />
                </div>

                <div className="service-card__content">
                  <div className="service-card__icon" aria-hidden="true">
                    ✂
                  </div>

                  <div className="service-card__body">
                    <h2 className="service-card__title">Peluquería</h2>
                    <p className="service-card__description">
                      Estilo y cuidado profesional para tu cabello.
                    </p>
                    <span className="service-card__cta">Ver más →</span>
                  </div>
                </div>
              </Link>
            </article>

            <article className="service-card">
              <Link
                className="service-card__link"
                to="/akashicos"
                aria-label="Ir a Registros Akáshicos"
              >
                <div className="service-card__image-wrap">
                  <img
                    src="/img/akash.jpg"
                    alt="Registros Akáshicos"
                    className="service-card__image"
                  />
                </div>

                <div className="service-card__content">
                  <div className="service-card__icon" aria-hidden="true">
                    ✧
                  </div>

                  <div className="service-card__body">
                    <h2 className="service-card__title">Registros Akáshicos</h2>
                    <p className="service-card__description">
                      Conexión espiritual y sanación profunda.
                    </p>
                    <span className="service-card__cta">Ver más →</span>
                  </div>
                </div>
              </Link>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;