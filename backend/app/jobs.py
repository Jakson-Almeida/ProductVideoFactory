"""In-process render job runner.

A small thread-pool executes render jobs in the background and streams progress
into the store. This stands in for Celery/RQ + Redis; the public surface (enqueue
+ poll job) is identical, so swapping in a distributed queue later is mechanical.
"""

import uuid
from concurrent.futures import ThreadPoolExecutor

from .engine import get_engine
from .engine.base import RenderContext
from .store import store

_executor = ThreadPoolExecutor(max_workers=2)


def enqueue_render(project_id: str, quality: str = "standard") -> dict | None:
    project = store.get_project(project_id)
    if not project:
        return None

    job_id = f"job-{uuid.uuid4().hex[:12]}"
    job = {
        "id": job_id,
        "project_id": project_id,
        "status": "queued",
        "stage": 0,
        "stage_label": "",
        "progress": 0,
        "message": "Queued",
        "output_url": None,
        "error": None,
    }
    store.add_job(job)
    store.patch_project(project_id, status="rendering", progress=0)
    _executor.submit(_run_job, job_id, project_id, quality)
    return store.get_job(job_id)


def _run_job(job_id: str, project_id: str, quality: str) -> None:
    project = store.get_project(project_id)
    if not project:
        store.update_job(job_id, status="error", error="Project not found")
        return

    engine = get_engine()
    store.update_job(job_id, status="running", message="Starting render")

    def on_progress(stage: int, label: str, progress: int, message: str) -> None:
        store.update_job(
            job_id, stage=stage, stage_label=label, progress=progress, message=message
        )
        store.patch_project(project_id, progress=progress)

    try:
        output_url = engine.render(RenderContext(project=project, quality=quality), on_progress)
        store.update_job(
            job_id,
            status="done",
            stage=6,
            stage_label="EXPORT",
            progress=100,
            message="Render complete",
            output_url=output_url,
        )
        store.patch_project(project_id, status="done", progress=100, updated="just now")
    except Exception as exc:  # noqa: BLE001 - surface any engine failure to the job
        store.update_job(job_id, status="error", error=str(exc), message="Render failed")
        store.patch_project(project_id, status="error")
