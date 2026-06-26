# Product Video Factory

AI product video studio — turn a prompt, product images, and an avatar into platform-ready videos for TikTok Shop, Reels, Shorts, Amazon, and more.

This repository replicates the [Video Factory](https://prompt-to-video-520.preview.emergentagent.com/) frontend and adds a FastAPI backend scaffold. Video generation is designed to plug into [MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) as the render engine.

## Features

- **Dashboard** — production stats, pipeline status, recent projects
- **Editor** — prompt brief, media upload, aspect ratio, avatar cast, platform targeting, live preview
- **Templates** — searchable blueprint library per platform
- **Thumbnails** — AI-drafted titles, descriptions, hashtags, and thumbnail variants
- **Export** — multi-platform shipping with format and quality options
- **Responsive UI** — desktop sidebar + mobile bottom nav and slide-out menu
- **Backend API** — project CRUD, render job queue, catalog endpoints (stub engine by default)

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, React Router, TanStack Query, Tailwind CSS, Craco, Lucide icons |
| Backend | Python 3, FastAPI, Pydantic, Uvicorn |
| Video engine | Stub (dev) or MoneyPrinterTurbo (planned production) |

## Project structure

```
ProductVideoFactory/
├── frontend/          React app (Create React App + Craco)
│   ├── src/
│   │   ├── components/   Layout, sidebar, mobile nav
│   │   ├── pages/        Dashboard, Editor, Templates, Thumbnails, Export
│   │   └── data/mock.js  Static demo data (to be replaced by API calls)
│   └── public/
├── backend/           FastAPI service — see backend/README.md
├── docs/reference/    UI comparison screenshots
└── README.md
```

## Quick start

### Frontend

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
```

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # optional
uvicorn app.main:app --reload --port 8000
```

- API: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
- Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Run both services together for full-stack development. The frontend currently uses `mock.js`; wiring it to the backend API is the next integration step.

## Configuration

### Frontend

Create `frontend/.env` if needed:

```
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

### Backend

Copy `backend/.env.example` to `backend/.env`. Key settings:

| Variable | Default | Description |
|---|---|---|
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed frontend origins |
| `VIDEO_ENGINE` | `stub` | `stub` or `moneyprinterturbo` |
| `MPT_BASE_URL` | `http://localhost:8080` | MoneyPrinterTurbo API URL |

See [backend/README.md](backend/README.md) for API endpoints and MoneyPrinterTurbo integration details.

## Roadmap

- [ ] Connect frontend to backend API (replace `mock.js` with TanStack Query hooks)
- [ ] Real file upload in Editor → `POST /api/media/upload`
- [ ] Wire render queue sidebar to live job polling
- [ ] Integrate MoneyPrinterTurbo for actual video generation
- [ ] Persist projects in a database (Postgres + SQLModel)
- [ ] Distributed job queue (Celery/RQ + Redis)

## License

Private project — see repository owner for terms.
