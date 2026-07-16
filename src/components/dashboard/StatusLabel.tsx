export function StatusLabel({ status }: { status?: string }) {
  const normalized = status || "applied";
  const className =
    normalized === "shortlisted"
      ? "border-[#57CFA0] bg-[#D6F5E5] text-[#0F5A44]"
      : normalized === "rejected"
        ? "border-[#B7DFCE] bg-[#F1FAF5] text-[#2F5E4E]"
        : "border-[#C7EFDD] bg-[#EFFBF4] text-[#1F8F6A]";

  return (
    <span
      className={`w-fit rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {normalized}
    </span>
  );
}

export function EmptyGraphic({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center border-y border-dashed border-border px-6 text-center text-sm leading-6 text-ink/55">
      {label}
    </div>
  );
}
