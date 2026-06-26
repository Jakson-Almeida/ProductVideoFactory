"""Media upload endpoint for the Editor's product media panel."""

import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from ..config import get_settings
from ..models import MediaItem
from ..store import store

router = APIRouter(prefix="/media", tags=["media"])


def _human_size(num_bytes: int) -> str:
    size = float(num_bytes)
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024 or unit == "GB":
            return f"{size:.1f} {unit}".replace(".0 ", " ")
        size /= 1024
    return f"{size:.1f} GB"


def _media_type(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext in {"mp4", "mov", "webm", "avi"}:
        return "video"
    if ext == "gif":
        return "gif"
    return "image"


@router.post("/upload", response_model=MediaItem, status_code=201)
async def upload_media(file: UploadFile = File(...)):
    settings = get_settings()
    uploads = settings.storage_path / "uploads"
    media_id = f"m-{uuid.uuid4().hex[:10]}"
    safe_name = Path(file.filename or "upload").name
    dest = uploads / f"{media_id}-{safe_name}"

    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    item = {
        "id": media_id,
        "type": _media_type(safe_name),
        "name": safe_name,
        "size": _human_size(dest.stat().st_size),
        "url": f"/static/uploads/{dest.name}",
    }
    store.media.insert(0, item)
    return item
