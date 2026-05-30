const API_BASE = import.meta.env.VITE_API_URL;

function getStoredAdminToken() {
  return (
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken")
  );
}

function getAuthHeaders() {
  const token = getStoredAdminToken();

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


export async function rescheduleAppointment(id, date, startHhmm) {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}/reschedule`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ date, start_hhmm: startHhmm }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No se pudo reprogramar el turno");
  }

  return data;
}

export async function getAvailability(date, serviceIds = [1]) {
  const res = await fetch(
    `${API_BASE}/availability?date=${date}&service_ids=${serviceIds.join(",")}`
  );

  if (!res.ok) {
    throw new Error("No se pudo cargar disponibilidad");
  }

  return res.json();
}

export async function getClosedDays(from, to) {
  const res = await fetch(
    `${API_BASE}/admin/closed-days?from=${from}&to=${to}`,
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

export function connectAdminEvents({ onAppointmentCreated, onError }) {
  const token = getStoredAdminToken();

  if (!token) return null;

  const eventsUrl = `${API_BASE}/admin/events?token=${encodeURIComponent(token)}`;
  const source = new EventSource(eventsUrl);

  source.addEventListener("appointment_created", (event) => {
    try {
      const data = JSON.parse(event.data);
      onAppointmentCreated?.(data);
    } catch (err) {
      console.error("Error parseando evento SSE:", err);
    }
  });

  source.onerror = (err) => {
    onError?.(err);
  };

  return source;
}


export async function getAdminServices() {
  const res = await fetch(`${API_BASE}/admin/services`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los servicios");
  }

  return res.json();
}

export async function createAdminService(payload) {
  const res = await fetch(`${API_BASE}/admin/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No se pudo crear el servicio");
  }

  return data;
}

export async function updateAdminService(id, payload) {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No se pudo actualizar el servicio");
  }

  return data;
}

export async function getAllClosedDays() {
  const res = await fetch(`${API_BASE}/admin/closed-days/all`, {
    headers: { ...getAuthHeaders() },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los días bloqueados");
  }

  return res.json();
}

export async function getAllBlockedSlots(date) {
  const url = date
    ? `${API_BASE}/admin/blocked-slots?date=${date}`
    : `${API_BASE}/admin/blocked-slots`;
  const res = await fetch(url, { headers: { ...getAuthHeaders() } });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los horarios bloqueados");
  }

  return res.json();
}

export async function getWorkingHours() {
  const res = await fetch(`${API_BASE}/admin/working-hours`, {
    headers: { ...getAuthHeaders() },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los horarios de trabajo");
  }

  return res.json();
}

export async function createBlockedSlot(payload) {
  const res = await fetch(`${API_BASE}/admin/blocked-slots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No se pudo bloquear el horario");
  }

  return data;
}

export async function deleteBlockedSlot(id) {
  const res = await fetch(`${API_BASE}/admin/blocked-slots/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });

  if (!res.ok) {
    throw new Error("No se pudo eliminar el bloqueo");
  }

  return res.json().catch(() => ({}));
}
