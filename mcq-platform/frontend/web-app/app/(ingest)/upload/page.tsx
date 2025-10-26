import Link from 'next/link';
import { UploadForm } from '@/components/ingest/upload-form';

export default function UploadPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pipeline de ingestão
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Envio de conteúdo e monitoramento do pipeline
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Esta área conversa com o `api-gateway`, publicando `ingest.uploaded` no NATS JetStream.
          Acompanhe o status emitido pelos serviços `parsed-pdf`, `embedder` e `indexer` enquanto o
          workflow-agentes prepara a sessão.
        </p>
      </header>

      <UploadForm />

      <footer className="flex flex-wrap gap-3 text-xs text-neutral-500">
        <Link
          href="/sessions"
          className="rounded bg-neutral-900 px-3 py-2 font-semibold text-white transition hover:bg-neutral-800"
        >
          Ir para sessões
        </Link>
        <span>Eventos consumidos: `ingest.*`, `agents.status.*`</span>
      </footer>
    </section>
  );
}
