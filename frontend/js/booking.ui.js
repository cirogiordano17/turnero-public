window.BookingUI = {
  resetMsg(){
    const { errEl, okEl, availNote } = window.BookingDOM;
    if(errEl) errEl.textContent = "";
    if(okEl) okEl.textContent = "";
    if(availNote) availNote.textContent = "";
  },

  

  clearSlots(){
    const { slotsMorning, slotsAfternoon, slotsNight, slotHidden } = window.BookingDOM;
    slotsMorning.innerHTML = "";
    slotsAfternoon.innerHTML = "";
    slotsNight.innerHTML = "";
    slotHidden.value = "";
  },

  renderServices(){
    const { servicesEl } = window.BookingDOM;
    const services = window.BookingState.services;

    servicesEl.innerHTML = "";
    services.forEach(s => {
      const label = document.createElement("label");
      label.className = "svc rounded p-2 d-flex align-items-center gap-2";
      label.innerHTML = `
        <div class="svc-inner">
          <input class="form-check-input m-0" type="checkbox" name="svc" value="${s.id}">
          <div class="flex-grow-1">
            <div class="fw-semibold">${s.name}</div>
            <div class="muted small">
              ${s.duration_min} min · $${Number(s.price || 0).toLocaleString("es-AR")}
            </div>
          </div>
        </div>
      `;
      servicesEl.appendChild(label);
    });

  
  },

  renderDayStrip(){
    const { dayStrip, monthLabel, nextMonthLabel, dateEl } = window.BookingDOM;
    const { stripStart } = window.BookingState;
    const { ymd, monthName, dowShort, isPastDay, isClosed } = window.BookingHelpers;

    dayStrip.innerHTML = "";
    const visibleDays = window.innerWidth < 768 ? 7 : 7;

    const first = new Date(stripStart);
    const activeMonth = monthName(first).replace(/^./, c => c.toUpperCase());
    monthLabel.textContent = activeMonth;

    let secondMonthDate = null;

    for (let i=0; i<visibleDays; i++){
      const d = new Date(stripStart);
      d.setDate(stripStart.getDate() + i);

      if(!secondMonthDate && d.getMonth() !== first.getMonth()){
        secondMonthDate = d;
      }

      const btn = document.createElement("div");
      btn.className = "day-btn";
      btn.innerHTML = `
        <div class="dow">${dowShort(d)}</div>
        <div class="dom">${d.getDate()}</div>
      `;

      if(isPastDay(d) || isClosed(d)) btn.classList.add("disabled");

      const dateStr = ymd(d);
      if(dateEl.value === dateStr) btn.classList.add("active");

      btn.addEventListener("click", () => {
        if (btn.classList.contains("disabled")) return;

        dateEl.value = dateStr;
        Array.from(dayStrip.querySelectorAll(".day-btn")).forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        window.BookingMain.loadAvailability();
      });

      dayStrip.appendChild(btn);
    }

    if(nextMonthLabel){
      if(secondMonthDate){
        nextMonthLabel.textContent = monthName(secondMonthDate).replace(/^./, c => c.toUpperCase());
        nextMonthLabel.style.display = "block";
      }else{
        nextMonthLabel.textContent = "";
        nextMonthLabel.style.display = "none";
      }
    }
  },

  renderSlots(slots){
    const { slotsMorning, slotsAfternoon, slotsNight, slotHidden } = window.BookingDOM;
    const { groupSlot } = window.BookingHelpers;

    window.BookingUI.clearSlots();

    slots.forEach(hhmm => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline-light btn-sm";
      btn.textContent = hhmm;

      btn.addEventListener("click", () => {
        document.querySelectorAll(".slots-grid .btn").forEach(b => {
          b.classList.remove("btn-success");
          b.classList.add("btn-outline-light");
        });
        btn.classList.remove("btn-outline-light");
        btn.classList.add("btn-success");
        slotHidden.value = hhmm;
      });

      const grp = groupSlot(hhmm);
      if(grp === "morning") slotsMorning.appendChild(btn);
      else if(grp === "afternoon") slotsAfternoon.appendChild(btn);
      else slotsNight.appendChild(btn);
    });
  },

    renderSummary(){
    const {
      sumTotalMin, sumDate, sumStart, sumEnd, sumServices,
      dateEl, slotHidden
    } = window.BookingDOM;

    if(!sumServices) return; // por si no está en otra página

    const ids = new Set(window.BookingHelpers.selectedServiceIds());
    const selected = window.BookingState.services.filter(s => ids.has(s.id));

    const totalMin = window.BookingHelpers.selectedTotalMin();
    const totalPrice = window.BookingHelpers.selectedTotalPrice();

    if(window.BookingDOM.sumTotalPrice){
        window.BookingDOM.sumTotalPrice.textContent =
        totalPrice ? `$${totalPrice.toLocaleString("es-AR")}` : "—";
      }
    if(sumTotalMin) sumTotalMin.textContent = totalMin ? `${totalMin} min` : "—";

    // Fecha
    const date = dateEl?.value || "";
    if(sumDate){
      if(!date) sumDate.textContent = "—";
      else{
        const [y,mo,d] = date.split("-").map(Number);
        const dt = new Date(y, mo-1, d);
        sumDate.textContent = dt.toLocaleDateString("es-AR", { day:"2-digit", month:"long", year:"numeric" });
      }
    }

    // Horario
    const start = slotHidden?.value || "";
    if(sumStart) sumStart.textContent = start || "—";

    const end = (start && totalMin)
      ? window.BookingHelpers.addMinutesHHmm(start, totalMin)
      : "";
    if(sumEnd) sumEnd.textContent = end || "—";

    // Servicios
    if(selected.length === 0){
      sumServices.textContent = "Elegí servicios.";
      return;
    }

    sumServices.innerHTML = "";
    selected.forEach(s => {
      const row = document.createElement("div");
      row.className = "sum-svc";
      row.innerHTML = `
        <div>
          <div class="name">${s.name}</div>
          <div class="meta">
            ${s.duration_min} min · $${Number(s.price || 0).toLocaleString("es-AR")}
          </div>
        </div>
        <div class="meta">✓</div>
      `;
      sumServices.appendChild(row);
    });
  },
    showSuccess(){
    const { bookingFormBlock, bookingSuccessBlock } = window.BookingDOM;
    if (bookingFormBlock) bookingFormBlock.classList.add("d-none");
    if (bookingSuccessBlock) bookingSuccessBlock.classList.remove("d-none");
  },

  resetBookingFlow(){
    const {
      bookingFormBlock,
      bookingSuccessBlock,
      errEl,
      okEl,
      dateEl,
      slotHidden,
      first_name,
      last_name,
      whatsapp,
      email,
      comment
    } = window.BookingDOM;

    if (bookingSuccessBlock) bookingSuccessBlock.classList.add("d-none");
    if (bookingFormBlock) bookingFormBlock.classList.remove("d-none");

    if (errEl) errEl.textContent = "";
    if (okEl) okEl.textContent = "";

    // limpiar inputs de datos
    const ids = ["first_name", "last_name", "whatsapp", "email", "comment"];
    ids.forEach(id => {
      const el = document.querySelector(`#${id}`);
      if (el) el.value = "";
    });

    // limpiar servicios seleccionados
    document.querySelectorAll("input[name=svc]:checked").forEach(el => {
      el.checked = false;
    });

    // limpiar fecha y horario
    if (dateEl) dateEl.value = "";
    if (slotHidden) slotHidden.value = "";

    // limpiar slots renderizados
    window.BookingUI.clearSlots();

    // limpiar resumen
    if (window.BookingDOM.sumDate) window.BookingDOM.sumDate.textContent = "—";
    if (window.BookingDOM.sumStart) window.BookingDOM.sumStart.textContent = "—";
    if (window.BookingDOM.sumEnd) window.BookingDOM.sumEnd.textContent = "—";
    if (window.BookingDOM.sumTotalMin) window.BookingDOM.sumTotalMin.textContent = "—";
    if (window.BookingDOM.sumServices) window.BookingDOM.sumServices.textContent = "Elegí servicios.";

    // re-render base
    window.BookingUI.renderDayStrip();
    window.BookingMain.loadAvailability();
  },
};