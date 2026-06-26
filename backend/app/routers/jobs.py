"""Render job status polling."""

from fastapi import APIRouter, HTTPException

from ..models import Job
from ..store import store

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[Job])
def list_jobs():
    return store.list_jobs()


@router.get("/{job_id}", response_model=Job)
def get_job(job_id: str):
    job = store.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
