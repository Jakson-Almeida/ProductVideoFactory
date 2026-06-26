"""Read-only catalog endpoints used to populate the UI (formerly mock.js)."""

from fastapi import APIRouter

from ..models import Avatar, MediaItem, PipelineStage, Platform, Stat, Template, Thumbnail
from ..store import store

router = APIRouter(tags=["catalog"])


@router.get("/platforms", response_model=list[Platform])
def list_platforms():
    return store.platforms


@router.get("/avatars", response_model=list[Avatar])
def list_avatars():
    return store.avatars


@router.get("/templates", response_model=list[Template])
def list_templates():
    return store.templates


@router.get("/thumbnails", response_model=list[Thumbnail])
def list_thumbnails():
    return store.thumbnails


@router.get("/pipeline-stages", response_model=list[PipelineStage])
def list_pipeline_stages():
    return store.pipeline_stages


@router.get("/stats", response_model=list[Stat])
def list_stats():
    return store.stats


@router.get("/media", response_model=list[MediaItem])
def list_media():
    return store.media
