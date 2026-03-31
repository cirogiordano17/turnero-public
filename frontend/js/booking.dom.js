window.BookingDOM = {
  servicesEl: document.querySelector("#services"),

  
  monthLabel: document.querySelector("#monthLabel"),
  nextMonthLabel: document.querySelector("#nextMonthLabel"),
  dayStrip: document.querySelector("#dayStrip"),
  btnPrev: document.querySelector("#prevDays"),
  btnNext: document.querySelector("#nextDays"),

  dateEl: document.querySelector("#date"),
  slotHidden: document.querySelector("#slot"),

  slotsMorning: document.querySelector("#slotsMorning"),
  slotsAfternoon: document.querySelector("#slotsAfternoon"),
  slotsNight: document.querySelector("#slotsNight"),

  availNote: document.querySelector("#availNote"),
  errEl: document.querySelector("#error"),
  okEl: document.querySelector("#ok"),
  btnBook: document.querySelector("#btnBook"),
  sumTotalMin: document.querySelector("#sumTotalMin"),
  sumDate: document.querySelector("#sumDate"),
  sumStart: document.querySelector("#sumStart"),
  sumEnd: document.querySelector("#sumEnd"),
  sumServices: document.querySelector("#sumServices"),
  bookingFormBlock: document.querySelector("#bookingFormBlock"),
  bookingSuccessBlock: document.querySelector("#bookingSuccessBlock"),
  btnBookAnother: document.querySelector("#btnBookAnother"),
  blockReasonModal: document.querySelector("#blockReasonModal"),
  sumTotalPrice: document.querySelector("#sumTotalPrice"),
};