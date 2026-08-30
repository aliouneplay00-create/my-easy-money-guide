import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/monevo/Shell";
import { Card, EmptyState, PrimaryButton, Progress, SectionTitle } from "@/components/monevo/ui";
import { formatMoney } from "@/lib/monevo/format";
import { useMonevo, useTotals } from "@/lib/monevo/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monevo — Gérez votre argent simplement" },
      {
        name: "description",
        content:
          "Monevo : suivez votre solde, vos revenus, vos dépenses, vos abonnements et vos objectifs d'épargne dans une application simple et moderne.",
      },
      { property: "og:title", content: "Monevo — Gérez votre argent simplement" },
      {
        property: "og:description",
        content: "Solde, dépenses, abonnements et objectifs d'épargne, en toute simplicité.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { state } = useMonevo();
  const totals = useTotals();
  const navigate = useNavigate();
  const cur = state.currency;
  const initial = (state.userName || "M").charAt(0).toUpperCase();

  return (
    <Shell>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">Bonjour</p>
          <h1 className="truncate font-display text-2xl font-semibold leading-tight">
            {state.userName || "Bienvenue"}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-sand px-3 py-1.5 text-xs font-bold tracking-wide text-ink/70">
            {cur}
          </span>
          <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-accent-gold to-brand font-display text-lg font-semibold text-cream">
            {initial}
          </div>
        </div>
      </header>

      <section className="mt-5 rounded-[28px] bg-gradient-to-br from-brand via-brand to-brand-deep p-6 text-cream shadow-[0_20px_40px_-20px_oklch(0.594_0.132_43.5_/_0.7)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/70">
          Solde total
        </p>
        <p className="mt-1 font-display text-[38px] leading-none font-semibold break-words">
          {formatMoney(totals.balance, cur)}
        </p>
        <div className="mt-5 grid grid-cols-2 divide-x divide-cream/20">
          <div className="pr-4">
            <p className="text-[11px] uppercase tracking-wide text-cream/60">Réservé</p>
            <p className="mt-0.5 text-lg font-bold">{formatMoney(state.reserve, cur)}</p>
          </div>
          <div className="pl-4">
            <p className="text-[11px] uppercase tracking-wide text-cream/60">Disponible</p>
            <p className="mt-0.5 font-display text-xl font-semibold text-accent-gold">
              {formatMoney(totals.available, cur)}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-4">
        <PrimaryButton onClick={() => navigate({ to: "/transactions", search: { add: true } })}>
          + Ajouter une transaction
        </PrimaryButton>
      </div>

      <section className="mt-6">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <span className="grid size-9 place-items-center rounded-full bg-moss/15 text-base">📈</span>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
              Revenus · mois
            </p>
            <p className="mt-0.5 font-display text-xl font-semibold text-moss break-words">
              {formatMoney(totals.monthIncome, cur)}
            </p>
          </Card>
          <Card>
            <span className="grid size-9 place-items-center rounded-full bg-plum/15 text-base">📉</span>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
              Dépenses · mois
            </p>
            <p className="mt-0.5 font-display text-xl font-semibold text-plum break-words">
              {formatMoney(totals.monthExpense, cur)}
            </p>
          </Card>
          <Link to="/parametres" className="block">
            <Card>
              <span className="grid size-9 place-items-center rounded-full bg-accent-gold/25 text-base">
                🛟
              </span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                Réserve imprévus
              </p>
              <p className="mt-0.5 font-display text-xl font-semibold break-words">
                {formatMoney(state.reserve, cur)}
              </p>
            </Card>
          </Link>
          <Link to="/abonnements" className="block">
            <Card>
              <span className="grid size-9 place-items-center rounded-full bg-brand/15 text-base">🔁</span>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                Abonnements
              </p>
              <p className="mt-0.5 font-display text-xl font-semibold break-words">
                {formatMoney(totals.monthlySubs, cur)}
                <span className="text-sm text-ink/40"> /m</span>
              </p>
            </Card>
          </Link>
        </div>
      </section>

      <section className="mt-7">
        <SectionTitle
          action={
            <Link to="/objectifs" className="text-xs font-semibold text-brand">
              Tout voir
            </Link>
          }
        >
          Aperçu des objectifs
        </SectionTitle>
        <div className="mt-3 space-y-3">
          {state.goals.length === 0 ? (
            <EmptyState icon="🎯" text="Créez votre premier objectif d'épargne." />
          ) : (
            state.goals.slice(0, 3).map((g) => {
              const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
              return (
                <Card key={g.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold">{g.name}</p>
                    <p className="font-display text-sm font-semibold text-brand">{pct}%</p>
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {formatMoney(g.saved, cur)} / {formatMoney(g.target, cur)}
                  </p>
                  <div className="mt-3">
                    <Progress value={pct} />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </Shell>
  );
}
