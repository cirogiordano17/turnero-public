window.BookingState = {
  cat: window.BOOKING_CATEGORY || "pelu",
  services: [],
  closedDays: [],
 
  stripStart: (() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  })(),
  CLOSED_WEEKDAYS: new Set([0]) // domingo
};

// helpers
window.BookingHelpers = {
  selectedServiceIds(){
    return Array.from(document.querySelectorAll("input[name=svc]:checked"))
      .map(x => Number(x.value));
  },

  selectedTotalMin(){
    const ids = new Set(window.BookingHelpers.selectedServiceIds());
    return window.BookingState.services
      .filter(s => ids.has(s.id))
      .reduce((acc, s) => acc + Number(s.duration_min), 0);
  },

    selectedTotalPrice(){
    const ids = new Set(window.BookingHelpers.selectedServiceIds());
    return window.BookingState.services
      .filter(s => ids.has(s.id))
      .reduce((acc, s) => acc + Number(s.price || 0), 0);
  },

  ymd(d){
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    return `${yyyy}-${mm}-${dd}`;
  },

  monthName(d){
    return d.toLocaleDateString("es-AR", { month: "long" });
  },

  dowShort(d){
    return d.toLocaleDateString("es-AR", { weekday: "short" })
      .replace(".", "")
      .slice(0,3);
  },

  isPastDay(d){
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today;
  },

  isClosed(d){
  const dateStr = window.BookingHelpers.ymd(d);

  return (
    window.BookingState.CLOSED_WEEKDAYS.has(d.getDay()) ||
    window.BookingState.closedDays.includes(dateStr)
  );
},

  groupSlot(hhmm){
    const [h, m] = hhmm.split(":").map(Number);
    const mins = h*60+m;
    if (mins < 13*60) return "morning";
    if (mins < 18*60) return "afternoon";
    return "night";
  },

    addMinutesHHmm(hhmm, minutes){
    if(!hhmm) return "";
    const [h,m] = hhmm.split(":").map(Number);
    const total = h*60 + m + Number(minutes || 0);
    const hh = String(Math.floor((total % (24*60)) / 60)).padStart(2,"0");
    const mm = String(total % 60).padStart(2,"0");
    return `${hh}:${mm}`;
  },
};