window.BookingMain = {
  async loadServices(){
    const { servicesEl, errEl } = window.BookingDOM;

    servicesEl.innerHTML = "Cargando...";
    try{
      window.BookingState.services = await window.BookingAPI.getServices(window.BookingState.cat);
      window.BookingUI.renderServices();
    }catch(e){
      servicesEl.innerHTML = "No se pudieron cargar los servicios.";
      errEl.textContent = "Error cargando servicios. ¿Backend levantado?";
    }
  },

  async loadClosedDays(){
    const { ymd } = window.BookingHelpers;
    const { stripStart } = window.BookingState;

    const from = ymd(stripStart);

    const toDate = new Date(stripStart);
    toDate.setDate(toDate.getDate() + 6);
    const to = ymd(toDate);

    try{
      window.BookingState.closedDays = await window.BookingAPI.getClosedDays(from, to);
      console.log("CLOSED DAYS =>", window.BookingState.closedDays);
    }catch(e){
      console.error("LOAD CLOSED DAYS ERROR =>", e);
      window.BookingState.closedDays = [];
    }
  },

  async loadAvailability(){
  const { dateEl, availNote } = window.BookingDOM;
  const ids = window.BookingHelpers.selectedServiceIds();
  const date = dateEl.value;

  console.log("LOAD AVAILABILITY =>", { date, ids });

  window.BookingUI.resetMsg();
  window.BookingUI.clearSlots();
  window.BookingUI.renderSummary();

  if(!date || ids.length === 0){
    availNote.textContent = "Elegí al menos 1 servicio y una fecha.";
    return;
  }

  try{
    const slots = await window.BookingAPI.getAvailability(date, ids);
    console.log("SLOTS RESPONSE =>", slots);

    if(!Array.isArray(slots) || slots.length === 0){
      availNote.textContent = "No hay horarios disponibles para esa combinación.";
      return;
    }

    window.BookingUI.renderSlots(slots);
  }catch(e){
    console.error("LOAD AVAILABILITY ERROR =>", e);
    availNote.textContent = "No se pudo cargar disponibilidad. ¿Backend levantado?";
  }
},
  async refreshAvailabilitySilently(){
    const { dateEl, availNote } = window.BookingDOM;
    const ids = window.BookingHelpers.selectedServiceIds();
    const date = dateEl.value;

    if(!date || ids.length === 0) return;

    try{
      const slots = await window.BookingAPI.getAvailability(date, ids);

      if(!Array.isArray(slots) || slots.length === 0){
        window.BookingUI.clearSlots();
        if (availNote) {
          availNote.textContent = "No hay horarios disponibles para esa combinación.";
        }
        return;
      }

      window.BookingUI.renderSlots(slots);
    }catch(e){
      console.error("REFRESH AVAILABILITY ERROR =>", e);
    }
  },

  async book(){
    const { dateEl, slotHidden, btnBook, errEl, okEl } = window.BookingDOM;

    window.BookingUI.resetMsg();

    const ids = window.BookingHelpers.selectedServiceIds();
    const date = dateEl.value;
    const slot = slotHidden.value;

    const first_name = document.querySelector("#first_name")?.value.trim();
    const last_name = document.querySelector("#last_name")?.value.trim();
    const whatsapp = document.querySelector("#whatsapp")?.value.trim();
    const email = document.querySelector("#email")?.value.trim();
    const comment = document.querySelector("#comment")?.value.trim();

    if(!first_name || !last_name || !whatsapp){
      errEl.textContent = "Nombre, apellido y WhatsApp son obligatorios.";
      return;
    }
    if(!date){ errEl.textContent = "Elegí una fecha."; return; }
    if(ids.length === 0){ errEl.textContent = "Elegí al menos un servicio."; return; }
    if(!slot){ errEl.textContent = "Elegí un horario disponible."; return; }

    const start_at = window.BookingAPI.startAt(date, slot);

    btnBook.disabled = true;
    btnBook.textContent = "Guardando...";

    try{
      const { ok, data } = await window.BookingAPI.createAppointment({
        first_name, last_name, whatsapp,
        email: email || null,
        comment: comment || null,
        service_ids: ids,
        start_at,
        category: window.BookingState.cat
      });

      if(!ok){
        errEl.textContent = data.error || "Error al reservar.";
        await window.BookingMain.loadAvailability();
        return;
      }

      await window.BookingMain.refreshAvailabilitySilently();
      window.BookingUI.showSuccess();
      document.querySelector("#bookingSuccessBlock")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }catch(e){
      errEl.textContent = "Error de red. ¿Está levantado el backend?";
    }finally{
      btnBook.disabled = false;
      btnBook.textContent = "Confirmar turno";
    }
  },

  async weekNav(delta){
    const s = window.BookingState.stripStart;
    s.setDate(s.getDate() + delta);

    const today = new Date();
    today.setHours(0,0,0,0);

    if(s < today) window.BookingState.stripStart = today;

    await window.BookingMain.loadClosedDays();
    window.BookingUI.renderDayStrip();
    window.BookingMain.loadAvailability();
  },

  async init(){
    const { servicesEl, btnPrev, btnNext, btnBook } = window.BookingDOM;

    servicesEl.addEventListener("change", window.BookingMain.loadAvailability);
    btnPrev.addEventListener("click", () => window.BookingMain.weekNav(-7));
    btnNext.addEventListener("click", () => window.BookingMain.weekNav(7));
    btnBook.addEventListener("click", window.BookingMain.book);

    window.addEventListener("resize", window.BookingUI.renderDayStrip);

    await window.BookingMain.loadClosedDays();
    window.BookingUI.renderDayStrip();
    window.BookingMain.loadServices();
    document.addEventListener("click", (e) => {
      if(e.target && e.target.matches(".slots-grid .btn")){
    // el click real ya lo maneja BookingUI (marca el slot)
    // esto fuerza resumen al toque
    setTimeout(() => window.BookingUI.renderSummary(), 0);}
});
    const { btnBookAnother } = window.BookingDOM;

    if (btnBookAnother) {
      btnBookAnother.addEventListener("click", () => {
        window.BookingUI.resetBookingFlow();
      });
}
  }
  
};

// auto init
window.BookingMain.init();