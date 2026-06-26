from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .routers import catalog, jobs, media, projects

settings = get_settings()

app = FastAPI(title=settings.app_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media and rendered videos.
app.mount("/static", StaticFiles(directory=str(settings.storage_path)), name="static")

# All API routes live under /api so CORS + middleware apply uniformly.
app.include_router(catalog.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(media.router, prefix="/api")


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "engine": settings.video_engine}
