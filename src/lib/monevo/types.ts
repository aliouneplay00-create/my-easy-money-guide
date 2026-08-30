export type TxType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TxType;
  label: string;
  amount: number;
  category: string;
  date: string; // ISO yyyy-mm-dd
};

export type Subscription = {
  id: string;
  name: string;
  price: number;
  frequency: "monthly" | "yearly";
  nextPayment: string; // ISO yyyy-mm-dd
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline?: string;
};

export type AppState = {
  version: 1;
  onboarded: boolean;
  locale: "fr";
  currency: string;
  userName: string;
  reserve: number;
  transactions: Transaction[];
  subscriptions: Subscription[];
  goals: Goal[];
};

export const initialState: AppState = {
  version: 1,
  onboarded: false,
  locale: "fr",
  currency: "EUR",
  userName: "",
  reserve: 0,
  transactions: [],
  subscriptions: [],
  goals: [],
};

export type Category = { id: string; label: string; icon: string };

export const CATEGORIES: Category[] = [
  { id: "food", label: "Nourriture", icon: "🍽️" },
  { id: "transport", label: "Transport", icon: "🚌" },
  { id: "housing", label: "Logement", icon: "🏠" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "leisure", label: "Loisirs", icon: "🎬" },
  { id: "health", label: "Santé", icon: "💊" },
  { id: "bills", label: "Factures", icon: "🧾" },
  { id: "education", label: "Éducation", icon: "📚" },
  { id: "salary", label: "Salaire", icon: "💼" },
  { id: "other", label: "Autres", icon: "✨" },
];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]!;
}
