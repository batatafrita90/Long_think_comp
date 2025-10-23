# Docker configs

## Arquivos principais
- docker-compose.dev.yml: ambiente local com hot reload, observabilidade e tooling.
- docker-compose.prod.yml: layout base para produ??o (imagens pr?-buildadas).
- .env.examples/: templates de vari?veis para copiar/ajustar (cp -r docker/.env.examples ./).
- prometheus.yml: scrape configs para Prometheus.

## Redes
- internal: comunica??o entre servi?os backend.
- edge: exp?e somente pi-gateway, quiz-session-service (SSE) e rontend.

## Volumes
- 
ats_data, qdrant_data, postgres_data, prometheus_data, grafana_data: persistem estado durante o desenvolvimento.

Ajuste os arquivos .env de cada servi?o antes de subir os cont?ineres.
