import type { AppState, Category } from "./types";

export type MonthPoint = { ym: string; label: string; income: number; expense: number };
export type CategoryPoint = { id: string; label: string; icon: string; total: number; share: number };

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

export function monthlySeries(state: AppState, months = 6): MonthPoint[] {
  const now = new Date();
  const points: MonthPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    let income = 0;
    let expense = 0;
    for (const tx of state.transactions) {
      if (!tx.date.startsWith(ym)) continue;
      if (tx.type === "income") income += tx.amount;
      else expense += tx.amount;
    }
    points.push({ ym, label: MONTHS[d.getMonth()]!, income, expense });
  }
  return points;
}

export function categoryBreakdown(state: AppState, categories: Category[], ym?: string): CategoryPoint[] {
  const totals = new Map<string, number>();
  let sum = 0;
  for (const tx of state.transactions) {
    if (tx.type !== "expense") continue;
    if (ym && !tx.date.startsWith(ym)) continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
    sum += tx.amount;
  }
  return [...totals.entries()]
    .map(([id, total]) => {
      const cat = categories.find((c) => c.id === id);
      return {
        id,
        label: cat?.label ?? "Autres",
        icon: cat?.icon ?? "✨",
        total,
        share: sum > 0 ? Math.round((total / sum) * 100) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}

/** Conseils financiers personnalisés basés sur les données enregistrées. */
export function buildAdvice(state: AppState, categories: Category[]): { icon: string; text: string }[] {
  const tips: { icon: string; text: string }[] = [];
  const series = monthlySeries(state, 2);
  const prev = series[0];
  const current = series[1];
  const breakdown = categoryBreakdown(state, categories);

  if (current && prev && prev.expense > 0) {
    const diff = Math.round(((current.expense - prev.expense) / prev.expense) * 100);
    if (diff > 10)
      tips.push({ icon: "⚠️", text: `Vos dépenses ont augmenté de ${diff}% par rapport au mois dernier.` });
    else if (diff < -5)
      tips.push({ icon: "🎉", text: `Bravo : ${Math.abs(diff)}% de dépenses en moins que le mois dernier.` });
  }

  const top = breakdown[0];
  if (top && top.share >= 30)
    tips.push({ icon: top.icon, text: `${top.label} représente ${top.share}% de vos dépenses. Un bon poste à optimiser.` });

  if (current && current.income > 0) {
    const rate = Math.round(((current.income - current.expense) / current.income) * 100);
    if (rate < 10)
      tips.push({ icon: "🪙", text: "Vous épargnez moins de 10% de vos revenus ce mois-ci. Visez 10 à 20%." });
    else tips.push({ icon: "💪", text: `Vous mettez de côté environ ${rate}% de vos revenus ce mois-ci.` });
  }

  const monthlySubs = state.subscriptions.reduce(
    (s, x) => s + (x.frequency === "monthly" ? x.price : x.price / 12),
    0,
  );
  if (current && monthlySubs > 0 && current.income > 0 && monthlySubs / current.income > 0.15)
    tips.push({ icon: "🔁", text: "Vos abonnements dépassent 15% de vos revenus. Faites le tri." });

  if (state.reserve === 0)
    tips.push({ icon: "🛟", text: "Aucune réserve imprévus définie. Commencez par un petit montant fixe." });

  if (tips.length === 0)
    tips.push({ icon: "✨", text: "Ajoutez quelques transactions pour recevoir des conseils personnalisés." });

  return tips;
}
