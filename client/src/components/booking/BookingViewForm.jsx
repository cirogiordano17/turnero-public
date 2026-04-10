import Services from "./Services";
import DateSelector from "./DateSelector";
import Slots from "./Slots";
import useBooking from "../../hooks/useBooking";
import { formatDateLong } from "../../utils/dates";
import "./styles/booking-view-form.css";

function BookingViewForm({ category, onChangeCategory }) {
  const {
    selectedIds,
    selectedDate,
    slots,
    selectedSlot,
    loadingSlots,
    slotsError,

    selectedServices,
    totalDuration,
    endTime,
    totalPrice,
    visibleDays,
    canGoPrev,

    setServices,
    setSelectedDate,
    setSelectedSlot,

    toggleService,
    handlePrevDays,
    handleNextDays,
  } = useBooking({ category });

  const categoryLabel =
    category === "pelu" ? "Peluquería" : "Registros Akáshicos";

  return (
    <div className="booking-view-form">
      <div className="booking-view-form__top">
        <div>
          <div className="booking-view-form__badge">
            Categoría: {categoryLabel}
          </div>
        </div>

        <button
          type="button"
          className="booking-view-form__change"
          onClick={() => onChangeCategory(null)}
        >
          Cambiar categoría
        </button>
      </div>

      <div className="booking-view-form__section">
        <h2 className="booking-view-form__section-title">
          Elegí tus servicios
        </h2>

        <Services
          category={category}
          selectedIds={selectedIds}
          onToggle={toggleService}
          onServicesLoaded={setServices}
        />
      </div>

      <div className="booking-view-form__section">
        <h2 className="booking-view-form__section-title">
          Elegí fecha y horario
        </h2>

        <DateSelector
          days={visibleDays}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrev={handlePrevDays}
          onNext={handleNextDays}
          canGoPrev={canGoPrev}
        />

        {selectedIds.length === 0 ? (
          <div className="booking-view-form__message">
            Elegí al menos un servicio para ver horarios.
          </div>
        ) : loadingSlots ? (
          <div className="booking-view-form__message">Cargando horarios...</div>
        ) : slotsError ? (
          <div className="booking-view-form__error">{slotsError}</div>
        ) : (
          <Slots
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}
      </div>

      <div className="booking-view-form__section">
        <h2 className="booking-view-form__section-title">Resumen</h2>

        <div className="booking-summary-box">
            <div className="booking-summary-box__row">
            <span>Fecha</span>
            <strong>{formatDateLong(selectedDate)}</strong>
            </div>

            <div className="booking-summary-box__row">
            <span>Horario</span>
            <strong>
                {selectedSlot && endTime ? `${selectedSlot} a ${endTime}` : "—"}
            </strong>
            </div>

            <div className="booking-summary-box__row">
            <span>Duración total</span>
            <strong>{totalDuration > 0 ? `${totalDuration} min` : "—"}</strong>
            </div>

            <div className="booking-summary-box__divider" />

            <div className="booking-summary-box__detail-title">Detalle</div>

            <div className="booking-summary-box__services">
            {selectedServices.length === 0 ? (
                <div className="booking-view-form__message">
                Elegí servicios para ver el detalle.
                </div>
            ) : (
                selectedServices.map((service) => (
                <div key={service.id} className="booking-summary-box__service">
                    <div className="booking-summary-box__service-left">
                    <div className="booking-summary-box__service-name">
                        {service.name}
                    </div>
                    <div className="booking-summary-box__service-meta">
                        {service.duration_min} min
                    </div>
                    </div>

                    <div className="booking-summary-box__service-price">
                    ${(service.price || 0).toLocaleString("es-AR")}
                    </div>
                </div>
                ))
            )}
            </div>

            <div className="booking-summary-box__total">
            <span>Total</span>
            <strong>${totalPrice.toLocaleString("es-AR")}</strong>
            </div>
        </div>
        </div>
    </div>
  );
}

export default BookingViewForm;