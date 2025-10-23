# Event Contracts

This directory hosts the canonical JSON Schemas for each JetStream subject.

## Streams
- ingest.*
- agents.status.*
- quiz.generated
- session.*
- ui.*
- mcq.item.failed
- dead.letters.*

## Authoring Guidelines
1. Version every schema (e.g. 1, 2) and keep backwards compatibility.
2. Include session_id, un_id, and item_id fields where applicable for idempotency.
3. Publish schemas to the registry before enabling consumers.
4. Add sample payloads under examples/ to aid contract testing.
