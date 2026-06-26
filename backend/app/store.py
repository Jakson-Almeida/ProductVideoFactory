"""Thread-safe in-memory data store, seeded from seed.py.

This is intentionally simple so the backend runs with zero external services.
Swap this module for a real database (SQLModel/Postgres) without touching routers.
"""

import threading
from copy import deepcopy

from . import seed


class Store:
    def __init__(self) -> None:
        self._lock = threading.RLock()
        self.platforms = deepcopy(seed.PLATFORMS)
        self.avatars = deepcopy(seed.AVATARS)
        self.templates = deepcopy(seed.TEMPLATES)
        self.thumbnails = deepcopy(seed.THUMBNAILS)
        self.pipeline_stages = deepcopy(seed.PIPELINE_STAGES)
        self.stats = deepcopy(seed.STATS)
        self.media = deepcopy(seed.MEDIA_LIBRARY)
        self.projects: dict[str, dict] = {p["id"]: deepcopy(p) for p in seed.PROJECTS}
        self.jobs: dict[str, dict] = {}
        self._counter = max(
            (int(pid.split("-")[1]) for pid in self.projects), default=184
        )

    def next_project_id(self) -> str:
        with self._lock:
            self._counter += 1
            return f"PVF-{self._counter:05d}"

    # ---- projects ----
    def list_projects(self) -> list[dict]:
        with self._lock:
            return [deepcopy(p) for p in self.projects.values()]

    def get_project(self, project_id: str) -> dict | None:
        with self._lock:
            p = self.projects.get(project_id)
            return deepcopy(p) if p else None

    def add_project(self, project: dict) -> dict:
        with self._lock:
            self.projects[project["id"]] = project
            return deepcopy(project)

    def update_project(self, project_id: str, patch: dict) -> dict | None:
        with self._lock:
            p = self.projects.get(project_id)
            if not p:
                return None
            p.update({k: v for k, v in patch.items() if v is not None})
            return deepcopy(p)

    def patch_project(self, project_id: str, **fields) -> dict | None:
        with self._lock:
            p = self.projects.get(project_id)
            if not p:
                return None
            p.update(fields)
            return deepcopy(p)

    def delete_project(self, project_id: str) -> bool:
        with self._lock:
            return self.projects.pop(project_id, None) is not None

    # ---- jobs ----
    def add_job(self, job: dict) -> dict:
        with self._lock:
            self.jobs[job["id"]] = job
            return deepcopy(job)

    def get_job(self, job_id: str) -> dict | None:
        with self._lock:
            j = self.jobs.get(job_id)
            return deepcopy(j) if j else None

    def update_job(self, job_id: str, **fields) -> dict | None:
        with self._lock:
            j = self.jobs.get(job_id)
            if not j:
                return None
            j.update(fields)
            return deepcopy(j)

    def list_jobs(self) -> list[dict]:
        with self._lock:
            return [deepcopy(j) for j in self.jobs.values()]


store = Store()
