"""Embedder worker placeholder.

Consumes ingest.parsed events, performs chunking + embeddings, emits ingest.embedded."""

def bootstrap() -> None:
    """Wire embedding model loading and message processing."""
    raise NotImplementedError("Implement Embedder worker bootstrap.")


if __name__ == "__main__":
    bootstrap()
