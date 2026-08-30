import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/monevo/Shell";
import { Card, Field, inputClass, PrimaryButton, SectionTitle } from "@/components/monevo/ui";
import { CURRENCIES } from "@/lib/monevo/currencies";
import { LOCALES } from "@/lib/monevo/i18n";
import { formatMoney } from "@/lib/monevo/format";
import { useMonevo, useTotals } from "@/lib/monevo/store";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Monevo" },
      {
        name: "description",
        content: "Changez votre devise principale, définissez votre réserve imprévus et gérez vos données.",
      },
      { property: "og:title", content: "Paramètres — Monevo" },
      { property: "og:description", content: "Devise, réserve imprévus, langue et gestion des données." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, setCurrency, setUserName, setReserve, resetAll } = useMonevo();
  const totals = useTotals();
  const [reserveInput, setReserveInput] = useState(String(state.reserve));
  const [confirmReset, setConfirmReset] = useState(false);

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monevo-donnees.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Shell>
      <h1 className="font-display text-2xl font-semibold">Paramètres</h1>

      <section className="mt-5">
        <SectionTitle>Réserve imprévus</SectionTitle>
        <Card className="mt-3">
          <p className="text-sm text-ink/55">
            Le montant réservé est retiré du solde disponible à dépenser.
          </p>
          <div className="mt-3">
            <Field label="Montant réservé">
              <input
                className={inputClass}
                inputMode="decimal"
                value={reserveInput}
                onChange={(e) => setReserveInput(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-3">
            <PrimaryButton
              onClick={() => {
                const v = Number(reserveInput.replace(",", "."));
                if (Number.isFinite(v)) setReserve(v);
              }}
            >
              Enregistrer la réserve
            </PrimaryButton>
          </div>
          <p className="mt-3 text-xs text-ink/50">
            Solde : {formatMoney(totals.balance, state.currency)} · Disponible :{" "}
            {formatMoney(totals.available, state.currency)}
          </p>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Profil</SectionTitle>
        <Card className="mt-3">
          <Field label="Votre prénom">
            <input
              className={inputClass}
              value={state.userName}
              maxLength={40}
              placeholder="Camille"
              onChange={(e) => setUserName(e.target.value)}
            />
          </Field>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Devise principale</SectionTitle>
        <Card className="mt-3">
          <Field label="Devise">
            <select
              className={inputClass}
              value={state.currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </Field>
          <p className="mt-3 text-xs text-ink/50">
            Aucune conversion automatique dans cette version : tous les montants existants gardent leur
            valeur.
          </p>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Langue</SectionTitle>
        <Card className="mt-3">
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <span key={l.code} className="rounded-xl bg-sand px-3 py-2 text-xs font-bold text-ink/70">
                {l.label}
              </span>
            ))}
            <span className="rounded-xl border border-dashed border-border px-3 py-2 text-xs font-semibold text-ink/40">
              Autres langues bientôt
            </span>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Gestion des données</SectionTitle>
        <Card className="mt-3">
          <p className="text-sm text-ink/55">
            Vos données sont enregistrées sur cet appareil : {state.transactions.length} transactions,{" "}
            {state.subscriptions.length} abonnements, {state.goals.length} objectifs.
          </p>
          <div className="mt-4 space-y-2">
            <PrimaryButton onClick={exportData}>Exporter mes données</PrimaryButton>
            {confirmReset ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    resetAll();
                    setReserveInput("0");
                    setConfirmReset(false);
                  }}
                  className="flex-1 rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground"
                >
                  Confirmer la suppression
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 rounded-2xl bg-sand py-3 text-sm font-bold text-ink/70"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full rounded-2xl border border-destructive/40 py-3 text-sm font-bold text-destructive"
              >
                Supprimer toutes mes données
              </button>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>À propos</SectionTitle>
        <Card className="mt-3">
          <p className="font-display text-lg font-semibold">Monevo · V1</p>
          <p className="mt-1 text-sm text-ink/55">
            Une application simple pour gérer son argent au quotidien. Données stockées localement sur
            votre appareil.
          </p>
        </Card>
      </section>
    </Shell>
  );
}
