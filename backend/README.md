# Product Video Factory — Backend

FastAPI service that powers the Product Video Factory frontend. It exposes the
catalog data (previously hard-coded in the frontend's `mock.js`), project CRUD, a
background render job queue, and a pluggable video-generation engine. The engine
defaults to a simulated `stub` and can be switched to
[MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo).

## Quick start

```bash
cd backend
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env          # optional, sensible defaults are built in
uvicorn app.main:app --reload --port 8000
```

- API root: `http://127.0.0.1:8000/api`
- Interactive docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

## Project layout

```
backend/
├── requirements.txt
├── .env.example
└── app/
    ├── main.py          # FastAPI app, CORS, /static mount, router wiring
    ├── config.py        # env-driven settings
    ├── models.py        # Pydantic request/response schemas
    ├── seed.py          # data mirroring the frontend mock.js
    ├── store.py         # thread-safe in-memory store (swap for a DB later)
    ├── jobs.py          # in-process render job runner (swap for Celery/RQ later)
    ├── engine/
    │   ├── base.py      # VideoEngine interface + RenderContext
    │   ├── stub.py      # simulated 6-stage pipeline
    │   └── moneyprinterturbo.py  # MPT API adapter
    └── routers/
        ├── catalog.py   # platforms, avatars, templates, thumbnails, stats, media
        ├── projects.py  # CRUD + render / metadata / export
        ├── jobs.py      # render job polling
        └── media.py     # product media upload
```

## API surface

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/platforms` | Target platforms |
| GET | `/api/avatars` | Performer avatars |
| GET | `/api/templates` | Blueprint templates |
| GET | `/api/thumbnails` | Thumbnail/copy presets |
| GET | `/api/pipeline-stages` | The 6 pipeline stages |
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/media` | Media library |
| POST | `/api/media/upload` | Upload product media (multipart) |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create a project from a brief |
| GET | `/api/projects/{id}` | Get a project |
| PATCH | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |
| POST | `/api/projects/{id}/render` | Enqueue a render job |
| POST | `/api/projects/{id}/metadata` | Generate title/description/hashtags |
| POST | `/api/projects/{id}/export` | Produce per-platform variants |
| GET | `/api/jobs` | List render jobs |
| GET | `/api/jobs/{id}` | Poll a render job's progress |

## Switching to the MoneyPrinterTurbo engine

1. Run a MoneyPrinterTurbo API instance (see its repo's Docker / Python setup).
2. Set in `.env`:
   ```
   VIDEO_ENGINE=moneyprinterturbo
   MPT_BASE_URL=http://localhost:8080
   ```
3. Restart the backend. Render jobs now submit a task to MPT, poll its status, and
   stream progress back through the same job API the frontend already polls.

The adapter lives in `app/engine/moneyprinterturbo.py`. Adjust the endpoint paths
and request payload in `_build_payload` / `render` to match the exact MPT version
you deploy — that file is the only integration seam.

## Production notes (later phases)

- Replace `store.py` with a real database (e.g. SQLModel + Postgres).
- Replace the `ThreadPoolExecutor` in `jobs.py` with Celery/RQ + Redis for durable,
  multi-worker job processing.
- Move `/static` storage to object storage (S3/GCS) and serve via signed URLs.
- Add auth (API keys / OAuth) before exposing publicly.
