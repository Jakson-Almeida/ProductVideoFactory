from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ProjectStatus(str, Enum):
    draft = "draft"
    rendering = "rendering"
    done = "done"
    error = "error"


class Platform(BaseModel):
    id: str
    label: str
    short: str
    aspect: str
    color: str


class Avatar(BaseModel):
    id: str
    name: str
    style: str
    voice: str
    image: str
    tone: str


class Template(BaseModel):
    id: str
    name: str
    platform: str
    aspect: str
    duration: str
    structure: list[str]
    uses: int
    image: str
    tag: Optional[str] = None


class Thumbnail(BaseModel):
    id: str
    title: str
    description: str
    cta: str
    hashtags: list[str]
    score: int
    image: str


class Stat(BaseModel):
    label: str
    value: str
    delta: str
    trend: str


class MediaItem(BaseModel):
    id: str
    type: str
    name: str
    size: str
    url: str


class Project(BaseModel):
    id: str
    title: str
    product: str
    platform: str
    aspect: str
    duration: str
    status: ProjectStatus
    progress: int
    avatar: str
    updated: str
    thumb: str


class ProjectCreate(BaseModel):
    prompt: str = Field(..., min_length=1, description="The brief / prompt for the factory")
    product: Optional[str] = None
    platform: str = "tiktok"
    aspect: str = "9:16"
    avatar: str = "av-01"
    template: Optional[str] = None
    duration_seconds: int = 30
    media_ids: list[str] = Field(default_factory=list)


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    product: Optional[str] = None
    platform: Optional[str] = None
    aspect: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[ProjectStatus] = None


class PipelineStage(BaseModel):
    id: int
    label: str
    desc: str


class JobStatus(str, Enum):
    queued = "queued"
    running = "running"
    done = "done"
    error = "error"


class Job(BaseModel):
    id: str
    project_id: str
    status: JobStatus
    stage: int = 0
    stage_label: str = ""
    progress: int = 0
    message: str = ""
    output_url: Optional[str] = None
    error: Optional[str] = None


class RenderRequest(BaseModel):
    quality: str = "standard"


class MetadataRequest(BaseModel):
    tone: str = "PUNCHY"


class ExportRequest(BaseModel):
    platforms: list[str]
    format: str = "mp4-h264"
    quality: str = "standard"
    captions: bool = True
    watermark: bool = False


class ExportVariant(BaseModel):
    platform: str
    aspect: str
    status: str
    url: Optional[str] = None


class ExportResponse(BaseModel):
    project_id: str
    variants: list[ExportVariant]
