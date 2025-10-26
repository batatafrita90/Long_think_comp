import { Suspense } from 'react';
import { SessionExecutionPanel } from '@/components/session/session-execution';

type PageProps = {
  params: { execution: string };
};

export default function SessionExecutionPage({ params }: PageProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Sessão em andamento
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">Execução {params.execution}</h1>
        <p className="max-w-3xl text-sm text-neutral-600">
          Conectado ao `quiz-session-service` via SSE/WebSocket. Visualize o item atual, acompanhe o
          progresso do workflow e interaja com os microserviços de feedback/regeneração.
        </p>
      </header>

      <Suspense fallback={<p className="text-sm text-neutral-500">Carregando sessão…</p>}>
        <SessionExecutionPanel executionId={params.execution} />
      </Suspense>
    </section>
  );
}
