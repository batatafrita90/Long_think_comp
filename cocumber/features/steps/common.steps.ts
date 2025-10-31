import { Given, When, Then } from "@cucumber/cucumber";
import { McqWorld } from "../support/world";

Given("que o sistema possui ingestão de PDFs habilitada", async function (this: McqWorld) {
  // TODO: inicializar contexto compartilhado quando o serviço estiver implementado.
});

When("envio um PDF de estudos pelo gateway", async function (this: McqWorld) {
  // TODO: invocar API Gateway simulando upload com arquivo válido.
});

Then('o workflow deve publicar o evento "ingest.uploaded"', async function (this: McqWorld) {
  // TODO: validar publicação no NATS JetStream ou em um stub equivalente.
});

Then("o serviço Parsed PDF deve reconhecer o documento", async function (this: McqWorld) {
  // TODO: esperar processamento do parsed-pdf e validar resposta/evento.
});

Given("que a orquestração de agentes está operacional", async function (this: McqWorld) {
  // TODO: garantir que workflow-agentes esteja ativo para os testes.
});

When("solicito a geração de um novo quiz", async function (this: McqWorld) {
  // TODO: emitir requisição ao workflow-agentes usando contrato publicado.
});

Then("o serviço Reviewer Proxy deve validar a requisição ao LLM", async function (this: McqWorld) {
  // TODO: inspecionar logs ou mocks do reviewer-proxy para garantir validação.
});

Then("o serviço Quiz Session Service deve disponibilizar o pacote gerado", async function (this: McqWorld) {
  // TODO: consultar API/stream do quiz-session-service e validar payload.
});
