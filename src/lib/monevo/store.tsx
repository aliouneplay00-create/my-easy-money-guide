import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATEGORIES,
  freePremium,
  initialState,
  type AppState,
  type Category,
  type Goal,
  type Subscription,
  type Transaction,
} from "./types";
import { nextRenewal, type PlanId } from "./billing";

const STORAGE_KEY = "monevo.state.v1";

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function load(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...initialState, ...parsed };
  } catch {
    return initialState;
  }
}

type StoreValue = {
  state: AppState;
  hydrated: boolean;
  setCurrency: (code: string) => void;
  setUserName: (name: string) => void;
  completeOnboarding: (currency: string, name: string) => void;
  setReserve: (amount: number) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  addSubscription: (s: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, s: Omit<Subscription, "id">) => void;
  removeSubscription: (id: string) => void;
  addGoal: (g: Omit<Goal, "id">) => void;
  updateGoal: (id: string, g: Omit<Goal, "id">) => void;
  addToGoal: (id: string, amount: number) => void;
  removeGoal: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  removeCategory: (id: string) => void;
  activatePremium: (plan: PlanId, provider?: string, customerId?: string | null) => void;
  cancelPremium: () => void;
  resetAll: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function MonevoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode */
    }
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: AppState) => AppState) => setState(fn), []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      hydrated,
      setCurrency: (code) => patch((s) => ({ ...s, currency: code })),
      setUserName: (name) => patch((s) => ({ ...s, userName: name })),
      completeOnboarding: (currency, name) =>
        patch((s) => ({ ...s, currency, userName: name, onboarded: true })),
      setReserve: (amount) => patch((s) => ({ ...s, reserve: Math.max(0, amount) })),
      addTransaction: (tx) =>
        patch((s) => ({ ...s, transactions: [{ ...tx, id: makeId() }, ...s.transactions] })),
      updateTransaction: (id, tx) =>
        patch((s) => ({
          ...s,
          transactions: s.transactions.map((t) => (t.id === id ? { ...tx, id } : t)),
        })),
      removeTransaction: (id) =>
        patch((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) })),
      addSubscription: (sub) =>
        patch((s) => ({ ...s, subscriptions: [...s.subscriptions, { ...sub, id: makeId() }] })),
      updateSubscription: (id, sub) =>
        patch((s) => ({
          ...s,
          subscriptions: s.subscriptions.map((x) => (x.id === id ? { ...sub, id } : x)),
        })),
      removeSubscription: (id) =>
        patch((s) => ({ ...s, subscriptions: s.subscriptions.filter((x) => x.id !== id) })),
      addGoal: (g) => patch((s) => ({ ...s, goals: [...s.goals, { ...g, id: makeId() }] })),
      updateGoal: (id, g) =>
        patch((s) => ({ ...s, goals: s.goals.map((x) => (x.id === id ? { ...g, id } : x)) })),
      addToGoal: (id, amount) =>
        patch((s) => ({
          ...s,
          goals: s.goals.map((x) => (x.id === id ? { ...x, saved: Math.max(0, x.saved + amount) } : x)),
        })),
      removeGoal: (id) => patch((s) => ({ ...s, goals: s.goals.filter((x) => x.id !== id) })),
      addCategory: (c) =>
        patch((s) => ({
          ...s,
          customCategories: [...s.customCategories, { ...c, id: `custom-${makeId()}` }],
        })),
      removeCategory: (id) =>
        patch((s) => ({ ...s, customCategories: s.customCategories.filter((c) => c.id !== id) })),
      activatePremium: (plan, provider = "demo", customerId = null) =>
        patch((s) => ({
          ...s,
          premium: {
            active: true,
            plan,
            provider,
            customerId,
            startedAt: new Date().toISOString().slice(0, 10),
            renewsAt: nextRenewal(plan),
          },
        })),
      cancelPremium: () => patch((s) => ({ ...s, premium: { ...freePremium } })),
      resetAll: () => patch((s) => ({ ...initialState, onboarded: true, premium: s.premium })),
    }),
    [state, hydrated, patch],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMonevo() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMonevo must be used inside MonevoProvider");
  return ctx;
}

/** Derived totals */
export function useTotals() {
  const { state } = useMonevo();
  return useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    let income = 0;
    let expense = 0;
    let monthIncome = 0;
    let monthExpense = 0;
    for (const tx of state.transactions) {
      if (tx.type === "income") {
        income += tx.amount;
        if (tx.date.startsWith(ym)) monthIncome += tx.amount;
      } else {
        expense += tx.amount;
        if (tx.date.startsWith(ym)) monthExpense += tx.amount;
      }
    }
    const monthlySubs = state.subscriptions.reduce(
      (sum, s) => sum + (s.frequency === "monthly" ? s.price : s.price / 12),
      0,
    );
    const balance = income - expense;
    return {
      income,
      expense,
      monthIncome,
      monthExpense,
      monthlySubs,
      yearlySubs: monthlySubs * 12,
      balance,
      available: balance - state.reserve,
    };
  }, [state]);
}
