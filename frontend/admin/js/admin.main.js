window.AdminMain = {
  getTodayYmd() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  saveToken(token) {
  localStorage.setItem(window.AdminConfig.STORAGE_KEY, token);
},

loadSavedToken() {
  return localStorage.getItem(window.AdminConfig.STORAGE_KEY) || "";
},

clearToken() {
  localStorage.removeItem(window.AdminConfig.STORAGE_KEY);
},

  async loadAppointments() {
    const date = window.AdminDOM.adminDate.value;

    if (!date) {
      window.AdminUI.setMessage("Elegí una fecha.");
      return;
    }

    window.AdminUI.setMessage("Cargando turnos...");
    window.AdminState.selectedDate = date;
    window.AdminUI.setSelectedDate(date);

    const { ok, data } = await window.AdminAPI.getAppointmentsByDate(date);

    if (!ok) {
      window.AdminState.appointments = [];
      window.AdminUI.renderAppointments();
      window.AdminUI.setMessage(data.error || "No se pudieron cargar los turnos.");
      return;
    }

    window.AdminState.appointments = data;
    window.AdminUI.renderAppointments();
    window.AdminUI.setMessage("");
  },

  async loadBlockedDays() {
    const today = new Date();
    const from = today.toISOString().slice(0, 10);

    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 90);
    const to = toDate.toISOString().slice(0, 10);

    const { ok, data } = await window.AdminAPI.getClosedDays(from, to);

    if (!ok) {
      window.AdminState.blockedDays = [];
    } else {
      window.AdminState.blockedDays = Array.isArray(data) ? data : [];
    }

    window.AdminUI.renderBlockedDays();
    window.AdminUI.updateBlockDayButton();
  },

  async login() {
  const username = window.AdminDOM.adminUsername.value.trim();
  const password = window.AdminDOM.adminPassword.value;

  if (!username || !password) {
    window.AdminDOM.loginError.textContent = "Ingresá usuario y contraseña.";
    return;
  }

  window.AdminDOM.loginError.textContent = "";

  const { ok, data } = await window.AdminAPI.login(username, password);

  if (!ok) {
    window.AdminAPI.clearToken();
    window.AdminDOM.loginError.textContent = data.error || "Credenciales inválidas.";
    return;
  }

  window.AdminAPI.setToken(data.token);
  window.AdminUI.showDashboard();

  const today = window.AdminMain.getTodayYmd();
  window.AdminDOM.adminDate.value = today;

  await window.AdminMain.loadBlockedDays();
  await window.AdminMain.loadAppointments();
},

  logout() {
  window.AdminState.token = "";
  window.AdminState.appointments = [];
  window.AdminState.blockedDays = [];
  window.AdminMain.clearToken();
  window.AdminUI.showLogin();

  window.AdminDOM.adminUsername.value = "";
  window.AdminDOM.adminPassword.value = "";
  window.AdminDOM.appointmentsList.innerHTML = "";
  window.AdminUI.setMessage("");

  if (window.AdminDOM.blockedDaysList) {
    window.AdminDOM.blockedDaysList.innerHTML = "";
  }
},

  async cancelAppointment(id) {

  window.AdminUI.setMessage("Cancelando turno...");

  const { ok, data } = await window.AdminAPI.cancelAppointment(id);

  if (!ok) {
    window.AdminUI.setMessage(data.error || "No se pudo cancelar el turno.");
    return;
  }

  window.AdminUI.setMessage("Turno cancelado.");
  await window.AdminMain.loadAppointments();
},

  async blockSelectedDay(reason = "") {
  const date = window.AdminDOM.adminDate.value;

  if (!date) {
    window.AdminUI.setMessage("Elegí una fecha para bloquear.");
    return;
  }

  window.AdminUI.setMessage("Bloqueando día...");

  const { ok, data } = await window.AdminAPI.blockDay(date, reason);

  if (!ok) {
    window.AdminUI.setMessage(data.error || "No se pudo bloquear el día.");
    return;
  }

  window.AdminUI.setMessage("Día bloqueado.");
  await window.AdminMain.loadBlockedDays();
  await window.AdminMain.loadAppointments();
},

  async unblockSelectedDay() {
  const date = window.AdminDOM.adminDate.value;

  if (!date) {
    window.AdminUI.setMessage("Elegí una fecha para desbloquear.");
    return;
  }

  window.AdminUI.setMessage("Desbloqueando día...");

  const { ok, data } = await window.AdminAPI.unblockDay(date);

  if (!ok) {
    window.AdminUI.setMessage(data.error || "No se pudo desbloquear el día.");
    return;
  }

  window.AdminUI.setMessage("Día desbloqueado.");
  await window.AdminMain.loadBlockedDays();
  await window.AdminMain.loadAppointments();
},

  async toggleSelectedDayBlock() {
  const date = window.AdminDOM.adminDate.value;

  if (!date) {
    window.AdminUI.setMessage("Elegí una fecha.");
    return;
  }

  const isBlocked = (window.AdminState.blockedDays || []).includes(date);

  if (isBlocked) {
    await window.AdminMain.unblockSelectedDay();
  } else {
    window.AdminUI.openBlockReasonModal(date);
  }
},

  bindEvents() {
    window.AdminDOM.btnLogin.addEventListener("click", window.AdminMain.login);

    window.AdminDOM.adminUsername.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    window.AdminMain.login();
  }
});

window.AdminDOM.adminPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    window.AdminMain.login();
  }
});

    window.AdminDOM.btnLogout.addEventListener("click", window.AdminMain.logout);
    window.AdminDOM.btnLoadAppointments.addEventListener("click", window.AdminMain.loadAppointments);

    window.AdminDOM.btnBlockDay.addEventListener("click", window.AdminMain.toggleSelectedDayBlock);

    window.AdminDOM.adminDate.addEventListener("change", async () => {
      window.AdminUI.updateBlockDayButton();
      await window.AdminMain.loadAppointments();
    });

    document.addEventListener("click", (e) => {
      const cancelBtn = e.target.closest(".btn-cancel-appointment");
      if (cancelBtn) {
        const id = Number(cancelBtn.dataset.id);
        if (id) window.AdminUI.openCancelAppointmentModal(id);;
      }

      const confirmBtn = e.target.closest(".btn-confirm-payment");
        if (confirmBtn) {
          const id = Number(confirmBtn.dataset.id);
          if (id) window.AdminUI.openConfirmPaymentModal(id);
        }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        window.AdminMain.unblockSelectedDay();
      }
    });

    window.AdminDOM.btnCancelBlockModal.addEventListener("click", () => {
  window.AdminUI.closeBlockReasonModal();
});

window.AdminDOM.btnConfirmBlockModal.addEventListener("click", async () => {
  const reason = window.AdminDOM.blockReasonInput.value.trim();

  await window.AdminMain.blockSelectedDay(reason);
  window.AdminUI.closeBlockReasonModal();
});
window.AdminDOM.btnCancelCancelModal.addEventListener("click", () => {
  window.AdminUI.closeCancelAppointmentModal();
});

window.AdminDOM.btnConfirmCancelModal.addEventListener("click", async () => {
  const id = window.AdminState.pendingCancelAppointmentId;

  if (!id) return;

  window.AdminUI.closeCancelAppointmentModal();
  await window.AdminMain.cancelAppointment(id);
});

window.AdminDOM.btnCancelConfirmPaymentModal.addEventListener("click", () => {
  window.AdminUI.closeConfirmPaymentModal();
});

window.AdminDOM.btnAcceptConfirmPaymentModal.addEventListener("click", async () => {
  const id = window.AdminState.pendingConfirmPaymentId;

  if (!id) return;

  window.AdminUI.closeConfirmPaymentModal();
  await window.AdminMain.confirmPayment(id);
});

  },

  async init() {
  window.AdminUI.showLogin();
  window.AdminMain.bindEvents();

  const saved = window.AdminMain.loadSavedToken();

if (saved) {
  window.AdminState.token = saved;

  const { ok } = await window.AdminAPI.me();

  if (!ok) {
    window.AdminState.token = "";
    window.AdminMain.clearToken();
    window.AdminUI.showLogin();
    return;
  }

  const today = window.AdminMain.getTodayYmd();
  window.AdminUI.showDashboard();
  window.AdminDOM.adminDate.value = today;

  await window.AdminMain.loadBlockedDays();
  await window.AdminMain.loadAppointments();
}
},

  async confirmPayment(id) {
  window.AdminUI.setMessage("Confirmando pago...");

  const { ok, data } = await window.AdminAPI.confirmPayment(id);

  if (!ok) {
    window.AdminUI.setMessage(data.error || "No se pudo confirmar el pago.");
    return;
  }

  window.AdminUI.setMessage("Pago confirmado.");
  await window.AdminMain.loadAppointments();
}
};

window.AdminMain.init();