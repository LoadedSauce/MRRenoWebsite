export default function Home() {
  const swatches = [
    { name: "Navy", hex: "#1F3A6B", bg: "bg-navy", text: "text-paper" },
    { name: "Orange", hex: "#E86A1C", bg: "bg-orange", text: "text-paper" },
    { name: "Soft Navy", hex: "#EAF0F8", bg: "bg-soft-navy", text: "text-ink" },
  ];

  return (
    <main className="flex-1 px-6 py-12 sm:px-10 sm:py-20 max-w-5xl mx-auto w-full">
      <h1 className="font-display font-bold text-navy text-4xl sm:text-6xl tracking-tight">
        M.R. Renovations
      </h1>

      <p className="mt-4 text-muted text-base sm:text-lg">
        Maple Grove, MN &middot; Build smoke test &middot; Phase 0
      </p>

      <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {swatches.map((s) => (
          <div
            key={s.name}
            className={`${s.bg} ${s.text} rounded-lg p-6 flex flex-col justify-between min-h-32`}
          >
            <span className="font-display font-medium text-lg">{s.name}</span>
            <span className="font-body text-sm mt-4 opacity-90">{s.hex}</span>
          </div>
        ))}
      </section>

      <div className="mt-12">
        <button
          type="button"
          className="bg-orange text-paper font-display font-medium px-6 py-3 rounded-md hover:bg-navy-deep transition-colors"
        >
          Free Consultation
        </button>
      </div>
    </main>
  );
}
