/**
 * Couche de facturation Monevo Premium.
 *
 * V1 : le statut d'abonnement est stocké localement (localStorage) et la
 * "souscription" se fait en mode démonstration. Toute la logique de paiement
 * est isolée ici pour pouvoir brancher un prestataire sécurisé (Paddle/Stripe)
 * sans toucher au reste de l'application :
 *
 *   1. Activer les paiements intégrés (plan payant requis) + Lovable Cloud.
 *   2. Remplacer `startCheckout` par un appel serveur qui crée une session de
 *      paiement et redirige vers l'URL renvoyée.
 *   3. Un webhook du prestataire met à jour le statut de l'abonnement
 *      (`subscription.activated`, `subscription.canceled`, `payment.failed`).
 *   4. `fetchSubscriptionStatus` lira alors le statut réel côté serveur.
 */

export type PlanId = "monthly" | "yearly";

export type Plan = {
  id: PlanId;
  label: string;
  price: number;
  currency: string;
  period: string;
  note?: string;
  /** Identifiant du prix chez le prestataire de paiement (à remplir plus tard). */
  priceId: string | null;
};

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    label: "Mensuel",
    price: 1000,
    currency: "XOF",
    period: "par mois",
    priceId: null,
  },
  yearly: {
    id: "yearly",
    label: "Annuel",
    price: 10000,
    currency: "XOF",
    period: "par an",
    note: "2 mois offerts",
    priceId: null,
  },
};

export const PREMIUM_BENEFITS = [
  { icon: "📊", title: "Statistiques avancées", text: "Graphiques détaillés de vos revenus et dépenses." },
  { icon: "💰", title: "Budgets illimités", text: "Créez autant de budgets et d'abonnements que vous voulez." },
  { icon: "🎯", title: "Objectifs avancés", text: "Objectifs illimités, suivi détaillé et personnalisation." },
  { icon: "🏷️", title: "Catégories personnalisées", text: "Créez vos propres catégories de dépenses et de revenus." },
  { icon: "📅", title: "Historique et analyses", text: "Comparez vos dépenses et revenus mois par mois." },
  { icon: "📤", title: "Exportation des données", text: "Exportez vos transactions et vos statistiques." },
  { icon: "💡", title: "Conseils personnalisés", text: "Des recommandations basées sur vos habitudes réelles." },
] as const;

export const FREE_LIMITS = { goals: 1, subscriptions: 3, customCategories: 0 } as const;

export type CheckoutResult =
  | { status: "activated"; plan: PlanId; provider: string }
  | { status: "redirect"; url: string }
  | { status: "error"; message: string };

/** Point d'entrée unique du paiement. Remplacer le contenu par l'appel serveur. */
export async function startCheckout(plan: PlanId): Promise<CheckoutResult> {
  const priceId = PLANS[plan].priceId;
  if (priceId) {
    // TODO : appeler la fonction serveur de création de session de paiement
    // et renvoyer { status: "redirect", url } vers la page sécurisée.
    return { status: "error", message: "Paiement non configuré." };
  }
  // Mode démonstration : activation immédiate, sans argent réel.
  await new Promise((r) => setTimeout(r, 600));
  return { status: "activated", plan, provider: "demo" };
}

/** Prochaine échéance calculée localement (remplacée par la date du prestataire). */
export function nextRenewal(plan: PlanId, from = new Date()): string {
  const d = new Date(from);
  if (plan === "monthly") d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
