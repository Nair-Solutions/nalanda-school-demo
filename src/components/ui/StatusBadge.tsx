export function StatusBadge({ label, tone }: { label: string; tone: "pending" | "ok" }) {
  const styles =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-700/20"
      : "bg-gold-100 text-[#6b4a0c] ring-gold-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${styles}`}
    >
      {label}
    </span>
  );
}
