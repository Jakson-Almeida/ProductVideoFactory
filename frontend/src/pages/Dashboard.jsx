import { Link } from "react-router-dom";
import {
  MoreHorizontal,
  Filter,
  Sparkles,
  ArrowUpRight,
  Box,
  Clock,
  Play,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  AVATARS,
  PLATFORMS,
  PROJECTS,
  STATS,
  PIPELINE_STAGES,
} from "@/data/mock";

const statusLabel = {
  rendering: "RENDERING",
  done: "READY",
  draft: "DRAFT",
  error: "FAILED",
};

export default function Dashboard() {
  return (
    <div data-testid="dashboard-page" className="p-8 space-y-10">
      {/* Hero */}
      <section className="relative card-factory p-8 overflow-hidden">
        <div className="absolute inset-0 factory-grid opacity-40 pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="metadata mb-4 flex items-center gap-2">
              <span className="status-dot running" /> LIVE PRODUCTION FLOOR
            </div>
            <h1 className="h-display text-4xl sm:text-5xl leading-[0.95] mb-4">
              Turn any product
              <br />
              into a <span className="text-orange">scroll-stopping</span> video.
            </h1>
            <p className="text-secondary max-w-xl mb-8 text-sm leading-relaxed">
              Drop a product link, an image or a raw prompt. Pick a human-like avatar to
              review, unbox or hype it — and ship vertical and horizontal cuts to TikTok
              Shop, Reels, Shorts and Amazon in one run.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/editor" data-testid="hero-new-project" className="btn-primary">
                <Sparkles size={14} /> START A NEW PRODUCTION
              </Link>
              <Link to="/templates" data-testid="hero-browse-templates" className="btn-secondary">
                <Box size={14} /> BROWSE TEMPLATES
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.slice(0, 3).map((av, i) => (
                <div
                  key={av.id}
                  className={`relative aspect-[3/4] overflow-hidden border border-default ${
                    i === 1 ? "translate-y-4" : ""
                  }`}
                >
                  <img
                    src={av.image}
                    alt={av.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="metadata text-orange">{av.tone}</div>
                    <div className="text-xs font-display font-bold leading-tight">
                      {av.name.split(" / ")[0]}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 metadata bg-bezel/80 px-1.5 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
            <div className="metadata mt-4 text-center">
              06 SYNTHETIC PERFORMERS · 14 LANGUAGES
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="card-factory p-5">
            <div className="metadata mb-3">{s.label}</div>
            <div className="flex items-end justify-between">
              <div className="h-display text-3xl text-primary">{s.value}</div>
              <div className="flex items-center gap-1 text-xs text-green font-mono">
                <TrendingUp size={12} /> {s.delta}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Pipeline */}
      <section className="card-factory p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="metadata mb-1">PRODUCTION PIPELINE / PVF-00184</div>
            <h2 className="font-display font-bold text-xl">Echo Dot 5 — 60s Unboxing</h2>
          </div>
          <Link to="/editor" data-testid="pipeline-open-btn" className="btn-secondary">
            OPEN <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {PIPELINE_STAGES.map((stage, i) => {
            const active = i < 4;
            const current = i === 3;
            return (
              <div
                key={stage.id}
                className={`relative p-4 border ${
                  current
                    ? "border-orange bg-elevated scan-line overflow-hidden"
                    : active
                    ? "border-default bg-elevated"
                    : "border-subtle bg-surface"
                }`}
              >
                <div
                  className={`metadata mb-2 ${
                    current ? "text-orange" : active ? "text-green" : "text-muted"
                  }`}
                >
                  STAGE {String(stage.id).padStart(2, "0")}
                </div>
                <div className="font-display font-bold text-sm">{stage.label}</div>
                <div className="text-xs text-secondary mt-1">{stage.desc}</div>
                {active && !current && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green" />
                )}
                {current && <div className="absolute top-2 right-2 status-dot running" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent productions */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="metadata mb-1">RECENT PRODUCTIONS</div>
            <h2 className="font-display font-bold text-2xl">Off the line</h2>
          </div>
          <div className="flex items-center gap-2">
            <button data-testid="filter-btn" className="btn-ghost">
              <Filter size={14} /> FILTER
            </button>
            <Link to="/editor" data-testid="grid-new-project" className="btn-primary">
              <Plus size={14} strokeWidth={3} /> NEW
            </Link>
          </div>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-testid="projects-grid"
        >
          {PROJECTS.map((p) => {
            const platform = PLATFORMS.find((pl) => pl.id === p.platform);
            const avatar = AVATARS.find((a) => a.id === p.avatar);
            return (
              <article
                key={p.id}
                data-testid={`project-card-${p.id}`}
                className="card-factory group flex flex-col"
              >
                <div className="relative bg-bezel aspect-[4/5] overflow-hidden">
                  <img
                    src={p.thumb}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <div className="metadata bg-bezel/90 px-2 py-1 border border-default">
                      {p.id}
                    </div>
                    <div
                      className="metadata px-2 py-1 border"
                      style={{
                        borderColor: platform?.color,
                        color: platform?.color,
                        background: "rgba(5,6,7,0.85)",
                      }}
                    >
                      {platform?.short} · {p.aspect}
                    </div>
                  </div>
                  <button
                    data-testid={`project-play-${p.id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-14 h-14 bg-orange flex items-center justify-center glow-orange">
                      <Play size={22} className="text-black ml-1" fill="currentColor" />
                    </div>
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border border-default overflow-hidden">
                        <img
                          src={avatar?.image}
                          alt=""
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <span className="metadata">{avatar?.tone}</span>
                    </div>
                    <span className="metadata flex items-center gap-1">
                      <Clock size={10} /> {p.duration}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="font-display font-bold text-sm leading-snug">{p.title}</h3>
                    <div className="text-xs text-secondary mt-1">{p.product}</div>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <div className="metadata flex items-center">
                        <span className={`status-dot ${p.status}`} />
                        {statusLabel[p.status]}
                      </div>
                      <span className="metadata text-muted">{p.updated}</span>
                    </div>
                    {p.status === "rendering" && (
                      <div className="h-1 bg-bezel">
                        <div className="h-full bg-orange" style={{ width: `${p.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-default pt-3">
                    <Link
                      to="/export"
                      data-testid={`project-open-${p.id}`}
                      className="text-xs font-display font-bold uppercase tracking-wider text-orange hover:underline"
                    >
                      Open →
                    </Link>
                    <button
                      data-testid={`project-more-${p.id}`}
                      className="text-muted hover:text-primary"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
