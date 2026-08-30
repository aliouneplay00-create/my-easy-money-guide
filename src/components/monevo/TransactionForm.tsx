import { useState } from "react";
import { CATEGORIES, type Transaction } from "@/lib/monevo/types";
import { todayISO } from "@/lib/monevo/format";
import { Field, inputClass, PrimaryButton } from "./ui";

export type TxDraft = Omit<Transaction, "id">;

export function TransactionForm({
  initial,
  onSubmit,
}: {
  initial?: TxDraft;
  onSubmit: (tx: TxDraft) => void;
}) {
  const [type, setType] = useState<TxDraft["type"]>(initial?.type ?? "expense");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial?.category ?? "food");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [error, setError] = useState("");

  function submit() {
    const value = Number(amount.replace(",", "."));
    if (!label.trim()) return setError("Ajoutez un nom.");
    if (!Number.isFinite(value) || value <= 0) return setError("Montant invalide.");
    setError("");
    onSubmit({
      type,
      label: label.trim().slice(0, 60),
      amount: Math.round(value * 100) / 100,
      category,
      date,
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-sand p-1">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-xl py-3 text-sm font-bold transition-colors ${
              type === t ? "bg-card text-brand shadow-sm" : "text-ink/50"
            }`}
          >
            {t === "expense" ? "Dépense" : "Revenu"}
          </button>
        ))}
      </div>

      <Field label="Nom">
        <input
          className={inputClass}
          value={label}
          maxLength={60}
          placeholder="Courses, salaire…"
          onChange={(e) => setLabel(e.target.value)}
        />
      </Field>

      <Field label="Montant">
        <input
          className={inputClass}
          inputMode="decimal"
          value={amount}
          placeholder="0"
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>

      <Field label="Catégorie">
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-xl px-2 py-3 text-center text-[11px] font-semibold transition-colors ${
                category === c.id ? "bg-brand text-cream" : "bg-card text-ink/60"
              }`}
            >
              <span className="block text-base">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Date">
        <input
          type="date"
          className={inputClass}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>

      {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

      <PrimaryButton onClick={submit}>Enregistrer</PrimaryButton>
    </div>
  );
}
