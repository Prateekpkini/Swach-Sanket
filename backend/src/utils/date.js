// Returns YYYY-MM-DD string in Asia/Kolkata for a given Date or now.
export const toISTDateKey = (dateInput = new Date()) => {
  const date = new Date(dateInput);
  // Convert to IST by using locale string with timeZone
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const y = parts.find(p => p.type === "year").value;
  const m = parts.find(p => p.type === "month").value;
  const d = parts.find(p => p.type === "day").value;
  return `${y}-${m}-${d}`;
};
