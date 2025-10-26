import Link from 'next/link';

const sections: Array<{ title: string; description: string; href: string }> = [
  {
    title: 'Ingestão de Conteúdo',
    description:
      'Envie PDFs e acompanhe o pipeline de parsing, embeddings e indexação controlado pelo workflow-agentes.',
    href: '/upload',
  },
  {
    title: 'Sessões MCQ',
    description:
      'Monitore o progresso da geração de questões e conduza sessões interativas em tempo real.',
    href: '/sessions',
  },
  {
    title: 'Histórico',
    description:
      'Consulte sessões concluídas, respostas cadastradas e feedbacks dos usuários.',
    href: '/history',
  },
  {
    title: 'Métricas',
    description:
      'Explore indicadores agregados pelo metrics-engine e acompanhe desempenho por usuário ou tópico.',
    href: '/metrics',
  },
  {
    title: 'Configuração',
    description:
      'Gerencie integrações, chaves de serviço e parâmetros por microserviço.',
    href: '/configuration',
  },
];

export default function OverviewPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          MCQ Platform Frontend
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Console unificado para orquestrar o fluxo de ingestão, geração e execução de questões.
          Cada seção conversa com um microserviço dedicado via API Gateway, Supabase e NATS
          JetStream.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-medium text-neutral-900 group-hover:text-neutral-700">
              {section.title}
            </h2>
            <p className="text-sm text-neutral-600">{section.description}</p>
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Acessar &rarr;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
