function isYmd(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(date));
}

function toIntId(x) {
  const n = Number(x);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function parseServiceIds(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}

module.exports = { isYmd, toIntId, parseServiceIds };