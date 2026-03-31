window.AdminAPI = {
  getToken() {
    return window.AdminState.token || "";
  },

  setToken(token) {
    window.AdminState.token = token || "";
    localStorage.setItem(window.AdminConfig.STORAGE_KEY, window.AdminState.token);
  },

  clearToken() {
    window.AdminState.token = "";
    localStorage.removeItem(window.AdminConfig.STORAGE_KEY);
  },

  getAuthHeaders(includeJson = false) {
    const headers = {};

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  },

  async login(username, password) {
    const res = await fetch(`${window.AdminConfig.API_BASE}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  },

  async me() {
    const res = await fetch(`${window.AdminConfig.API_BASE}/api/admin/me`, {
      headers: this.getAuthHeaders(),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      this.clearToken();
    }

    return { ok: res.ok, data };
  },

  async getAppointmentsByDate(date) {
    const res = await fetch(
      `${window.AdminConfig.API_BASE}/api/admin/appointments?date=${encodeURIComponent(date)}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      this.clearToken();
    }

    return { ok: res.ok, data };
  },

  async getClosedDays(from, to) {
    const res = await fetch(
      `${window.AdminConfig.API_BASE}/api/closed-days?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );

    const data = await res.json().catch(() => ([]));
    return { ok: res.ok, data };
  },

  async cancelAppointment(id) {
    const res = await fetch(
      `${window.AdminConfig.API_BASE}/api/admin/appointments/${id}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      this.clearToken();
    }

    return { ok: res.ok, data };
  },

  async blockDay(date, reason = "") {
    const res = await fetch(
      `${window.AdminConfig.API_BASE}/api/admin/closed-days`,
      {
        method: "POST",
        headers: this.getAuthHeaders(true),
        body: JSON.stringify({ date, reason }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      this.clearToken();
    }

    return { ok: res.ok, data };
  },

  async unblockDay(date) {
    const res = await fetch(
      `${window.AdminConfig.API_BASE}/api/admin/closed-days/${encodeURIComponent(date)}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      this.clearToken();
    }

    return { ok: res.ok, data };
  },

  async confirmPayment(id) {
    const res = await fetch(
      `${window.AdminConfig.API_BASE}/api/admin/appointments/${id}/confirm-payment`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      this.clearToken();
    }

    return { ok: res.ok, data };
  },
};