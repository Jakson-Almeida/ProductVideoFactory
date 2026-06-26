"""Project CRUD + render / metadata / export actions."""

from fastapi import APIRouter, HTTPException

from .. import jobs
from ..models import (
    ExportRequest,
    ExportResponse,
    ExportVariant,
    Job,
    MetadataRequest,
    Project,
    ProjectCreate,
    ProjectUpdate,
    RenderRequest,
    Thumbnail,
)
from ..store import store

router = APIRouter(prefix="/projects", tags=["projects"])

DEFAULT_THUMB = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"


def _seconds_to_label(seconds: int) -> str:
    return f"{seconds // 60}:{seconds % 60:02d}"


@router.get("", response_model=list[Project])
def list_projects():
    return store.list_projects()


@router.post("", response_model=Project, status_code=201)
def create_project(payload: ProjectCreate):
    project_id = store.next_project_id()
    title = (payload.product or payload.prompt).strip()
    title = (title[:48] + "…") if len(title) > 49 else title
    project = {
        "id": project_id,
        "title": title or "Untitled production",
        "product": payload.product or payload.prompt[:60],
        "platform": payload.platform,
        "aspect": payload.aspect,
        "duration": _seconds_to_label(payload.duration_seconds),
        "status": "draft",
        "progress": 0,
        "avatar": payload.avatar,
        "updated": "just now",
        "thumb": DEFAULT_THUMB,
    }
    return store.add_project(project)


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str):
    project = store.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=Project)
def update_project(project_id: str, payload: ProjectUpdate):
    updated = store.update_project(project_id, payload.model_dump(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str):
    if not store.delete_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")


@router.post("/{project_id}/render", response_model=Job, status_code=202)
def render_project(project_id: str, payload: RenderRequest):
    job = jobs.enqueue_render(project_id, quality=payload.quality)
    if not job:
        raise HTTPException(status_code=404, detail="Project not found")
    return job


@router.post("/{project_id}/metadata", response_model=Thumbnail)
def generate_metadata(project_id: str, payload: MetadataRequest):
    project = store.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Placeholder copy generation; wired to an LLM in a later phase.
    product = project["product"]
    return Thumbnail(
        id=f"meta-{project_id}",
        title=f"{product} — you NEED to see this",
        description=f"A {payload.tone.lower()} take on {product}. Honest, fast, and to the point.",
        cta="Tap the link to grab yours →",
        hashtags=["#amazonfinds", "#tiktokmademebuyit", "#review"],
        score=85,
        image=project["thumb"],
    )


@router.post("/{project_id}/export", response_model=ExportResponse)
def export_project(project_id: str, payload: ExportRequest):
    project = store.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    by_id = {p["id"]: p for p in store.platforms}
    variants = []
    for pid in payload.platforms:
        platform = by_id.get(pid)
        aspect = platform["aspect"] if platform else project["aspect"]
        variants.append(
            ExportVariant(
                platform=pid,
                aspect=aspect,
                status="ready",
                url=f"/static/renders/{project_id}-{pid}.{payload.format.split('-')[0]}",
            )
        )
    return ExportResponse(project_id=project_id, variants=variants)
