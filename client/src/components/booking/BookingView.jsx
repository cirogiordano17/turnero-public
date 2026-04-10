import BookingCategorySelector from "./BookingCategorySelector";
import BookingViewForm from "./BookingViewForm";
import "./styles/booking-view.css";

function BookingView({ selectedCategory, onSelectCategory, onBack }) {
  return (
    <section className="booking-view">
      <div className="booking-view__container">
        <button
          type="button"
          className="booking-view__back"
          onClick={onBack}
        >
          ← Volver al inicio
        </button>

        <div className="booking-view__header">
          <h1 className="booking-view__title">Reservá tu turno</h1>
          <p className="booking-view__subtitle">
            Elegí tu categoría y completá la reserva
          </p>
        </div>

        {!selectedCategory ? (
          <BookingCategorySelector onSelectCategory={onSelectCategory} />
        ) : (
          <BookingViewForm
            category={selectedCategory}
            onChangeCategory={onSelectCategory}
          />
        )}
      </div>
    </section>
  );
}

export default BookingView;