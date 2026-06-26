from ..config import get_settings
from .base import VideoEngine
from .stub import StubEngine


def get_engine() -> VideoEngine:
    settings = get_settings()
    if settings.video_engine == "moneyprinterturbo":
        from .moneyprinterturbo import MoneyPrinterTurboEngine

        return MoneyPrinterTurboEngine(base_url=settings.mpt_base_url)
    return StubEngine()
