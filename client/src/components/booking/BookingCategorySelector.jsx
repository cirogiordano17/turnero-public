import "./styles/booking-category-selector.css";

function BookingCategorySelector({ onSelectCategory }) {
  return (
    <div className="booking-category-selector">
      <h2 className="booking-category-selector__title">
        ¿Qué servicio querés reservar?
      </h2>

      <p className="booking-category-selector__text">
        Elegí una categoría para ver los servicios disponibles.
      </p>

      <div className="booking-category-selector__grid">
        <button
          type="button"
          className="booking-category-card"
          onClick={() => onSelectCategory("pelu")}
        >
          <span className="booking-category-card__title">Peluquería</span>
          <span className="booking-category-card__text">
            Cortes, color, styling y tratamientos capilares.
          </span>
        </button>

        <button
          type="button"
          className="booking-category-card"
          onClick={() => onSelectCategory("akashicos")}
        >
          <span className="booking-category-card__title">
            Registros Akáshicos
          </span>
          <span className="booking-category-card__text">
            Sesiones de conexión, bienestar y transformación interior.
          </span>
          <span className="booking-category-card__note">
            Turnos a partir de las 15:00 hs.
          </span>
        </button>
      </div>
    </div>
  );
}

export default BookingCategorySelector;