import { useState } from "react";
import {
  Captions,
  Sparkles,
  Wand2,
  ChevronRight,
  FileImage,
  Image as ImageIcon,
  Mic,
  Monitor,
  Music2,
  Pause,
  Play,
  Plus,
  Smartphone,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { AVATARS, PLATFORMS, PIPELINE_STAGES, MEDIA_LIBRARY } from "@/data/mock";

const EXAMPLE_PROMPTS = [
  "60-second honest review of the Ninja AirFryer XL for an Amazon affiliate post — emphasize price-to-performance.",
  "TikTok unboxing of the new Echo Dot 5 — hook in the first 3 seconds, then 4 quick features.",
  "Top 5 kitchen gadgets under $30 — countdown style, voiceover by ALEX.",
];

export default function Editor() {
  const [aspect, setAspect] = useState("9:16");
  const [avatar, setAvatar] = useState("av-02");
  const [platform, setPlatform] = useState("tiktok");
  const [prompt, setPrompt] = useState(
    "Create a 45-second TikTok Shop unboxing of the Echo Dot 5. Maya opens the box, shows 3 features, and ends with an affiliate CTA."
  );
  const [media, setMedia] = useState(MEDIA_LIBRARY.slice(0, 3));
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(45);
  const selectedAvatar = AVATARS.find((a) => a.id === avatar);
  const removeMedia = (id) => setMedia(media.filter((m) => m.id !== id));

  return (
    <div
      data-testid="editor-page"
      className="grid grid-cols-12 gap-0 min-h-[calc(100vh-4rem)]"
    >
      {/* Left rail — intake */}
      <aside className="col-span-12 lg:col-span-3 border-r border-default bg-surface p-5 space-y-6">
        <div>
          <div className="metadata mb-2">STAGE 01 · INTAKE</div>
          <h2 className="font-display font-bold text-lg mb-3">Brief the factory</h2>
          <textarea
            data-testid="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="input-base resize-none font-mono text-xs leading-relaxed"
            placeholder="Describe the product, the tone, and the platform…"
          />
          <div className="mt-3 space-y-1.5">
            <div className="metadata">QUICK PROMPTS</div>
            {EXAMPLE_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                data-testid={`quick-prompt-${i}`}
                className="block w-full text-left text-xs text-secondary hover:text-orange border-l-2 border-default hover:border-orange pl-2 py-1 transition-colors"
              >
                {p.slice(0, 70)}…
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="metadata mb-2">PRODUCT MEDIA</div>
          <label
            data-testid="media-dropzone"
            className="block border border-dashed border-default p-5 text-center hover:border-orange hover:bg-elevated transition-all cursor-pointer"
          >
            <Upload size={20} className="mx-auto mb-2 text-orange" />
            <div className="text-xs font-display font-bold uppercase tracking-wider">
              Drop assets here
            </div>
            <div className="metadata mt-1">JPG · PNG · MP4 · GIF · WEBP</div>
            <input type="file" multiple className="hidden" />
          </label>
          <div className="mt-3 space-y-2">
            {media.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 border border-default bg-bezel p-2"
              >
                <div className="w-10 h-10 bg-elevated flex items-center justify-center overflow-hidden">
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono truncate">{m.name}</div>
                  <div className="metadata flex items-center gap-2">
                    {m.type === "video" ? (
                      <Video size={10} />
                    ) : m.type === "gif" ? (
                      <FileImage size={10} />
                    ) : (
                      <ImageIcon size={10} />
                    )}
                    {m.size}
                  </div>
                </div>
                <button
                  data-testid={`remove-media-${m.id}`}
                  onClick={() => removeMedia(m.id)}
                  className="text-muted hover:text-orange"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              data-testid="add-from-library"
              onClick={() =>
                setMedia([...media, MEDIA_LIBRARY[(media.length + 2) % MEDIA_LIBRARY.length]])
              }
              className="w-full text-xs metadata text-orange border border-default hover:border-orange py-2 flex items-center justify-center gap-1"
            >
              <Plus size={12} /> ADD FROM LIBRARY
            </button>
          </div>
        </div>
      </aside>

      {/* Center — canvas */}
      <section className="col-span-12 lg:col-span-6 bg-bezel relative flex flex-col">
        <div className="border-b border-default px-5 py-3 flex items-center justify-between bg-base">
          <div className="flex items-center gap-2">
            <span className="metadata">CANVAS</span>
            <div className="flex border border-default">
              <button
                data-testid="aspect-vertical"
                onClick={() => setAspect("9:16")}
                className={`px-3 py-1.5 text-xs font-display font-bold flex items-center gap-1.5 ${
                  aspect === "9:16" ? "bg-orange text-black" : "text-secondary hover:text-primary"
                }`}
              >
                <Smartphone size={12} /> 9:16
              </button>
              <button
                data-testid="aspect-horizontal"
                onClick={() => setAspect("16:9")}
                className={`px-3 py-1.5 text-xs font-display font-bold flex items-center gap-1.5 ${
                  aspect === "16:9" ? "bg-orange text-black" : "text-secondary hover:text-primary"
                }`}
              >
                <Monitor size={12} /> 16:9
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="metadata">PVF-DRAFT-0001</span>
            <button data-testid="generate-btn" className="btn-primary">
              <Wand2 size={14} /> GENERATE
            </button>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center p-8 factory-grid-dense overflow-hidden">
          <div
            className={`relative bg-black border-2 border-default overflow-hidden shadow-2xl ${
              aspect === "9:16" ? "h-[70vh] aspect-[9/16]" : "w-[80%] max-w-3xl aspect-video"
            }`}
            data-testid="preview-canvas"
          >
            <img
              src={selectedAvatar?.image}
              alt={selectedAvatar?.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <div className="bg-orange text-black px-2 py-1 font-display font-black text-xs">
                LIVE PREVIEW
              </div>
              <div className="metadata bg-bezel/80 px-2 py-1">00:12 / 00:{duration}</div>
            </div>
            <div className="absolute bottom-20 left-4 right-4">
              <div className="bg-bezel/90 border-l-4 border-orange px-3 py-2">
                <div className="font-display font-black text-lg leading-tight">
                  “This Echo Dot just replaced 5 gadgets in my house.”
                </div>
                <div className="metadata mt-1 text-orange">{selectedAvatar?.name}</div>
              </div>
            </div>
            <button
              data-testid="play-toggle"
              onClick={() => setPlaying(!playing)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange flex items-center justify-center glow-orange"
            >
              {playing ? (
                <Pause size={18} className="text-black" fill="currentColor" />
              ) : (
                <Play size={18} className="text-black ml-0.5" fill="currentColor" />
              )}
            </button>
            <div className="absolute inset-0 scan-line pointer-events-none" />
          </div>
          <div className="absolute top-3 left-3 metadata text-muted">
            {aspect === "9:16" ? "VERTICAL · 1080×1920" : "HORIZONTAL · 1920×1080"}
          </div>
        </div>

        <div className="border-t border-default bg-base p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="metadata">TIMELINE / 6 STAGES</div>
            <div className="flex items-center gap-3 text-xs text-secondary">
              <span className="flex items-center gap-1">
                <Mic size={11} /> Voiceover
              </span>
              <span className="flex items-center gap-1">
                <Music2 size={11} /> Track
              </span>
              <span className="flex items-center gap-1">
                <Captions size={11} /> Captions
              </span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {PIPELINE_STAGES.map((s, i) => (
              <div
                key={s.id}
                className={`relative h-8 border ${
                  i < 3 ? "border-orange bg-orange/20" : "border-default bg-surface"
                }`}
              >
                <span className="absolute top-1 left-2 metadata text-[10px]">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="metadata">DURATION</span>
            <input
              type="range"
              min="15"
              max="180"
              value={duration}
              data-testid="duration-slider"
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="flex-1 accent-orange-500"
              style={{ accentColor: "#FF4405" }}
            />
            <span className="font-mono text-orange">
              0:{duration.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* Right rail — cast + platform */}
      <aside className="col-span-12 lg:col-span-3 border-l border-default bg-surface p-5 space-y-6">
        <div>
          <div className="metadata mb-2">STAGE 03 · AVATAR CAST</div>
          <h3 className="font-display font-bold text-base mb-3">Pick a performer</h3>
          <div className="grid grid-cols-3 gap-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                data-testid={`avatar-${a.id}`}
                onClick={() => setAvatar(a.id)}
                className={`relative aspect-[3/4] border overflow-hidden text-left ${
                  avatar === a.id ? "border-orange glow-orange" : "border-default hover:border-secondary"
                }`}
              >
                <img
                  src={a.image}
                  alt={a.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="metadata text-orange text-[9px]">{a.tone}</div>
                  <div className="text-[10px] font-display font-bold leading-tight">
                    {a.name.split(" / ")[0]}
                  </div>
                </div>
                {avatar === a.id && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-orange" />
                )}
              </button>
            ))}
          </div>
          {selectedAvatar && (
            <div className="mt-3 p-3 bg-bezel border border-default">
              <div className="metadata">SELECTED</div>
              <div className="font-display font-bold text-sm">{selectedAvatar.name}</div>
              <div className="text-xs text-secondary mt-1">{selectedAvatar.style}</div>
              <div className="metadata mt-2">VOICE · {selectedAvatar.voice}</div>
            </div>
          )}
        </div>

        <div>
          <div className="metadata mb-2">TARGET PLATFORM</div>
          <div className="space-y-1.5">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                data-testid={`platform-${p.id}`}
                onClick={() => {
                  setPlatform(p.id);
                  setAspect(p.aspect);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 border text-left ${
                  platform === p.id ? "border-orange bg-elevated" : "border-default hover:border-secondary"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center font-display font-black text-[10px] text-black"
                    style={{ background: p.color }}
                  >
                    {p.short}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold">{p.label}</div>
                    <div className="metadata text-[9px]">{p.aspect}</div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-default pt-4">
          <button data-testid="generate-final-btn" className="btn-primary w-full justify-center">
            <Sparkles size={14} /> SEND TO PRODUCTION
          </button>
          <div className="metadata mt-2 text-center">EST. RENDER · 2:14 · 1 GPU</div>
        </div>
      </aside>
    </div>
  );
}
