# MoneyPrinterTurbo setup for Product Video Factory

Product Video Factory does **not** store LLM or stock-footage API keys in its own `.env`. Those belong in **MoneyPrinterTurbo's `config.toml`**. This guide gets both services talking on your machine.

## Two config files (don't mix them up)

| File | Purpose |
|------|---------|
| `backend/.env` | PVF only: `VIDEO_ENGINE=moneyprinterturbo`, `MPT_BASE_URL=http://127.0.0.1:8080` |
| `backend/MoneyPrinterTurbo/config.toml` | Pexels/Pixabay keys, LLM provider + API key, TTS/subtitle options |

---

## Step 1 — Get the API keys you need

Minimum to generate a test video:

### 1. Pexels (stock video clips) — **required**

1. Sign up at [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Create an API key (free tier is enough for testing)
3. In `config.toml`, set:

```toml
pexels_api_keys = ["YOUR_PEXELS_KEY"]
```

Use straight ASCII double quotes. Do not paste “smart quotes” from Word/email.

### 2. LLM (writes the video script) — **required**

Pick **one** provider and set `llm_provider` plus its matching key in `config.toml`.

| Provider | Good for testing | Sign up | `config.toml` settings |
|----------|------------------|---------|------------------------|
| **Groq** (recommended) | Free tier, fast | [console.groq.com/keys](https://console.groq.com/keys) | `llm_provider = "groq"` + `groq_api_key = "..."` |
| **DeepSeek** | Cheap | [platform.deepseek.com](https://platform.deepseek.com/api_keys) | `llm_provider = "deepseek"` + `deepseek_api_key = "..."` |
| **OpenAI** | Familiar | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | `llm_provider = "openai"` + `openai_api_key = "..."` |
| **Ollama** | Fully local, no cloud key | [ollama.com](https://ollama.com) | `llm_provider = "ollama"` + `ollama_model_name = "llama3"` |

**Example (Groq):**

```toml
llm_provider = "groq"
groq_api_key = "gsk_xxxxxxxx"
groq_model_name = "llama-3.3-70b-versatile"
```

### 3. Text-to-speech — **no key by default**

MPT uses **Edge TTS** by default (`subtitle_provider = "edge"`). No API key needed.

---

## Step 2 — Configure MoneyPrinterTurbo

MoneyPrinterTurbo lives inside this repo at:

```
backend/MoneyPrinterTurbo/
```

Full path on your machine:

```
C:\Users\DELL\Documents\GitHub\ProductVideoFactory\backend\MoneyPrinterTurbo\config.toml
```

If the folder is missing, clone it:

```powershell
cd C:\Users\DELL\Documents\GitHub\ProductVideoFactory\backend
git clone https://github.com/harry0703/MoneyPrinterTurbo.git MoneyPrinterTurbo
cd MoneyPrinterTurbo
copy config.example.toml config.toml
```

Edit **`backend/MoneyPrinterTurbo/config.toml`** and fill in at least:

```toml
[app]
pexels_api_keys = ["YOUR_PEXELS_KEY"]
llm_provider = "groq"
groq_api_key = "YOUR_GROQ_KEY"
```

---

## Step 3 — Start MoneyPrinterTurbo (Docker)

Docker Desktop must be running.

```powershell
cd C:\Users\DELL\Documents\GitHub\ProductVideoFactory\backend\MoneyPrinterTurbo
docker compose -f docker-compose.release.yml up -d
```

- **Web UI:** [http://127.0.0.1:8501](http://127.0.0.1:8501) — easiest way to smoke-test keys
- **API docs:** [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs)

First pull can take several minutes.

---

## Step 4 — Configure Product Video Factory backend

`backend/.env` is already set for MPT:

```env
VIDEO_ENGINE="moneyprinterturbo"
MPT_BASE_URL="http://127.0.0.1:8080"
```

Start the PVF API (from repo root):

```powershell
cd C:\Users\DELL\Documents\GitHub\ProductVideoFactory\backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Step 5 — Test

### A. Test MPT directly (recommended first)

1. Open [http://127.0.0.1:8501](http://127.0.0.1:8501)
2. Enter a short topic (e.g. “wireless earbuds unboxing”)
3. Click generate and wait for a finished MP4

If this fails, fix `config.toml` keys before testing PVF.

### B. Test MPT API with curl

```powershell
curl -X POST "http://127.0.0.1:8080/api/v1/videos" `
  -H "Content-Type: application/json" `
  -d '{"video_subject":"Test product video","video_aspect":"9:16","video_count":1}'
```

Note the `task_id` in the response, then poll:

```powershell
curl "http://127.0.0.1:8080/api/v1/tasks/YOUR_TASK_ID"
```

When `state` is `1` and `videos` has a URL, MPT is working.

### C. Test through Product Video Factory

```powershell
# Create a project
curl -X POST "http://127.0.0.1:8000/api/projects" `
  -H "Content-Type: application/json" `
  -d '{"title":"Test earbuds","product":"Wireless earbuds","platform":"tiktok","aspect":"9:16"}'

# Start render (use project id from response)
curl -X POST "http://127.0.0.1:8000/api/projects/PROJECT_ID/render"

# Poll job (use job id from response)
curl "http://127.0.0.1:8000/api/jobs/JOB_ID"
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `Connection refused` on port 8080 | MPT not running — start Docker compose |
| Pexels / material errors | Missing or invalid `pexels_api_keys` |
| Script generation fails | Wrong `llm_provider` or missing LLM API key |
| `No ffmpeg exe could be found` | Rare in Docker; on native Windows install, set `ffmpeg_path` in `config.toml` |
| Render times out in PVF | First video can take 5–15 min; increase timeout in `moneyprinterturbo.py` if needed |

---

## Switch back to stub mode

If you want PVF without MPT:

```env
VIDEO_ENGINE="stub"
```

Restart the backend. Renders will be simulated (no real video file from MPT).
