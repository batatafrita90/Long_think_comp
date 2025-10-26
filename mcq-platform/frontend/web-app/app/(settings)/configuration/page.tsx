import { ConfigurationForm } from '@/components/settings/config-form';

export default function ConfigurationPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Configurações da plataforma
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">Parâmetros e integrações</h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          Ajuste credenciais, políticas e limites dos microserviços. Este formulário serve como base
          para integração com o `user-engine` ou um config-service dedicado.
        </p>
      </header>

      <ConfigurationForm />
    </section>
  );
}
