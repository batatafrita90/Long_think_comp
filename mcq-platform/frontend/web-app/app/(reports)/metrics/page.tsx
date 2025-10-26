import { MetricsDashboard } from '@/components/reports/metrics-dashboard';

export default function MetricsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Observabilidade pedagógica
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">Métricas e análises</h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Consolida indicadores provenientes do metrics-engine. Acompanhe a evolução das sessões,
          acurácia, feedbacks e outras métricas relevantes para QA dos agentes.
        </p>
      </header>

      <MetricsDashboard />
    </section>
  );
}
