import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMonevo } from "@/lib/monevo/store";
import { Onboarding } from "./Onboarding";

const TABS = [
  { to: "/", icon: "🏠", label: "Accueil" },
  { to: "/transactions", icon: "🧾", label: "Transact." },
  { to: "/abonnements", icon: "🔁", label: "Abonn." },
  { to: "/objectifs", icon: "🎯", label: "Objectifs" },
  { to: "/parametres", icon: "⚙️", label: "Paramètres" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { state, hydrated } = useMonevo();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground selection:bg-brand/20">
      <div className="mx-auto max-w-[480px] px-5 pt-5 pb-28">{children}</div>

      <nav className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 border-t border-ink/5 bg-cream/95 px-2 pt-2 pb-5 backdrop-blur">
        <div className="grid grid-cols-5 gap-1">
          {TABS.map((tab) => {
            const active = pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className="flex flex-col items-center gap-1 rounded-xl py-1"
              >
                <span
                  className={`grid size-9 place-items-center rounded-full text-base ${
                    active ? "bg-brand/15" : "bg-sand"
                  }`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`text-[11px] ${active ? "font-bold text-brand" : "font-semibold text-ink/45"}`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {hydrated && !state.onboarded ? <Onboarding /> : null}
    </div>
  );
}
