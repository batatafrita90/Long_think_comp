# nats-provisioner

Define JetStream streams, consumers, and DLQ channels for the platform.

## Usage

`ash
python -m tooling.nats-provisioner.main
`

## Notes
- Ensure the service dependencies are running (NATS, Qdrant, etc.).
- Provide credentials via environment variables or .env files as needed.
