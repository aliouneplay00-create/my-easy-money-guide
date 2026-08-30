// Simple i18n layer. Add a new locale by adding an entry to `dictionaries`.
export type Locale = "fr";

export const LOCALES: { code: Locale; label: string; available: boolean }[] = [
  { code: "fr", label: "Français", available: true },
];

const fr = {
  appName: "Monevo",
  nav: {
    home: "Accueil",
    transactions: "Transact.",
    subscriptions: "Abonn.",
    goals: "Objectifs",
    settings: "Paramètres",
  },
  common: {
    add: "Ajouter",
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    seeAll: "Tout voir",
    name: "Nom",
    amount: "Montant",
    date: "Date",
    category: "Catégorie",
    empty: "Rien pour le moment",
  },
} as const;

const dictionaries: Record<Locale, typeof fr> = { fr };

export function t(locale: Locale = "fr") {
  return dictionaries[locale];
}
