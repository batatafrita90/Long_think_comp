# qdrant-seeder

Seed global guideline vectors and bootstrap collections in Qdrant.

## Usage

`ash
python -m tooling.qdrant-seeder.main
`

## Notes
- Ensure the service dependencies are running (NATS, Qdrant, etc.).
- Provide credentials via environment variables or .env files as needed.
