import { useState } from "react";
import { CURRENCIES } from "@/lib/monevo/currencies";
import { useMonevo } from "@/lib/monevo/store";
import { Field, inputClass, PrimaryButton } from "./ui";

export function Onboarding() {
  const { completeOnboarding } = useMonevo();
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [query, setQuery] = useState("");

  const list = CURRENCIES.filter((c) =>
    `${c.code} ${c.name}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-cream">
      <div className="mx-auto max-w-[480px] px-5 pt-10 pb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">Bienvenue</p>
        <h1 className="mt-1 font-display text-3xl font-semibold leading-tight">Monevo</h1>
        <p className="mt-2 text-sm text-ink/55">
          Gérez votre argent simplement. Commencez par choisir votre devise principale.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Votre prénom (optionnel)">
            <input
              className={inputClass}
              value={name}
              maxLength={40}
              placeholder="Camille"
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field label="Rechercher une devise">
            <input
              className={inputClass}
              value={query}
              placeholder="XOF, Euro, Dollar…"
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {list.map((c) => {
            const active = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`rounded-2xl px-4 py-3 text-left transition-colors ${
                  active ? "bg-brand text-cream" : "bg-card text-foreground"
                }`}
              >
                <div className="font-display text-lg font-semibold">
                  {c.code} <span className="text-sm opacity-70">{c.symbol}</span>
                </div>
                <div className={`text-[11px] ${active ? "text-cream/70" : "text-ink/45"}`}>
                  {c.name}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <PrimaryButton onClick={() => completeOnboarding(currency, name.trim())}>
            Commencer avec {currency}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
