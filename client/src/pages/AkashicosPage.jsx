import Services from "../components/booking/Services";
import DateSelector from "../components/booking/DateSelector";
import Slots from "../components/booking/Slots";
import useBooking from "../hooks/useBooking";
import { formatDateLong } from "../utils/dates";
import "../styles/pages/akashicos.css";

function AkashicosPage() {
  const {
    selectedIds,
    selectedDate,
    slots,
    selectedSlot,
    loadingSlots,
    slotsError,

    firstName,
    lastName,
    whatsapp,
    email,
    comment,

    submitting,
    submitError,
    bookingSuccess,
    fieldErrors,

    selectedServices,
    totalDuration,
    totalPrice,
    visibleDays,
    canGoPrev,

    setServices,
    setSelectedDate,
    setSelectedSlot,
    setFirstName,
    setLastName,
    setWhatsapp,
    setEmail,
    setComment,
    setFieldErrors,

    toggleService,
    handlePrevDays,
    handleNextDays,
    handleSubmit,
    resetBooking,
  } = useBooking({ category: "akashicos" });

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
              <Services
                category="akashicos"
                selectedIds={selectedIds}
                onToggle={toggleService}
                onServicesLoaded={setServices}
              />
            </div>

            <div className="col-12">
              <DateSelector
                days={visibleDays}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onPrev={handlePrevDays}
                onNext={handleNextDays}
                canGoPrev={canGoPrev}
              />

              {selectedIds.length === 0 ? (
                <div className="muted small mt-3">
                  Elegí al menos un servicio para ver horarios.
                </div>
              ) : loadingSlots ? (
                <div className="muted small mt-3">Cargando horarios...</div>
              ) : slotsError ? (
                <div className="text-warning small mt-3">{slotsError}</div>
              ) : (
                <Slots
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              )}
            </div>

            <div className="col-12">
              <div className="card-dark rounded p-3 booking-summary">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="fw-bold">Resumen</div>
                  <div className="text-end">
                    <div className="muted small">
                      {totalDuration > 0 ? `${totalDuration} min` : "—"}
                    </div>
                    <div className="fw-bold">
                      ${totalPrice.toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>

                <div className="summary-row">
                  <div className="muted small">Fecha</div>
                  <div className="fw-semibold">{formatDateLong(selectedDate)}</div>
                </div>

                <div className="summary-row mt-2">
                  <div className="muted small">Horario</div>
                  <div className="fw-semibold">{selectedSlot || "—"}</div>
                </div>

                <hr className="border-secondary my-3" />

                <div className="muted small mb-2">Servicios</div>

                <div className="summary-services">
                  {selectedServices.length === 0 ? (
                    <div className="muted small">Elegí servicios.</div>
                  ) : (
                    selectedServices.map((service) => (
                      <div key={service.id} className="sum-svc">
                        <div>
                          <div className="name">{service.name}</div>
                          <div className="meta">{service.duration_min} min</div>
                        </div>
                        <div>${(service.price || 0).toLocaleString("es-AR")}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-12">
              <hr className="border-secondary" />

              {bookingSuccess ? (
                <div className="booking-success text-center">
                  <div className="success-check-wrap">
                    <div className="success-check">
                      <svg viewBox="0 0 52 52" aria-hidden="true">
                        <circle
                          className="success-check-circle"
                          cx="26"
                          cy="26"
                          r="25"
                          fill="none"
                        />
                        <path
                          className="success-check-mark"
                          fill="none"
                          d="M14 27 l8 8 l16 -16"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="success-title mt-3">Reserva confirmada</h3>
                  <p className="success-text">
                    Tu sesión quedó agendada correctamente.
                  </p>

                  <button
                    className="btn btn-outline-light mt-3"
                    onClick={resetBooking}
                    type="button"
                  >
                    Agendar otra sesión
                  </button>
                </div>
              ) : (
                <>
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Nombre</label>
                      <input
                        className={`form-control ${
                          fieldErrors.firstName ? "is-invalid" : ""
                        }`}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (fieldErrors.firstName) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              firstName: "",
                            }));
                          }
                        }}
                      />
                      {fieldErrors.firstName && (
                        <div className="text-danger small mt-1">
                          {fieldErrors.firstName}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Apellido</label>
                      <input
                        className={`form-control ${
                          fieldErrors.lastName ? "is-invalid" : ""
                        }`}
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (fieldErrors.lastName) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              lastName: "",
                            }));
                          }
                        }}
                      />
                      {fieldErrors.lastName && (
                        <div className="text-danger small mt-1">
                          {fieldErrors.lastName}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">WhatsApp</label>
                      <input
                        className={`form-control ${
                          fieldErrors.whatsapp ? "is-invalid" : ""
                        }`}
                        placeholder="351..."
                        inputMode="numeric"
                        value={whatsapp}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          setWhatsapp(onlyDigits);

                          if (fieldErrors.whatsapp) {
                            setFieldErrors((prev) => ({
                              ...prev,
                              whatsapp: "",
                            }));
                          }
                        }}
                      />
                      {fieldErrors.whatsapp && (
                        <div className="text-danger small mt-1">
                          {fieldErrors.whatsapp}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Email (opcional)</label>
                      <input
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Consulta / intención</label>
                      <input
                        className="form-control"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-grid mt-3">
                    <button
                      className="btn btn-success btn-lg"
                      id="btnBook"
                      disabled={submitting}
                      onClick={handleSubmit}
                      type="button"
                    >
                      {submitting ? "Confirmando..." : "Confirmar reserva"}
                    </button>
                  </div>

                  {submitError && (
                    <div className="text-danger mt-3">{submitError}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AkashicosPage;