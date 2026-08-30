import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/monevo/Shell";
import {
  Card,
  EmptyState,
  Field,
  GhostButton,
  inputClass,
  PrimaryButton,
  Progress,
  SectionTitle,
  Sheet,
} from "@/components/monevo/ui";
import { formatDate, formatMoney } from "@/lib/monevo/format";
import { useMonevo } from "@/lib/monevo/store";
import type { Goal } from "@/lib/monevo/types";

export const Route = createFileRoute("/objectifs")({
  head: () => ({
    meta: [
      { title: "Objectifs d'épargne — Monevo" },
      {
        name: "description",
        content: "Créez des objectifs d'épargne, suivez leur progression et le montant restant.",
      },
      { property: "og:title", content: "Objectifs d'épargne — Monevo" },
      { property: "og:description", content: "Progression, pourcentage atteint et montant restant." },
    ],
  }),
  component: GoalsPage,
});

type Draft = Omit<Goal, "id">;

function GoalForm({ initial, onSubmit }: { initial?: Draft; onSubmit: (g: Draft) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [target, setTarget] = useState(initial ? String(initial.target) : "");
  const [saved, setSaved] = useState(initial ? String(initial.saved) : "0");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [error, setError] = useState("");

  return (
    <div className="space-y-4">
      <Field label="Nom de l'objectif">
        <input
          className={inputClass}
          value={name}
          maxLength={50}
          placeholder="Vacances, ordinateur…"
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field label="Montant cible">
        <input
          className={inputClass}
          inputMode="decimal"
          value={target}
          placeholder="0"
          onChange={(e) => setTarget(e.target.value)}
        />
      </Field>
      <Field label="Déjà économisé">
        <input
          className={inputClass}
          inputMode="decimal"
          value={saved}
          onChange={(e) => setSaved(e.target.value)}
        />
      </Field>
      <Field label="Date cible (optionnel)">
        <input
          type="date"
          className={inputClass}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </Field>
      {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
      <PrimaryButton
        onClick={() => {
          const t = Number(target.replace(",", "."));
          const s = Number(saved.replace(",", ".")) || 0;
          if (!name.trim()) return setError("Ajoutez un nom.");
          if (!Number.isFinite(t) || t <= 0) return setError("Montant cible invalide.");
          setError("");
          onSubmit({
            name: name.trim().slice(0, 50),
            target: t,
            saved: Math.max(0, s),
            ...(deadline ? { deadline } : {}),
          });
        }}
      >
        Enregistrer
      </PrimaryButton>
    </div>
  );
}

function AddMoneyForm({ onSubmit }: { onSubmit: (amount: number) => void }) {
  const [amount, setAmount] = useState("");
  return (
    <div className="space-y-4">
      <Field label="Montant à ajouter">
        <input
          className={inputClass}
          inputMode="decimal"
          value={amount}
          placeholder="0"
          onChange={(e) => setAmount(e.target.value)}
        />
      </Field>
      <PrimaryButton
        onClick={() => {
          const v = Number(amount.replace(",", "."));
          if (Number.isFinite(v) && v > 0) onSubmit(v);
        }}
      >
        Ajouter
      </PrimaryButton>
    </div>
  );
}

function GoalsPage() {
  const { state, addGoal, updateGoal, addToGoal, removeGoal } = useMonevo();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [funding, setFunding] = useState<string | null>(null);
  const cur = state.currency;
  const editingGoal = state.goals.find((g) => g.id === editing);

  return (
    <Shell>
      <h1 className="font-display text-2xl font-semibold">Objectifs d'épargne</h1>

      <div className="mt-4">
        <PrimaryButton onClick={() => setAdding(true)}>+ Créer un objectif</PrimaryButton>
      </div>

      <section className="mt-6">
        <SectionTitle>Mes objectifs</SectionTitle>
        <div className="mt-3 space-y-3">
          {state.goals.length === 0 ? (
            <EmptyState icon="🎯" text="Aucun objectif pour l'instant." />
          ) : (
            state.goals.map((g) => {
              const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0;
              const remaining = Math.max(0, g.target - g.saved);
              return (
                <Card key={g.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold">{g.name}</p>
                    <p className="font-display text-sm font-semibold text-brand">{pct}%</p>
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {formatMoney(g.saved, cur)} / {formatMoney(g.target, cur)} · reste{" "}
                    {formatMoney(remaining, cur)}
                  </p>
                  {g.deadline ? (
                    <p className="text-[11px] text-ink/40">Échéance : {formatDate(g.deadline)}</p>
                  ) : null}
                  <div className="mt-3">
                    <Progress value={pct} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <GhostButton onClick={() => setFunding(g.id)}>+ Ajouter de l'argent</GhostButton>
                    <GhostButton onClick={() => setEditing(g.id)}>Modifier</GhostButton>
                    <GhostButton onClick={() => removeGoal(g.id)}>Supprimer</GhostButton>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>

      <Sheet open={adding} title="Créer un objectif" onClose={() => setAdding(false)}>
        <GoalForm
          onSubmit={(g) => {
            addGoal(g);
            setAdding(false);
          }}
        />
      </Sheet>

      <Sheet open={!!editingGoal} title="Modifier l'objectif" onClose={() => setEditing(null)}>
        {editingGoal ? (
          <GoalForm
            initial={editingGoal}
            onSubmit={(g) => {
              updateGoal(editingGoal.id, g);
              setEditing(null);
            }}
          />
        ) : null}
      </Sheet>

      <Sheet open={!!funding} title="Ajouter de l'argent" onClose={() => setFunding(null)}>
        <AddMoneyForm
          onSubmit={(amount) => {
            if (funding) addToGoal(funding, amount);
            setFunding(null);
          }}
        />
      </Sheet>
    </Shell>
  );
}
