import "./styles/client-form.css";


function ClientForm({
  firstName,
  lastName,
  whatsapp,
  email,
  comment,

  submitting,
  submitError,
  bookingSuccess,
  fieldErrors,

  setFirstName,
  setLastName,
  setWhatsapp,
  setEmail,
  setComment,
  setFieldErrors,

  handleSubmit,
  resetBooking,
}) {
  if (bookingSuccess) {
    return (
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
          className="client-form__reset-btn mt-3"
          onClick={resetBooking}
          type="button"
        >
          Agendar otro turno
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="row g-2">
        <div className="col-12 col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className={`form-control ${fieldErrors.firstName ? "is-invalid" : ""}`}
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
            className={`form-control ${fieldErrors.lastName ? "is-invalid" : ""}`}
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
            className={`form-control ${fieldErrors.whatsapp ? "is-invalid" : ""}`}
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
  );
}

export default ClientForm;