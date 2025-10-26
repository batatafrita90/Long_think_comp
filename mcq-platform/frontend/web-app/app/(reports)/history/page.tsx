import { HistoryTable } from '@/components/reports/history-table';

export default function HistoryPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Histórico consolidado
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">Sessões concluídas e feedbacks</h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Dados coletados do metrics-engine e Supabase. Utilize este painel para auditar execuções,
          revisar notas e validar eventos de feedback enviados ao workflow-agentes.
        </p>
      </header>

      <HistoryTable />
    </section>
  );
}
