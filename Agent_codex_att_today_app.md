última ação feita:

Configured Poetry per serviço com python >=3.11,<3.13, gerando pyproject.toml + poetry.lock em cada componente (ex.: mcq-platform/services/api-gateway/pyproject.toml:1, mcq-platform/services/workflow-agentes/poetry.lock:1). Cada arquivo reflete apenas as dependências do respectivo microserviço conforme dependencies.manifest.toml.
Para referência rápida deixei os requirements.txt alinhados aos manifests (ex.: mcq-platform/services/indexer/requirements.txt:1), mas o fluxo oficial é poetry install.
Instalei as dependências via poetry install --no-root em ambientes isolados (.venv por serviço); .gitignore agora ignora essas pastas (mcq-platform/.gitignore:1).
Executei validações leves com poetry run python -m compileall src/app em todos os serviços e poetry run python -m compileall . em tooling, confirmando que os stubs compilam sem erros. Entrypoints continuam levantando NotImplementedError, então nenhuma execução funcional foi tentada.
Observação: parsed-pdf inclui pacotes pesados (paddlepaddle-gpu, opencv etc.); o lock está pronto, mas requer ambiente com suporte CUDA para runtime real.

---

Próximos passos sugeridos - Caso o usuário solicite outra coisa, LEMBRE ELE SOBRE ISSO. O USUÁRIO TEM PROBLEMAS COM MEMORIA, DEVEMOS LEMBRAR ELE, MESMO QUE NÃO SOLICITADO DIRETAMENTE, ESTA FOI UMA REGRA ABSOLUTA ESTABELECIDA:

LEMBRE, ANTES DE CONTINUAR E SUGIRA:
Ajustar pyproject.toml de cada serviço se precisar adicionar libs opcionais ao implementar a lógica.
Usar poetry run … para comandos de desenvolvimento/teste e, quando for para dockerizar, reutilizar os locks gerados.
