import { useState } from "react";
import { ArrowRight, Flame, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { TEMPLATES, PLATFORMS } from "@/data/mock";

export default function Templates() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = TEMPLATES.filter(
    (t) =>
      (filter === "all" || t.platform === filter) &&
      t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div data-testid="templates-page" className="p-8 space-y-8">
      <div>
        <div className="metadata mb-2">TEMPLATE WAREHOUSE</div>
        <h1 className="h-display text-4xl mb-2">
          Pre-built <span className="text-orange">factory blueprints</span>
        </h1>
        <p className="text-secondary text-sm max-w-2xl">
          Battle-tested structures tuned for each platform. Pick one, drop your product, ship in
          minutes.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-y border-default py-4">
        <div className="flex items-center gap-2 px-3 h-10 border border-default bg-surface w-80">
          <Search size={14} className="text-muted" />
          <input
            data-testid="template-search"
            placeholder="Search templates…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} testId="filter-all">
            ALL
          </FilterButton>
          {PLATFORMS.map((p) => (
            <FilterButton
              key={p.id}
              active={filter === p.id}
              onClick={() => setFilter(p.id)}
              testId={`filter-${p.id}`}
              color={p.color}
            >
              {p.label}
            </FilterButton>
          ))}
        </div>
        <div className="ml-auto metadata">
          {filtered.length.toString().padStart(2, "0")} TEMPLATES
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        data-testid="templates-grid"
      >
        {filtered.map((t) => {
          const platform = PLATFORMS.find((p) => p.id === t.platform);
          return (
            <article
              key={t.id}
              data-testid={`template-card-${t.id}`}
              className="card-factory flex flex-col group"
            >
              <div className="relative bg-bezel aspect-[4/3] overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                  <div
                    className="metadata px-2 py-1 border bg-bezel/90"
                    style={{ color: platform?.color, borderColor: platform?.color }}
                  >
                    {platform?.label} · {t.aspect}
                  </div>
                  {t.tag && (
                    <div className="metadata bg-orange text-black px-2 py-1 font-bold flex items-center gap-1">
                      {t.tag === "HOT" && <Flame size={10} />} {t.tag}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="metadata">{t.uses.toLocaleString()} USES</div>
                  <div className="metadata">{t.duration}</div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                <h3 className="font-display font-black text-lg leading-tight">{t.name}</h3>
                <div className="space-y-1">
                  <div className="metadata">STRUCTURE</div>
                  <ol className="space-y-1">
                    {t.structure.map((s, i) => (
                      <li key={i} className="text-xs text-secondary flex items-center gap-2">
                        <span className="w-4 h-4 bg-bezel border border-default flex items-center justify-center font-mono text-[9px] text-orange">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
                <Link
                  to="/editor"
                  data-testid={`template-use-${t.id}`}
                  className="btn-secondary w-full justify-center mt-auto group-hover:border-orange group-hover:text-orange"
                >
                  USE TEMPLATE <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children, testId, color }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`px-3 py-2 text-xs font-display font-bold uppercase tracking-wider border transition-all ${
        active
          ? "border-orange bg-orange text-black"
          : "border-default text-secondary hover:text-primary hover:border-secondary"
      }`}
      style={active && color ? { borderColor: color, background: color, color: "#000" } : {}}
    >
      {children}
    </button>
  );
}
