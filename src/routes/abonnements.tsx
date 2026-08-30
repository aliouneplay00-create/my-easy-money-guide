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
  SectionTitle,
  Sheet,
} from "@/components/monevo/ui";
import { formatDate, formatMoney, todayISO } from "@/lib/monevo/format";
import { useMonevo, useTotals } from "@/lib/monevo/store";
import type { Subscription } from "@/lib/monevo/types";

export const Route = createFileRoute("/abonnements")({
  head: () => ({
    meta: [
      { title: "Mes abonnements — Monevo" },
      {
        name: "description",
        content: "Suivez vos abonnements récurrents et leur coût mensuel et annuel estimé.",
      },
      { property: "og:title", content: "Mes abonnements — Monevo" },
      { property: "og:description", content: "Coût mensuel et annuel de vos abonnements en un coup d'œil." },
    ],
  }),
  component: SubscriptionsPage,
});

type Draft = Omit<Subscription, "id">;

function SubForm({ initial, onSubmit }: { initial?: Draft; onSubmit: (s: Draft) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [frequency, setFrequency] = useState<Draft["frequency"]>(initial?.frequency ?? "monthly");
  const [nextPayment, setNextPayment] = useState(initial?.nextPayment ?? todayISO());
  const [error, setError] = useState("");

  return (
    <div className="space-y-4">
      <Field label="Nom du service">
        <input
          className={inputClass}
          value={name}
          maxLength={50}
          placeholder="Streaming, salle de sport…"
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field label="Prix">
        <input
          className={inputClass}
          inputMode="decimal"
          value={price}
          placeholder="0"
          onChange={(e) => setPrice(e.target.value)}
        />
      </Field>
      <Field label="Fréquence">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-sand p-1">
          {(["monthly", "yearly"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`rounded-xl py-3 text-sm font-bold transition-colors ${
                frequency === f ? "bg-card text-brand shadow-sm" : "text-ink/50"
              }`}
            >
              {f === "monthly" ? "Mensuelle" : "Annuelle"}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Prochain paiement">
        <input
          type="date"
          className={inputClass}
          value={nextPayment}
          onChange={(e) => setNextPayment(e.target.value)}
        />
      </Field>
      {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
      <PrimaryButton
        onClick={() => {
          const value = Number(price.replace(",", "."));
          if (!name.trim()) return setError("Ajoutez un nom.");
          if (!Number.isFinite(value) || value <= 0) return setError("Prix invalide.");
          setError("");
          onSubmit({ name: name.trim().slice(0, 50), price: value, frequency, nextPayment });
        }}
      >
        Enregistrer
      </PrimaryButton>
    </div>
  );
}

function SubscriptionsPage() {
  const { state, addSubscription, updateSubscription, removeSubscription } = useMonevo();
  const totals = useTotals();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const cur = state.currency;
  const editingSub = state.subscriptions.find((s) => s.id === editing);

  return (
    <Shell>
      <h1 className="font-display text-2xl font-semibold">Mes abonnements</h1>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Coût mensuel</p>
          <p className="mt-0.5 font-display text-xl font-semibold">
            {formatMoney(totals.monthlySubs, cur)}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Coût annuel</p>
          <p className="mt-0.5 font-display text-xl font-semibold">
            {formatMoney(totals.yearlySubs, cur)}
          </p>
        </Card>
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={() => setAdding(true)}>+ Ajouter un abonnement</PrimaryButton>
      </div>

      <section className="mt-6">
        <SectionTitle>Liste</SectionTitle>
        <div className="mt-3 space-y-3">
          {state.subscriptions.length === 0 ? (
            <EmptyState icon="🔁" text="Aucun abonnement enregistré." />
          ) : (
            state.subscriptions.map((s) => (
              <Card key={s.id}>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/15 text-base">
                    🔁
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{s.name}</p>
                    <p className="text-[11px] text-ink/45">
                      {s.frequency === "monthly" ? "Mensuel" : "Annuel"} · prochain le{" "}
                      {formatDate(s.nextPayment)}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-base font-semibold">
                    {formatMoney(s.price, cur)}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <GhostButton onClick={() => setEditing(s.id)}>Modifier</GhostButton>
                  <GhostButton onClick={() => removeSubscription(s.id)}>Supprimer</GhostButton>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      <Sheet open={adding} title="Ajouter un abonnement" onClose={() => setAdding(false)}>
        <SubForm
          onSubmit={(s) => {
            addSubscription(s);
            setAdding(false);
          }}
        />
      </Sheet>

      <Sheet open={!!editingSub} title="Modifier l'abonnement" onClose={() => setEditing(null)}>
        {editingSub ? (
          <SubForm
            initial={editingSub}
            onSubmit={(s) => {
              updateSubscription(editingSub.id, s);
              setEditing(null);
            }}
          />
        ) : null}
      </Sheet>
    </Shell>
  );
}
