const API_BASE = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function adminLogin({ username, password }) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "No se pudo iniciar sesión");
  }

  return data;
}

export async function adminMe() {
  const res = await fetch(`${API_BASE}/admin/me`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Sesión inválida");
  }

  return res.json();
}

export async function getAppointmentsByDate(date) {
  const res = await fetch(`${API_BASE}/admin/appointments?date=${date}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los turnos");
  }

  return res.json();
}

export async function cancelAppointment(id) {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo cancelar el turno");
  }

  return res.json().catch(() => ({}));
}

export async function confirmPayment(id) {
  const res = await fetch(
    `${API_BASE}/admin/appointments/${id}/confirm-payment`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo confirmar el pago");
  }

  return res.json().catch(() => ({}));
}

export async function getClosedDays(from, to) {
  const res = await fetch(
    `${API_BASE}/closed-days?from=${from}&to=${to}`,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudieron cargar los días bloqueados");
  }

  return res.json();
}

export async function blockDay(date, reason = "") {
  const res = await fetch(`${API_BASE}/admin/closed-days`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ date, reason }),
  });

  if (!res.ok) {
    throw new Error("No se pudo bloquear el día");
  }

  return res.json().catch(() => ({}));
}

export async function unblockDay(date) {
  const res = await fetch(`${API_BASE}/admin/closed-days/${date}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo desbloquear el día");
  }

  return res.json().catch(() => ({}));
}

export async function getUpcomingAppointments() {
  const res = await fetch(`${API_BASE}/admin/appointments/upcoming`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los próximos turnos");
  }

  return res.json();
}

export async function getHistoryAppointments() {
  const res = await fetch(`${API_BASE}/admin/appointments/history`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo cargar el historial");
  }

  return res.json();
}