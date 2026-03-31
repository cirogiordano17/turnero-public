window.AdminDOM = {
  loginView: document.querySelector("#loginView"),
  dashboardView: document.querySelector("#dashboardView"),

  adminUsername: document.getElementById("adminUsername"),
  adminPassword: document.getElementById("adminPassword"),
  btnLogin: document.querySelector("#btnLogin"),
  loginError: document.querySelector("#loginError"),

  btnLogout: document.querySelector("#btnLogout"),

  adminDate: document.querySelector("#adminDate"),
  btnLoadAppointments: document.querySelector("#btnLoadAppointments"),
  btnBlockDay: document.querySelector("#btnBlockDay"),

  selectedDateText: document.querySelector("#selectedDateText"),
  appointmentsCount: document.querySelector("#appointmentsCount"),
  adminMessage: document.querySelector("#adminMessage"),
  appointmentsList: document.querySelector("#appointmentsList"),

  blockedDaysList: document.querySelector("#blockedDaysList"),

  blockReasonModal: document.querySelector("#blockReasonModal"),
  blockReasonInput: document.querySelector("#blockReasonInput"),
  btnCancelBlockModal: document.querySelector("#btnCancelBlockModal"),
  btnConfirmBlockModal: document.querySelector("#btnConfirmBlockModal"),

  cancelAppointmentModal: document.getElementById("cancelAppointmentModal"),
  btnCancelCancelModal: document.getElementById("btnCancelCancelModal"),
  btnConfirmCancelModal: document.getElementById("btnConfirmCancelModal"),

  confirmPaymentModal: document.querySelector("#confirmPaymentModal"),
  btnCancelConfirmPaymentModal: document.querySelector("#btnCancelConfirmPaymentModal"),
  btnAcceptConfirmPaymentModal: document.querySelector("#btnAcceptConfirmPaymentModal"),
  
};