"""Parsed PDF worker placeholder.

Consumes ingest.uploaded events and emits ingest.parsed messages after OCR/cleanup."""

def bootstrap() -> None:
    """Configure queues, OCR pipelines, and start the worker loop."""
    raise NotImplementedError("Implement Parsed PDF worker bootstrap.")


if __name__ == "__main__":
    bootstrap()
