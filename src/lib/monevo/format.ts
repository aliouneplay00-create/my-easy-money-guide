import { getCurrency } from "./currencies";

export function formatMoney(amount: number, code: string, opts?: { compactDecimals?: boolean }) {
  const cur = getCurrency(code);
  const decimals = opts?.compactDecimals && Number.isInteger(amount) ? 0 : cur.decimals;
  const n = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return `${n} ${cur.symbol}`;
}

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
