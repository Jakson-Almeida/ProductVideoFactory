import { useState } from "react";
import {
  Sparkles,
  Check,
  Download,
  Film,
  Link as LinkIcon,
  Monitor,
  Settings2,
  Share2,
  Smartphone,
} from "lucide-react";
import { PLATFORMS } from "@/data/mock";

const FORMATS = [
  { id: "mp4-h264", label: "MP4 / H.264", desc: "Universal — TikTok, IG, YT" },
  { id: "mp4-h265", label: "MP4 / H.265", desc: "Smaller file, modern devices" },
  { id: "mov-prores", label: "MOV / ProRes", desc: "Editor-friendly master" },
  { id: "webm", label: "WebM / VP9", desc: "Web-optimized" },
];

const QUALITIES = [
  { id: "draft", label: "DRAFT", res: "720p", size: "~14 MB" },
  { id: "standard", label: "STANDARD", res: "1080p", size: "~38 MB" },
  { id: "premium", label: "PREMIUM", res: "1080p HDR", size: "~64 MB" },
  { id: "master", label: "MASTER", res: "4K", size: "~210 MB" },
];

export default function Export() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(["tiktok", "reels", "shorts"]);
  const [format, setFormat] = useState("mp4-h264");
  const [quality, setQuality] = useState("standard");
  const [captions, setCaptions] = useState(true);
  const [watermark, setWatermark] = useState(false);
  const [exporting, setExporting] = useState(false);
  const togglePlatform = (id) =>
    setSelectedPlatforms((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div data-testid="export-page" className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section className="lg:col-span-7 space-y-6">
        <div>
          <div className="metadata mb-1">STAGE 06 · SHIPPING DOCK</div>
          <h1 className="h-display text-3xl">
            Ship to <span className="text-orange">every platform</span> at once
          </h1>
          <p className="text-secondary text-sm mt-2 max-w-xl">
            Master once. Auto-resize, re-frame and rename for each destination.
          </p>
        </div>

        {/* Destinations */}
        <div className="card-factory p-6">
          <div className="metadata mb-4 flex items-center gap-2">
            <Share2 size={11} /> DESTINATIONS · {selectedPlatforms.length} SELECTED
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PLATFORMS.map((p) => {
              const active = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  data-testid={`export-platform-${p.id}`}
                  onClick={() => togglePlatform(p.id)}
                  className={`p-4 border text-left flex items-start gap-3 transition-all ${
                    active
                      ? "border-orange bg-elevated"
                      : "border-default bg-surface hover:border-secondary"
                  }`}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center font-display font-black text-xs text-black"
                    style={{ background: p.color }}
                  >
                    {p.short}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-sm">{p.label}</div>
                    <div className="metadata mt-0.5 flex items-center gap-1">
                      {p.aspect === "9:16" ? <Smartphone size={10} /> : <Monitor size={10} />}
                      {p.aspect}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 border-2 flex items-center justify-center ${
                      active ? "bg-orange border-orange" : "border-default"
                    }`}
                  >
                    {active && <Check size={12} className="text-black" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Format */}
        <div className="card-factory p-6">
          <div className="metadata mb-4 flex items-center gap-2">
            <Film size={11} /> FORMAT
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                data-testid={`format-${f.id}`}
                onClick={() => setFormat(f.id)}
                className={`p-3 border text-left ${
                  format === f.id ? "border-orange bg-elevated" : "border-default hover:border-secondary"
                }`}
              >
                <div className="font-mono text-sm font-bold">{f.label}</div>
                <div className="text-xs text-secondary mt-1">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div className="card-factory p-6">
          <div className="metadata mb-4 flex items-center gap-2">
            <Settings2 size={11} /> QUALITY TIER
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {QUALITIES.map((q) => (
              <button
                key={q.id}
                data-testid={`quality-${q.id}`}
                onClick={() => setQuality(q.id)}
                className={`p-3 border text-left ${
                  quality === q.id ? "border-orange bg-elevated" : "border-default hover:border-secondary"
                }`}
              >
                <div className="font-display font-black text-xs">{q.label}</div>
                <div className="font-mono text-base text-orange mt-1">{q.res}</div>
                <div className="metadata mt-1">{q.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="card-factory p-6 space-y-3">
          <ToggleRow
            label="BURN-IN CAPTIONS"
            desc="Recommended for TikTok, Reels and Shorts."
            value={captions}
            onChange={setCaptions}
            testId="toggle-captions"
          />
          <ToggleRow
            label="ADD WATERMARK"
            desc="Discrete logo in lower corner."
            value={watermark}
            onChange={setWatermark}
            testId="toggle-watermark"
          />
        </div>
      </section>

      {/* Order summary */}
      <aside className="lg:col-span-5">
        <div className="sticky top-20 space-y-4">
          <div className="card-factory p-6">
            <div className="metadata mb-3">PRODUCTION ORDER</div>
            <div className="font-display font-black text-xl mb-4">
              PVF-00184 · Echo Dot 5 Unboxing
            </div>
            <SummaryRow label="DESTINATIONS" value={`${selectedPlatforms.length} platforms`} />
            <SummaryRow label="FORMAT" value={FORMATS.find((f) => f.id === format)?.label} />
            <SummaryRow label="QUALITY" value={`${QUALITIES.find((q) => q.id === quality)?.res}`} />
            <SummaryRow label="CAPTIONS" value={captions ? "Burned-in" : "Off"} />
            <SummaryRow label="WATERMARK" value={watermark ? "On" : "Off"} />
            <SummaryRow label="EST. SIZE" value={QUALITIES.find((q) => q.id === quality)?.size} />
            <SummaryRow label="EST. TIME" value="≈ 1m 42s" highlight />
            <button
              data-testid="export-btn"
              onClick={() => {
                setExporting(true);
                setTimeout(() => setExporting(false), 4000);
              }}
              disabled={exporting || selectedPlatforms.length === 0}
              className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Sparkles size={14} className="animate-spin" /> EXPORTING…
                </>
              ) : (
                <>
                  <Download size={14} /> EXPORT {selectedPlatforms.length} VARIANTS
                </>
              )}
            </button>
            {exporting && (
              <div className="mt-4 space-y-2">
                {selectedPlatforms.map((id) => {
                  const p = PLATFORMS.find((pl) => pl.id === id);
                  const pct = Math.floor(Math.random() * 70) + 20;
                  return (
                    <div key={id} className="text-xs">
                      <div className="flex items-center justify-between font-mono mb-1">
                        <span className="text-secondary">{p.label}</span>
                        <span className="text-orange">{pct}%</span>
                      </div>
                      <div className="h-1 bg-bezel">
                        <div className="h-full bg-orange transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-factory p-6">
            <div className="metadata mb-3 flex items-center gap-2">
              <LinkIcon size={11} /> DIRECT DELIVERY (BETA)
            </div>
            <div className="space-y-2">
              <DeliveryRow label="TikTok Shop" status="Connected" />
              <DeliveryRow label="Instagram" status="Connected" />
              <DeliveryRow label="YouTube" status="Connect" connect />
              <DeliveryRow label="Amazon" status="Connect" connect />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-default last:border-0">
      <div className="metadata">{label}</div>
      <div className={`text-xs font-mono ${highlight ? "text-orange font-bold" : "text-primary"}`}>
        {value}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange, testId }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="font-display font-bold text-sm">{label}</div>
        <div className="text-xs text-secondary">{desc}</div>
      </div>
      <button
        data-testid={testId}
        onClick={() => onChange(!value)}
        className={`w-12 h-6 border flex items-center transition-all ${
          value ? "bg-orange border-orange" : "bg-bezel border-default"
        }`}
      >
        <div
          className={`w-4 h-4 bg-black transition-transform ${
            value ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function DeliveryRow({ label, status, connect }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-default last:border-0">
      <div className="text-xs font-display font-bold">{label}</div>
      {connect ? (
        <button
          data-testid={`connect-${label.toLowerCase()}`}
          className="metadata text-orange hover:underline"
        >
          {status} →
        </button>
      ) : (
        <span className="metadata text-green flex items-center gap-1">
          <span className="status-dot done" /> {status}
        </span>
      )}
    </div>
  );
}
