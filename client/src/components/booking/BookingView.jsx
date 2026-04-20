import { useMemo, useState } from "react";
import BookingCategorySelector from "./BookingCategorySelector";
import BookingViewForm from "./BookingViewForm";
import "./styles/booking-view.css";
import { Button } from "../ui/Button";

function BookingView({ selectedCategory, onSelectCategory, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);

  const subtitle = useMemo(() => {
    if (!selectedCategory) {
      return "Elegí una categoría para ver los servicios disponibles";
    }

    if (currentStep === 1) {
      return "Elegí uno o más servicios para continuar";
    }

    if (currentStep === 2) {
      return "Seleccioná la fecha y el horario";
    }

    if (currentStep === 3) {
      return "Revisá el resumen y completá tus datos";
    }

    return "Completá tu reserva";
  }, [selectedCategory, currentStep]);

  return (
    <section className="booking-view" id="reservar">
      <div className="booking-view__container">
        <div className="booking-view__header">
          <h1 className="booking-view__title">Reservá tu turno</h1>
          <p className="booking-view__subtitle">{subtitle}</p>
        </div>

        {!selectedCategory ? (
          <>
            <div className="mb-3">
              <Button variant="pill" onClick={onBack}>
                ← Volver al inicio
              </Button>
            </div>

            <BookingCategorySelector onSelectCategory={onSelectCategory} />
          </>
        ) : (
          <BookingViewForm
            category={selectedCategory}
            onChangeCategory={onSelectCategory}
            onStepChange={setCurrentStep}
          />
        )}
      </div>
    </section>
  );
}

export default BookingView;