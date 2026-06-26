"""Pluggable video-generation engine interface.

A concrete engine turns a project brief into a rendered video, reporting
progress through a callback as it advances through the 6-stage pipeline.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Callable


@dataclass
class RenderContext:
    project: dict
    quality: str


# (stage_index, stage_label, progress_pct, message)
ProgressCallback = Callable[[int, str, int, str], None]


class VideoEngine(ABC):
    name: str = "base"

    @abstractmethod
    def render(self, ctx: RenderContext, on_progress: ProgressCallback) -> str:
        """Run the full pipeline and return the output video URL/path.

        Implementations MUST call on_progress as they advance and may raise
        on failure; the job runner translates that into an error job state.
        """
        raise NotImplementedError
