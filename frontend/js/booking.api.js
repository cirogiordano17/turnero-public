window.BookingAPI = {
  async getServices(cat){
    const res = await fetch(`${window.APP.API}/api/services?category=${cat}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getAvailability(date, ids){
    const res = await fetch(`${window.APP.API}/api/availability?date=${date}&service_ids=${ids.join(",")}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async getClosedDays(from, to){
    const res = await fetch(`${window.APP.API}/api/closed-days?from=${from}&to=${to}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async createAppointment(payload){
    const res = await fetch(`${window.APP.API}/api/appointments`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  startAt(date, slot){
    return `${date}T${slot}:00${window.APP.TZ_OFFSET}`;
  }
};