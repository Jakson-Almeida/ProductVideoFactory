import { useState } from "react";
import { Sparkles, Check, Copy, FileText, Hash, RefreshCcw, Target } from "lucide-react";
import { THUMBNAILS } from "@/data/mock";

export default function Thumbnails() {
  const [selected, setSelected] = useState(THUMBNAILS[0].id);
  const [tone, setTone] = useState("PUNCHY");
  const [copied, setCopied] = useState(null);
  const thumb = THUMBNAILS.find((t) => t.id === selected);
  const copy = (key, text) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div data-testid="thumbnails-page" className="p-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
      <section className="xl:col-span-5 space-y-5">
        <div>
          <div className="metadata mb-1">STAGE 05 · COPY & THUMBNAIL</div>
          <h1 className="h-display text-3xl">
            Pack the <span className="text-orange">shipping label</span>
          </h1>
          <p className="text-secondary text-sm mt-2 max-w-md">
            AI-drafted titles, descriptions, hashtags and a thumbnail ready for each platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="metadata">TONE</div>
          {["PUNCHY", "HONEST", "HYPE", "EDUCATIONAL"].map((t) => (
            <button
              key={t}
              data-testid={`tone-${t.toLowerCase()}`}
              onClick={() => setTone(t)}
              className={`px-2 py-1 text-[10px] font-display font-bold border ${
                tone === t
                  ? "border-orange bg-orange text-black"
                  : "border-default text-secondary hover:text-primary"
              }`}
            >
              {t}
            </button>
          ))}
          <button data-testid="regenerate-btn" className="btn-secondary ml-auto !py-1.5">
            <RefreshCcw size={12} /> REGENERATE
          </button>
        </div>

        <div className="space-y-3" data-testid="thumbnails-list">
          {THUMBNAILS.map((t) => (
            <button
              key={t.id}
              data-testid={`thumb-card-${t.id}`}
              onClick={() => setSelected(t.id)}
              className={`w-full flex gap-4 p-3 border text-left transition-all ${
                selected === t.id
                  ? "border-orange bg-elevated"
                  : "border-default bg-surface hover:border-secondary"
              }`}
            >
              <div className="relative w-36 h-24 bg-bezel shrink-0 overflow-hidden">
                <img
                  src={t.image}
                  alt={t.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 metadata bg-bezel/80 px-1.5 py-0.5">
                  V{String(THUMBNAILS.indexOf(t) + 1).padStart(2, "0")}
                </div>
                <div className="absolute bottom-1 right-1 metadata bg-orange text-black px-1.5 py-0.5 font-bold">
                  {t.score}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-sm leading-tight line-clamp-2">
                  {t.title}
                </div>
                <div className="metadata mt-2">SCORE · CTR PREDICTION</div>
                <div className="mt-1 h-1 bg-bezel">
                  <div className="h-full bg-orange" style={{ width: `${t.score}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="xl:col-span-7 space-y-5">
        <div className="card-factory p-0 overflow-hidden">
          <div className="relative aspect-video bg-bezel">
            <img
              src={thumb.image}
              alt={thumb.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <div className="metadata bg-bezel/80 px-2 py-1 border border-default">
                THUMB · 1280×720
              </div>
              <div className="metadata bg-orange text-black px-2 py-1 font-bold">
                CTR {thumb.score}
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-display font-black text-4xl leading-tight max-w-2xl mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {thumb.title}
              </div>
              <div className="inline-block bg-orange text-black px-3 py-1 font-display font-black text-xs uppercase tracking-wider">
                ↗ Tap link in bio
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CopyBlock
            icon={<FileText size={14} />}
            label="TITLE"
            value={thumb.title}
            testId="copy-title"
            copied={copied === "title"}
            onCopy={() => copy("title", thumb.title)}
          />
          <CopyBlock
            icon={<Target size={14} />}
            label="CALL-TO-ACTION"
            value={thumb.cta}
            testId="copy-cta"
            copied={copied === "cta"}
            onCopy={() => copy("cta", thumb.cta)}
          />
        </div>

        <CopyBlock
          icon={<FileText size={14} />}
          label="DESCRIPTION"
          value={thumb.description}
          testId="copy-description"
          copied={copied === "description"}
          onCopy={() => copy("description", thumb.description)}
          multiline
        />

        <div className="card-factory p-5">
          <div className="metadata mb-2 flex items-center gap-2">
            <Hash size={11} /> HASHTAGS
          </div>
          <div className="flex flex-wrap gap-2">
            {thumb.hashtags.map((h) => (
              <span
                key={h}
                className="px-2 py-1 bg-bezel border border-default text-xs font-mono text-orange"
              >
                {h}
              </span>
            ))}
            <button
              data-testid="copy-hashtags"
              onClick={() => copy("hashtags", thumb.hashtags.join(" "))}
              className="px-2 py-1 border border-default text-xs font-mono text-secondary hover:text-orange flex items-center gap-1"
            >
              {copied === "hashtags" ? <Check size={11} /> : <Copy size={11} />}
              {copied === "hashtags" ? "COPIED" : "COPY ALL"}
            </button>
          </div>
        </div>

        <div className="card-factory p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-orange" />
            <div>
              <div className="font-display font-bold text-sm">Generate 6 more variants</div>
              <div className="text-xs text-secondary">A/B test titles across platforms.</div>
            </div>
          </div>
          <button data-testid="generate-more-btn" className="btn-primary">
            <Sparkles size={14} /> RUN
          </button>
        </div>
      </section>
    </div>
  );
}

function CopyBlock({ icon, label, value, testId, copied, onCopy, multiline }) {
  return (
    <div className="card-factory p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="metadata flex items-center gap-2">
          {icon} {label}
        </div>
        <button
          data-testid={testId}
          onClick={onCopy}
          className="text-xs font-mono text-secondary hover:text-orange flex items-center gap-1"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <div
        className={`text-sm ${
          multiline ? "text-secondary leading-relaxed" : "font-display font-bold text-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
