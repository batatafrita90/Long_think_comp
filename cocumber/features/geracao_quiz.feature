# language: pt
# tags: @focoLangGraph @critico
Funcionalidade: Geração de questionários de múltipla escolha
  Como acadêmico de medicina
  Quero gerar quizzes a partir de minhas anotações
  Para reforçar o aprendizado com o apoio da taxonomia de Bloom

  Contexto:
    Dado que o sistema possui ingestão de PDFs habilitada

  Cenário: Upload de arquivo válido
    Quando envio um PDF de estudos pelo gateway
    Então o workflow deve publicar o evento "ingest.uploaded"
    E o serviço Parsed PDF deve reconhecer o documento

  Cenário: Revisão com LLM disponível
    Dado que a orquestração de agentes está operacional
    Quando solicito a geração de um novo quiz
    Então o serviço Reviewer Proxy deve validar a requisição ao LLM
    E o serviço Quiz Session Service deve disponibilizar o pacote gerado
