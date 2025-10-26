import Link from 'next/link';
import { SessionsList } from '@/components/session/sessions-list';

export default function SessionsLandingPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Sessões ativas
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Gerencie sessões MCQ em tempo real
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Esta área integra o `quiz-session-service`. Use esta página para listar sessões em aberto,
          retomar execuções e iniciar novas jornadas assim que os itens forem gerados pelo
          workflow-agentes.
        </p>
      </header>

      <SessionsList />

      <footer className="flex flex-wrap gap-3 text-xs text-neutral-500">
        <Link
          href="/sessions/example-execution"
          className="rounded bg-neutral-900 px-3 py-2 font-semibold text-white transition hover:bg-neutral-800"
        >
          Abrir sessão demonstrativa
        </Link>
        <span>SSE/WebSocket: `/api/v1/{execution}/stream`</span>
      </footer>
    </section>
  );
}
