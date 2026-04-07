export function formatDateISO(value) {
  const date = value instanceof Date ? value : new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function getWeekDays(startDate, amount = 5) {
  return Array.from({ length: amount }, (_, i) => addDays(startDate, i));
}

export function formatMonthLabel(date) {
  return date.toLocaleDateString("es-AR", {
    month: "long",
  });
}

export function formatDayName(date) {
  return date.toLocaleDateString("es-AR", {
    weekday: "short",
  }).replace(".", "");
}

export function formatDayNumber(date) {
  return date.getDate();
}

export function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatDateLong(dateString) {
  if (!dateString) return "—";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}