"""Reviewer Proxy service placeholder.

Acts as a guardrail layer over the external LLM provider."""

def bootstrap() -> None:
    """Start the reviewer proxy API (rate limiting, auth, validation)."""
    raise NotImplementedError("Implement Reviewer Proxy bootstrap.")


if __name__ == "__main__":
    bootstrap()
