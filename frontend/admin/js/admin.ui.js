window.AdminUI = {
  showLogin() {
    window.AdminDOM.loginView.classList.remove("d-none");
    window.AdminDOM.dashboardView.classList.add("d-none");
  },

  showDashboard() {
    window.AdminDOM.loginView.classList.add("d-none");
    window.AdminDOM.dashboardView.classList.remove("d-none");
  },

  setMessage(text = "") {
    window.AdminDOM.adminMessage.textContent = text;
  },

  setSelectedDate(date) {
    if (!date) {
      window.AdminDOM.selectedDateText.textContent = "—";
      return;
    }

    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    window.AdminDOM.selectedDateText.textContent = dt.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  },

  renderAppointments() {
  const { appointmentsList, appointmentsCount } = window.AdminDOM;
  const appointments = window.AdminState.appointments || [];

  appointmentsCount.textContent = appointments.length;
  appointmentsList.innerHTML = "";

  if (appointments.length === 0) {
    appointmentsList.innerHTML = `
      <div class="appointment-card">
        <div class="appointment-name">No hay turnos cargados</div>
        <div class="appointment-meta">Probá con otra fecha o cargá turnos nuevamente.</div>
      </div>
    `;
    return;
  }

  appointments.forEach((appt) => {
    const servicesHtml = (appt.services || [])
      .map((s) => `<span class="appointment-chip">${s.name} · ${s.duration_min} min</span>`)
      .join("");

    const appointmentCategory = appt.category || appt.services?.[0]?.category || "";
    const showConfirmPaymentBtn =
    appointmentCategory === "akashicos" && appt.status === "PENDIENTE_PAGO";

    const confirmPaymentBtnHtml = showConfirmPaymentBtn
      ? `
        <button
          class="admin-btn admin-btn--success btn-confirm-payment"
          type="button"
          data-id="${appt.id}"
        >
          Confirmar pago
        </button>
      `
      : "";

    const cancelBtnHtml = `
      <button
        class="admin-btn admin-btn--secondary btn-cancel-appointment"
        type="button"
        data-id="${appt.id}"
        ${appt.status === "CANCELADO" ? "disabled" : ""}
      >
        ${appt.status === "CANCELADO" ? "Cancelado" : "Cancelar"}
      </button>
    `;

    const card = document.createElement("div");
    card.className = "appointment-card";
    card.innerHTML = `
      <div class="appointment-top">
        <div class="appointment-time">${appt.start_hhmm} · ${appt.end_hhmm}</div>
        <div class="appointment-status">${appt.status}</div>
      </div>

      <div class="appointment-name">${appt.first_name} ${appt.last_name}</div>
      <div class="appointment-meta">${appt.whatsapp || ""}</div>
    ${appt.email ? `<div class="appointment-meta">${appt.email}</div>` : ""}
      <div class="appointment-meta">${appt.comment || "Sin comentario"}</div>
      <div class="appointment-meta">${appointmentCategory || "sin categoría"}</div>

      <div class="appointment-price">
        $${Number(appt.price_total || 0).toLocaleString("es-AR")}
      </div>

      <div class="appointment-actions">
        ${confirmPaymentBtnHtml}
        ${cancelBtnHtml}
      </div>
    `;

    appointmentsList.appendChild(card);
  });
},

  renderBlockedDays() {
    const { blockedDaysList } = window.AdminDOM;
    const blockedDays = window.AdminState.blockedDays || [];

    if (!blockedDaysList) return;

    if (blockedDays.length === 0) {
      blockedDaysList.textContent = "No hay días bloqueados.";
      return;
    }

    blockedDaysList.innerHTML = blockedDays
      .map(d => `<div>${d}</div>`)
      .join("");
  },

  updateBlockDayButton() {
  const { adminDate, btnBlockDay } = window.AdminDOM;
  const date = adminDate?.value || "";
  const blockedDays = window.AdminState.blockedDays || [];

  if (!btnBlockDay) return;

  const isBlocked = !!date && blockedDays.includes(date);

  if (isBlocked) {
    btnBlockDay.textContent = "🔓 Desbloquear día";

    btnBlockDay.classList.remove("admin-btn--danger");
    btnBlockDay.classList.remove("admin-btn--secondary");
    btnBlockDay.classList.add("admin-btn--success");

  } else {
    btnBlockDay.textContent = "🔒 Bloquear día";

    btnBlockDay.classList.remove("admin-btn--success");
    btnBlockDay.classList.remove("admin-btn--secondary");
    btnBlockDay.classList.add("admin-btn--danger");
  }
},
openBlockReasonModal(date) {
  const { blockReasonModal, blockReasonInput } = window.AdminDOM;

  window.AdminState.pendingBlockDate = date;

  if (blockReasonInput) blockReasonInput.value = "";
  if (blockReasonModal) blockReasonModal.classList.remove("d-none");
},

closeBlockReasonModal() {
  const { blockReasonModal, blockReasonInput } = window.AdminDOM;

  window.AdminState.pendingBlockDate = null;

  if (blockReasonInput) blockReasonInput.value = "";
  if (blockReasonModal) blockReasonModal.classList.add("d-none");
},

openCancelAppointmentModal(id) {
  window.AdminState.pendingCancelAppointmentId = id;

  if (window.AdminDOM.cancelAppointmentModal) {
    window.AdminDOM.cancelAppointmentModal.classList.remove("d-none");
  }
},

closeCancelAppointmentModal() {
  window.AdminState.pendingCancelAppointmentId = null;

  if (window.AdminDOM.cancelAppointmentModal) {
    window.AdminDOM.cancelAppointmentModal.classList.add("d-none");
  }
},

openConfirmPaymentModal(id) {
  window.AdminState.pendingConfirmPaymentId = id;

  if (window.AdminDOM.confirmPaymentModal) {
    window.AdminDOM.confirmPaymentModal.classList.remove("d-none");
  }
},

closeConfirmPaymentModal() {
  window.AdminState.pendingConfirmPaymentId = null;

  if (window.AdminDOM.confirmPaymentModal) {
    window.AdminDOM.confirmPaymentModal.classList.add("d-none");
  }
},

};