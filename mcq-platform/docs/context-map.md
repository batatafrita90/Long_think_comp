# Mapa de Contextos – MCQ Platform

Este documento aplica _Context Maps_ de DDD para deixar explícitos os limites e os relacionamentos entre os bounded contexts da plataforma de geração de questões de múltipla escolha.

## Bounded Contexts Principais

| Contexto | Serviços / Artefatos | Responsabilidade | Contratos / Fontes de Verdade |
| --- | --- | --- | --- |
| Experiência do Usuário | `frontend/web-app` | Interface Next.js para upload, acompanhamento de sessões e notas. | Consume APIs expostas pelo `api-gateway` e pelo Supabase (`/notes`). |
| Orquestração de Acesso | `services/api-gateway` | Edge HTTP para uploads e proxy de sessões; publica eventos iniciais. | Eventos `ingest.uploaded.*`; contratos REST de upstreams (`user-engine`, `quiz-session-service`). |
| Gerenciamento de Usuários | `services/user-engine` | Autenticação, perfis e agregados históricos. | API REST de identidade; tokens compartilhados com o gateway e o frontend. |
| Ingestão de Documentos | `services/parsed-pdf` | OCR e limpeza dos uploads. | Consome `ingest.uploaded.*` e publica `ingest.parsed.*`. |
| Enriquecimento Semântico | `services/embedder` | Chunking + embeddings das notas e PDFs. | Consome `ingest.parsed.*`; publica `ingest.embedded.*`; contrato com modelos de embedding. |
| Indexação Vetorial | `services/indexer`, `docker/qdrant` | Upsert de vetores no Qdrant e manutenção de coleções. | Consome `ingest.embedded.*`; schema de coleções do Qdrant; publica `ingest.indexed.*`. |
| Orquestração de Geração | `services/workflow-agentes` | Executa LangGraph, acompanha status e define pacotes de quiz. | Consome `ingest.indexed.*`; publica `agents.status.*` e `quiz.generated`; contratos com `reviewer-proxy`. |
| Governança de LLM | `services/reviewer-proxy` | Camada de policy/rate-limit para o provedor externo de LLM. | API HTTP consumida pelo `workflow-agentes`; política de auditoria sobre payloads. |
| Execução de Sessões | `services/quiz-session-service` | Materializa quizzes, avalia respostas, expõe SSE/WebSocket. | Consome `quiz.generated`; publica `session.*`; integra com `user-engine` e `metrics-engine`. |
| Métricas & Analytics | `services/metrics-engine` | Agrega métricas de usuário e sessão. | Consome `session.*`; expõe API de consulta; integra com ferramentas de observabilidade. |
| Compliance & Retenção | `services/janitor` | TTL de sessões, Qdrant e storage. | Consome `ingest.*`, `session.*` e metadados do Qdrant; agenda expurgo. |
| Contratos Event-Driven | `tooling/schema-registry` | Governa os esquemas JSON das streams JetStream. | Repositório de _Published Language_ (`ingest.*`, `quiz.generated`, `session.*`). |

## Relacionamentos (Context Map)

| Upstream | Downstream | Padrão DDD | Canal | Notas |
| --- | --- | --- | --- | --- |
| Orquestração de Acesso (`api-gateway`) | Ingestão de Documentos (`parsed-pdf`) | Customer/Supplier + Published Language | Eventos `ingest.uploaded.*` via NATS JetStream | O gateway negocia requisitos de ingestão; `parsed-pdf` conforma aos payloads definidos no schema registry. |
| Ingestão de Documentos (`parsed-pdf`) | Enriquecimento Semântico (`embedder`) | Conformist + Published Language | Eventos `ingest.parsed.*` | `embedder` adapta-se sem anti-corruption layer para maximizar throughput. |
| Enriquecimento Semântico (`embedder`) | Indexação Vetorial (`indexer`) | Conformist + Published Language | Eventos `ingest.embedded.*` | O `indexer` adota o mesmo vocabulário de chunks/embeddings. |
| Indexação Vetorial (`indexer`) | Orquestração de Geração (`workflow-agentes`) | Published Language + Shared Kernel | Eventos `ingest.indexed.*` + coleções Qdrant | O workflow consome eventos e lê os vetores com o mesmo schema de coleções. |
| Orquestração de Geração (`workflow-agentes`) | Execução de Sessões (`quiz-session-service`) | Customer/Supplier + Published Language | Eventos `quiz.generated` | A sessão demanda contratos claros de pacotes de quiz; o workflow negocia conforme feedback das sessões. |
| Orquestração de Geração (`workflow-agentes`) | Governança de LLM (`reviewer-proxy`) | Anti-Corruption Layer + Open Host Service | HTTP | O proxy protege o workflow de instabilidades do provedor externo, homogenizando respostas e erros. |
| Governança de LLM (`reviewer-proxy`) | Provedor Externo de LLM | Separate Ways + Anti-Corruption Layer | HTTP externo | Toda lógica de compatibilização fica no proxy, isolando o domínio core. |
| Execução de Sessões (`quiz-session-service`) | Métricas & Analytics (`metrics-engine`) | Published Language + Conformist | Eventos `session.*` | Métricas consome os eventos crus, aderindo ao vocabulário definido pelo serviço de sessões. |
| Gerenciamento de Usuários (`user-engine`) | Orquestração de Acesso (`api-gateway`) | Open Host Service | REST/gRPC interno | O gateway é consumidor das APIs de identidade, respeitando políticas de autenticação centralizadas. |
| Gerenciamento de Usuários (`user-engine`) | Execução de Sessões (`quiz-session-service`) | Open Host Service | REST interno | A sessão consulta perfis/histórico; altera critérios de customização de pacotes. |
| Execução de Sessões (`quiz-session-service`) | Compliance & Retenção (`janitor`) | Published Language + Policy | Eventos `session.*` | O janitor agenda expirations com base nos eventos de sessão. |
| Contratos Event-Driven (`schema-registry`) | Todos os produtores e consumidores de eventos | Shared Kernel | Repositório git + pipelines de validação | Garante evolução versionada dos contratos e testes de compatibilidade antes de promover releases. |

## Fluxo Principal (ASCII)

```
Frontend → API Gateway → ingest.uploaded.* → Parsed PDF → ingest.parsed.* → Embedder
          → ingest.embedded.* → Indexer → ingest.indexed.* → Workflow Agentes
          → quiz.generated → Quiz Session Service → session.* → Metrics Engine
                                      ↘
                                       ↘ HTTP → Reviewer Proxy → LLM Provider

Quiz Session Service ⇄ User Engine (identidade)
Janitor ⇐ ingest.* / session.* + leituras Qdrant para TTL
```

## Observações

- A dependência por eventos reforça um vocabulário comum (Published Language) governado pelo `schema-registry`, reduzindo acoplamento acidental.
- Onde existe necessidade de customização (Workflow ↔ Sessions), o padrão Customer/Supplier incentiva feedback contínuo e versionamento cuidadoso.
- A camada `reviewer-proxy` evita que o domínio core precise de anti-corruption layers duplicados sempre que o provedor de LLM mudar contratos ou limites.
- Serviços que apenas consomem eventos (`metrics-engine`, `janitor`) optaram por Conformist para privilegiar simplicidade; mudanças de contrato devem ser orquestradas via versionamento de eventos.
