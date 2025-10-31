# MCQ Platform

Microservices-based platform for MCQ generation and delivery. Each service ships with its own `.env`, `Dockerfile`, `openapi.yaml` (when applicable), and entry point under `src/app`.

- A APLICAÇÃO É UM WORKFLOW DE AGENTES DE IA QUE CRIA QUESTÇOES DE MULTIPLA ESCOLHA A PARTIR DE ARQUIVOS, NÃO É FEITO PARA PROFESSORES SOMENTE, É FEITO PARA ACADEMICOS DE MEDICINA, PESSIAS QUE ESTÃO PREPARANDO PARA A RESIDENCIA MEDICA. 

A IDEIA: É CRIAR UM BANCO DE QUESTÕES DE MULTIPLA ESCOLHA A PARTIR DE RESUMO, ANOTAÇÕES QUE O USUÁRIO DISPONIBILIZA; 

#O PONTO DIFERENCIAL É USAR A TAXONOMIA DE BLOOM PARA CRIAR AS QUESTÕES DE MULTIPLA ESCOLHA.
OS AGENTES SÃO PREPARADOS PARA CRIAR QUESTÕES ASSIM.  
OS MODELOS USAM METODOLOGIA E TECNICA BASEADO NA CRIAÇÃO DE CONTEXTO E DISTRATORES. ELES USAM,M ISSO PARA CRIAR CADA QUESTÃO. 
TAMPAMOS UMA LACUNA GIGANTESCA: ESTUDAR E LEMRBAR DO QUE FEZ. 
# A APLICAÇÃO É NACIONAL - PT-BR

## Overview
- `api-gateway`: HTTP edge for uploads and session proxying.
- `workflow-agentes`: orchestrates La ngGraph, emits progress and quiz packages.
- `quiz-session-service`: materialises executions, exposes HTTP + SSE/WebSocket.
- `user-engine`: authentication, profiles, historical aggregates.
- `parsed-pdf`, `embedder`, `indexer`: ingestion pipeline targeting Qdrant.
- `reviewer-proxy`: policy + rate-limit layer in front of the external LLM.
- `metrics-engine`: aggregates user/session metrics.
- `janitor`: TTL enforcement across sessions, Qdrant and storage.
- `frontend/web-app`: Next.js UI (Vercel deployment target).
- `tooling`: provisioning utilities (NATS, Qdrant, schema registry, Supabase bootstrap).

## End-to-end Flow
1. PDF upload (`api-gateway`) → `ingest.uploaded`.
2. OCR/cleanup (`parsed-pdf`) → `ingest.parsed`.
3. Chunking + embeddings (`embedder`) → `ingest.embedded`.
4. Qdrant upsert (`indexer`) → `ingest.indexed`.
5. MCQ generation (`workflow-agentes`) → `agents.status.*` + `quiz.generated`.
6. Interactive session (`quiz-session-service`) → `session.answer` + `session.completed`.
7. Metrics aggregation (`metrics-engine`).
8. Cleanup (`janitor`) respecting `expire_at` across domains.

## Quickstart (dev)
1. Copy environment templates:
   ```bash
   cp -r docker/.env.examples ./
   ```
2. Bring up base infra:
   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d nats qdrant langfuse postgres prometheus grafana
   ```
3. Provision NATS + Qdrant seeders:
   ```bash
   docker compose -f docker/docker-compose.dev.yml run --rm nats-provisioner
   docker compose -f docker/docker-compose.dev.yml run --rm qdrant-seeder
   ```
4. Launch application services:
   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d api-gateway parsed-pdf embedder indexer reviewer-proxy workflow-agentes quiz-session-service metrics-engine janitor user-engine
   ```
5. Frontend dev server:
   ```bash
   cd frontend/web-app
   pnpm install
   pnpm dev
   ```

> **Dependências**: confirme que `pnpm install` completou antes de subir o frontend. Para os serviços Python, consulte `dependencies.manifest.toml` e instale as bibliotecas listadas por serviço (idealmente em ambientes virtuais separados) antes de desenvolver a lógica. Caso pular essa etapa, os containers iniciarão sem as dependências necessárias.

## Supabase & Frontend Integration
- Seed the `public.notes` table and the RLS policy by executing `tooling/supabase/bootstrap_notes.sql` within the Supabase SQL Editor (or via `psql`).
- Link the Vercel project locally with `vercel link` and pull secrets using `vercel env pull .env.development.local`.
- The Next.js route `/notes` (`frontend/web-app/app/notes/page.tsx`) fetches data through `utils/supabase/server.ts`, which wraps `createServerComponentClient`.
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus any server-only keys) are populated in `frontend/web-app/.env.local` or via Vercel environment variables before running `pnpm dev`.

## Observability
- Every service exposes `GET /health`, `GET /.well-known/info`, and `GET /metrics`.
- Prometheus and Grafana are wired in `docker-compose.dev.yml`.
- Add OpenTelemetry (collector optional) for distributed tracing.

## Security and Secrets
- Do not commit real secrets. Use Vault/ASM/GSM or similar in production.
- Prefer mTLS between services via a service mesh for production traffic.
- Apply least privilege to Supabase, Qdrant, Postgres; scope LLM tokens tightly.

## Next Steps
- Implement event contracts within `tooling/schema-registry`.
- Add lint/tests (per-service python black config) to the CI/CD pipeline.
- Author Helm/Kustomize manifests for the production Kubernetes path.
