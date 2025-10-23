"""Indexer worker placeholder.

Consumes ingest.embedded events and upserts vectors into Qdrant."""

def bootstrap() -> None:
    """Configure Qdrant client and durable consumer."""
    raise NotImplementedError("Implement Indexer worker bootstrap.")


if __name__ == "__main__":
    bootstrap()
