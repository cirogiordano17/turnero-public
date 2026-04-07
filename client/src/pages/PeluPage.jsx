import Services from "../components/booking/Services";
import DateSelector from "../components/booking/DateSelector";
import Slots from "../components/booking/Slots";
import useBooking from "../hooks/useBooking";
import { formatDateLong } from "../utils/dates";
import "../styles/pages/pelu.css";

function PeluPage() {
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
  } = useBooking({ category: "pelu" });

  return (
    <div className="pelu-page">
      <header id="inicio" className="hero d-flex align-items-center">
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
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
          </div>
        </div>
      </header>

      <section id="info" className="container py-5">
        <div className="row">
          <div className="col-12 mx-auto mb-4">
            <div className="card-dark rounded p-4">
              <h3 className="h6 text-uppercase muted mb-2">Importante</h3>
              <ul className="mb-0 muted">
                <li>Si necesitás cancelar, avisá por WhatsApp.</li>
                <li>Si no venís, se reprograma.</li>
                <li>Algunos servicios pueden combinarse el mismo día.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pelu-info">
        <div className="container">
          <div className="pelu-info__box">
            <h2 className="pelu-info__title">Nuestro Servicio</h2>

            <p className="pelu-info__text">
              Ofrecemos servicios de peluquería profesional con productos de alta calidad.
              Nuestro equipo está especializado en las últimas tendencias y técnicas de corte,
              color y tratamiento capilar.
            </p>

            <p className="pelu-info__text">
              Cada servicio es personalizado según tus necesidades y el tipo de tu cabello,
              garantizando resultados excepcionales.
            </p>
          </div>
        </div>
      </section>

      <section id="reservar" className="container pb-5 anchor-offset">
        <div className="card-dark rounded p-3 p-md-4 booking-shell">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="h4 fw-bold m-0">Elegí tus servicios</h2>
          </div>

          <div className="row g-3">
            <div className="col-12">
              <Services
                category="pelu"
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

                  <h3 className="success-title mt-3">Turno confirmado</h3>
                  <p className="success-text">
                    Tu turno quedó agendado correctamente.
                  </p>

                  <button
                    className="btn btn-outline-light mt-3"
                    onClick={resetBooking}
                    type="button"
                  >
                    Agendar otro turno
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
                      <label className="form-label">Comentario (opcional)</label>
                      <input
                        className="form-control"
                        placeholder="Ej: mechas rubias"
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
                      {submitting ? "Confirmando..." : "Confirmar turno"}
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

      <footer className="container pb-4">
        <div className="muted small">© Peluquería · Reservas por web / WhatsApp</div>
      </footer>

      <a
        className="wa-float"
        href="https://wa.me/5493500000000?text=Hola%2C%20quiero%20consultar%20por%20turnos"
        target="_blank"
        rel="noreferrer"
      >
        <span className="wa-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M20.52 3.48A11.82 11.82 0 0012.06 0C5.49 0 .13 5.36.13 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.64a11.92 11.92 0 005.78 1.48h.01c6.57 0 11.93-5.36 11.93-11.93 0-3.18-1.24-6.17-3.48-8.43zM12.07 21.9h-.01a9.93 9.93 0 01-5.06-1.39l-.36-.21-3.73.97.99-3.63-.23-.37a9.9 9.9 0 01-1.52-5.32c0-5.48 4.46-9.93 9.94-9.93 2.65 0 5.14 1.03 7.01 2.91a9.86 9.86 0 012.92 7.02c0 5.48-4.46 9.94-9.95 9.94zm5.46-7.43c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.94 1.18-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.66-1.6-.9-2.2-.23-.56-.46-.48-.65-.49l-.55-.01c-.2 0-.53.08-.8.38-.27.3-1.05 1.03-1.05 2.52 0 1.5 1.08 2.94 1.23 3.14.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z" />
          </svg>
        </span>
        <span className="wa-text">Consultar por WhatsApp</span>
      </a>
    </div>
  );
}

export default PeluPage;