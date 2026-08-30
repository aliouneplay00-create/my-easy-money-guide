import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/monevo/Shell";
import { Card, EmptyState, GhostButton, PrimaryButton, SectionTitle, Sheet } from "@/components/monevo/ui";
import { TransactionForm, type TxDraft } from "@/components/monevo/TransactionForm";
import { formatDate, formatMoney } from "@/lib/monevo/format";
import { useMonevo, useTotals } from "@/lib/monevo/store";
import { getCategory } from "@/lib/monevo/types";

export const Route = createFileRoute("/transactions")({
  validateSearch: (search: Record<string, unknown>) => ({ add: search.add === true || search.add === "true" }),
  head: () => ({
    meta: [
      { title: "Transactions — Monevo" },
      { name: "description", content: "Ajoutez, modifiez et suivez vos revenus et vos dépenses avec Monevo." },
      { property: "og:title", content: "Transactions — Monevo" },
      { property: "og:description", content: "Historique clair de vos revenus et dépenses." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { state, addTransaction, updateTransaction, removeTransaction } = useMonevo();
  const totals = useTotals();
  const { add } = Route.useSearch();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<string | null>(null);
  const cur = state.currency;

  const openAdd = () => navigate({ to: "/transactions", search: { add: true } });
  const closeAdd = () => navigate({ to: "/transactions", search: { add: false } });

  const editingTx = state.transactions.find((t) => t.id === editing);
  const sorted = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Shell>
      <h1 className="font-display text-2xl font-semibold">Transactions</h1>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Total revenus</p>
          <p className="mt-0.5 font-display text-xl font-semibold text-moss">
            {formatMoney(totals.income, cur)}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">Total dépenses</p>
          <p className="mt-0.5 font-display text-xl font-semibold text-plum">
            {formatMoney(totals.expense, cur)}
          </p>
        </Card>
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={openAdd}>+ Ajouter une transaction</PrimaryButton>
      </div>

      <section className="mt-6">
        <SectionTitle>Historique</SectionTitle>
        <div className="mt-3 space-y-3">
          {sorted.length === 0 ? (
            <EmptyState icon="🧾" text="Aucune transaction pour l'instant." />
          ) : (
            sorted.map((tx) => {
              const cat = getCategory(tx.category);
              return (
                <Card key={tx.id}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-base">
                      {cat.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{tx.label}</p>
                      <p className="text-[11px] text-ink/45">
                        {cat.label} · {formatDate(tx.date)}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 font-display text-base font-semibold ${
                        tx.type === "income" ? "text-moss" : "text-plum"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "−"}
                      {formatMoney(tx.amount, cur)}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <GhostButton onClick={() => setEditing(tx.id)}>Modifier</GhostButton>
                    <GhostButton onClick={() => removeTransaction(tx.id)}>Supprimer</GhostButton>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>

      <Sheet open={add} title="Ajouter une transaction" onClose={closeAdd}>
        <TransactionForm
          onSubmit={(tx: TxDraft) => {
            addTransaction(tx);
            closeAdd();
          }}
        />
      </Sheet>

      <Sheet open={!!editingTx} title="Modifier la transaction" onClose={() => setEditing(null)}>
        {editingTx ? (
          <TransactionForm
            initial={editingTx}
            onSubmit={(tx: TxDraft) => {
              updateTransaction(editingTx.id, tx);
              setEditing(null);
            }}
          />
        ) : null}
      </Sheet>
    </Shell>
  );
}
