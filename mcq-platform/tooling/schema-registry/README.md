# schema-registry

Validate event contracts using Pydantic models before dispatch/consume.

## Usage

`ash
python -m tooling.schema-registry.main
`

## Notes
- Ensure the service dependencies are running (NATS, Qdrant, etc.).
- Provide credentials via environment variables or .env files as needed.
