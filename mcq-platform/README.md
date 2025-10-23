# MCQ Platform

Estrutura base para a plataforma de gera??o e execu??o de MCQs. O reposit?rio est? organizado em microservi?os independentes, cada um com seu .env, Dockerfile, openapi.yaml (quando aplic?vel) e ponto de entrada em src/app.

## Vis?o geral
- pi-gateway: borda HTTP respons?vel por uploads e proxy de sess?es.
- workflow-agentes: orquestra LangGraph, publica progresso e pacotes de quest?es.
- quiz-session-service: materializa execu??es, exp?e HTTP + SSE/WebSocket.
- user-engine: autentica??o, perfis e hist?rico consolidado.
- parsed-pdf, embedder, indexer: pipeline de ingest?o e indexa??o no Qdrant.
- eviewer-proxy: camada de policies e rate-limit para o LLM externo.
- metrics-engine: agrega??o de m?tricas de sess?es e usu?rios.
- janitor: limpeza baseada em TTL (24h) de sess?es, Qdrant e storage.
- rontend/web-app: Next.js para a interface do quiz.
- 	ooling: utilit?rios para provisionamento (NATS, Qdrant, schema registry).

## Fluxo ponta-a-ponta
1. Upload do PDF (pi-gateway) ? evento ingest.uploaded.
2. Parsing + limpeza (parsed-pdf) ? ingest.parsed.
3. Chunking + embeddings (embedder) ? ingest.embedded.
4. Indexa??o no Qdrant (indexer) ? ingest.indexed.
5. Gera??o de MCQs (workflow-agentes) ? gents.status.* + quiz.generated.
6. Sess?o interativa (quiz-session-service) ? session.answer + session.completed.
7. M?tricas consolidadas (metrics-engine) ? consultas HTTP.
8. Limpeza autom?tica (janitor) ? respeita expire_at em todos os dom?nios.

## Quickstart (dev)
1. Copie os exemplos de vari?veis de ambiente:
   `ash
   cp -r docker/.env.examples ./
   `
2. Suba a infraestrutura base:
   `ash
   docker compose -f docker/docker-compose.dev.yml up -d nats qdrant langfuse postgres prometheus grafana
   `
3. Provisione NATS e sementes do Qdrant:
   `ash
   docker compose -f docker/docker-compose.dev.yml run --rm nats-provisioner
   docker compose -f docker/docker-compose.dev.yml run --rm qdrant-seeder
   `
4. Suba os servi?os de aplica??o:
   `ash
   docker compose -f docker/docker-compose.dev.yml up -d api-gateway parsed-pdf embedder indexer reviewer-proxy workflow-agentes quiz-session-service metrics-engine janitor user-engine
   `
5. Frontend:
   `ash
   cd frontend/web-app
   pnpm install
   pnpm dev
   `

## Observabilidade
- Todos os servi?os exp?em GET /health, GET /.well-known/info e GET /metrics.
- Prometheus + Grafana j? configurados em docker-compose.dev.yml.
- Recomenda-se adicionar OpenTelemetry (collector opcional) para tracing distribu?do.

## Seguran?a e segredos
- N?o versione segredos reais. Utilize um cofre (Vault/ASM/GSM) para produ??o.
- Habilite mTLS entre servi?os via Service Mesh quando for para produ??o.
- Aplique least privilege em Supabase/Qdrant/Postgres; tokens do LLM devem ser segmentados.

## Pr?ximos passos sugeridos
- Implementar os contratos de eventos no 	ooling/schema-registry.
- Adicionar testes e lint (python black por servi?o) ao pipeline CI/CD.
- Escrever manifests Helm/Kustomize para a rota de produ??o em Kubernetes.
