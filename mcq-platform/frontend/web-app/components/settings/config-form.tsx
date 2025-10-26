'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ConfigState = {
  supabaseUrl: string;
  supabaseKey: string;
  natsUrl: string;
  workflowRetries: number;
  sessionAutostart: boolean;
  reviewerPolicy: string;
};

export function ConfigurationForm() {
  const [state, setState] = React.useState<ConfigState>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    natsUrl: 'nats://nats:4222',
    workflowRetries: 3,
    sessionAutostart: true,
    reviewerPolicy: 'Respeitar guidelines e bloquear conteúdo sensível automaticamente.',
  });
  const [message, setMessage] = React.useState<string | null>(null);

  const handleChange = (key: keyof ConfigState) => (value: string | boolean | number) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder para integração com user-engine/config-service.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setMessage('Configurações salvas localmente. Implemente a persistência via user-engine.');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Integrações fundamentais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input
              id="supabase-url"
              value={state.supabaseUrl}
              onChange={(event) => handleChange('supabaseUrl')(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-key">Supabase Service Role</Label>
            <Input
              id="supabase-key"
              type="password"
              value={state.supabaseKey}
              onChange={(event) => handleChange('supabaseKey')(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nats-url">NATS JetStream URL</Label>
            <Input
              id="nats-url"
              value={state.natsUrl}
              onChange={(event) => handleChange('natsUrl')(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow-agentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retries">Número máximo de retries</Label>
            <Input
              id="retries"
              type="number"
              min={0}
              value={state.workflowRetries}
              onChange={(event) => handleChange('workflowRetries')(Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewer-policy">Política do reviewer-proxy</Label>
            <Textarea
              id="reviewer-policy"
              value={state.reviewerPolicy}
              onChange={(event) => handleChange('reviewerPolicy')(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Session Service</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div>
            <p className="text-sm font-medium text-neutral-800">Sessão automática</p>
            <p className="text-xs text-neutral-500">
              Iniciar imediatamente após o `quiz.generated` ou aguardar interação manual.
            </p>
          </div>
          <Switch
            checked={state.sessionAutostart}
            onCheckedChange={(checked) => handleChange('sessionAutostart')(checked)}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit">Salvar configurações</Button>
        {message && <span className="text-sm text-neutral-500">{message}</span>}
      </div>
    </form>
  );
}
