"""Simulated engine: walks the 6-stage pipeline with realistic delays.

Lets the whole system (UI -> API -> queue -> progress polling) be exercised
end-to-end before MoneyPrinterTurbo is wired in.
"""

import time

from .base import ProgressCallback, RenderContext, VideoEngine

STAGES = [
    (1, "INTAKE", "Validating prompt + media"),
    (2, "SCRIPT", "Generating script"),
    (3, "AVATAR", "Rendering performer"),
    (4, "ASSEMBLE", "Cutting & timing"),
    (5, "POLISH", "Adding FX + captions"),
    (6, "EXPORT", "Encoding multi-platform"),
]


class StubEngine(VideoEngine):
    name = "stub"

    def __init__(self, step_seconds: float = 0.8) -> None:
        self.step_seconds = step_seconds

    def render(self, ctx: RenderContext, on_progress: ProgressCallback) -> str:
        total = len(STAGES)
        for idx, (stage_id, label, message) in enumerate(STAGES):
            on_progress(stage_id, label, int((idx / total) * 100), message)
            time.sleep(self.step_seconds)
        on_progress(total, "EXPORT", 100, "Render complete")
        return f"/static/renders/{ctx.project['id']}.mp4"
