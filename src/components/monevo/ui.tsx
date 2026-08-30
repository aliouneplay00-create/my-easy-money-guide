import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-card p-4 shadow-[0_10px_24px_-16px_rgba(46,36,26,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="font-display text-lg font-semibold text-foreground">{children}</h2>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-2xl bg-ink py-4 text-center text-base font-bold text-cream transition-transform active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl bg-sand px-3 py-2 text-xs font-bold text-ink/70 transition-transform active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/50">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 px-0 sm:items-center sm:px-4">
      <button aria-label="Fermer" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-t-[28px] bg-cream p-5 pb-8 sm:rounded-[28px]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-sand text-lg text-ink/60"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-sand">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-gold to-brand transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-sm text-ink/50">{text}</p>
    </div>
  );
}
