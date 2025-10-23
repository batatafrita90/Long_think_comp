"""Janitor service placeholder.

Enforces data retention TTL across Qdrant, storage, and sessions."""

def bootstrap() -> None:
    """Start the janitor scheduler loop."""
    raise NotImplementedError("Implement Janitor bootstrap.")


if __name__ == "__main__":
    bootstrap()
