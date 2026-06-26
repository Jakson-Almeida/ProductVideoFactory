"""MoneyPrinterTurbo engine adapter.

Talks to a running MoneyPrinterTurbo API instance (https://github.com/harry0703/MoneyPrinterTurbo).
This is the integration seam: map a Product Video Factory project brief onto an
MPT video task, kick it off, then poll task status and translate it back into our
6-stage pipeline progress.

Uses only the stdlib (urllib) so it adds no dependencies. Swap to httpx/requests
if you prefer. Endpoints below follow MPT's FastAPI surface; adjust paths/payload
to match the exact version you deploy.
"""

import json
import time
import urllib.request

from .base import ProgressCallback, RenderContext, VideoEngine


class MoneyPrinterTurboEngine(VideoEngine):
    name = "moneyprinterturbo"

    def __init__(self, base_url: str, poll_seconds: float = 2.0, timeout_seconds: int = 600) -> None:
        self.base_url = base_url.rstrip("/")
        self.poll_seconds = poll_seconds
        self.timeout_seconds = timeout_seconds

    def _post(self, path: str, payload: dict) -> dict:
        req = urllib.request.Request(
            f"{self.base_url}{path}",
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())

    def _get(self, path: str) -> dict:
        with urllib.request.urlopen(f"{self.base_url}{path}", timeout=30) as resp:
            return json.loads(resp.read().decode())

    def _build_payload(self, ctx: RenderContext) -> dict:
        p = ctx.project
        # MPT expects a subject/script + voice/aspect settings. Map ours onto it.
        aspect = "9:16" if p.get("aspect") == "9:16" else "16:9"
        return {
            "video_subject": p.get("title") or p.get("product") or "Product video",
            "video_aspect": aspect,
            "voice_name": "en-US-JennyNeural",
            "subtitle_enabled": True,
            "video_count": 1,
        }

    def render(self, ctx: RenderContext, on_progress: ProgressCallback) -> str:
        on_progress(1, "INTAKE", 5, "Submitting task to MoneyPrinterTurbo")
        created = self._post("/api/v1/videos", self._build_payload(ctx))
        task_id = created.get("data", {}).get("task_id") or created.get("task_id")
        if not task_id:
            raise RuntimeError(f"MoneyPrinterTurbo did not return a task_id: {created}")

        on_progress(2, "SCRIPT", 15, "Task accepted, generating")
        deadline = time.time() + self.timeout_seconds
        while time.time() < deadline:
            status = self._get(f"/api/v1/tasks/{task_id}")
            data = status.get("data", status)
            progress = int(data.get("progress", 0))
            state = (data.get("state") or "").lower()

            stage_id = min(6, max(1, 1 + progress // 17))
            on_progress(stage_id, "RENDER", min(progress, 99), f"MPT state: {state or 'running'}")

            if data.get("videos"):
                on_progress(6, "EXPORT", 100, "Render complete")
                return data["videos"][0]
            if state in {"failed", "error"}:
                raise RuntimeError(f"MoneyPrinterTurbo task failed: {data}")

            time.sleep(self.poll_seconds)

        raise TimeoutError("MoneyPrinterTurbo render timed out")
