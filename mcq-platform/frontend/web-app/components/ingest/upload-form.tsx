'use client';

import * as React from 'react';
import useSWR from 'swr';
import { uploadDocument } from '@/lib/api/api-gateway';
import {
  getWorkflowStatus,
  triggerWorkflow,
  type TriggerWorkflowResponse,
} from '@/lib/api/workflow-agentes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type UploadStep = 'idle' | 'uploading' | 'uploaded' | 'triggered';

type UploadFormProps = {
  uploadFn?: typeof uploadDocument;
  triggerFn?: typeof triggerWorkflow;
  statusFetcher?: typeof getWorkflowStatus;
};

export function UploadForm({
  uploadFn = uploadDocument,
  triggerFn = triggerWorkflow,
  statusFetcher = getWorkflowStatus,
}: UploadFormProps = {}) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [step, setStep] = React.useState<UploadStep>('idle');
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [runId, setRunId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [triggerResponse, setTriggerResponse] = React.useState<TriggerWorkflowResponse | null>(null);

  const { data: workflowStatus } = useSWR(
    runId ? ['workflow-status', runId] : null,
    async () => statusFetcher(runId!),
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
    },
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    setFile(nextFile ?? null);
    setStep('idle');
    setError(null);
    setSessionId(null);
    setRunId(null);
    setTriggerResponse(null);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Selecione um arquivo PDF antes de enviar.');
      return;
    }

    try {
      setError(null);
      setStep('uploading');
      const response = await uploadFn(file);
      setSessionId(response.session_id);
      setStep('uploaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar arquivo.');
      setStep('idle');
    }
  };

  const handleTrigger = async () => {
    if (!sessionId) {
      return;
    }
    try {
      setError(null);
      const response = await triggerFn({ session_id: sessionId });
      setTriggerResponse(response);
      setRunId(response.run_id);
      setStep('triggered');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível acionar o workflow.');
    }
  };

  const reset = () => {
    setFile(null);
    setStep('idle');
    setError(null);
    setRunId(null);
    setSessionId(null);
    setTriggerResponse(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload de PDF</CardTitle>
          <CardDescription>
            O arquivo será armazenado no Supabase Storage (TTL 24h) e enviará eventos NATS para o
            pipeline `parsed-pdf` → `embedder` → `indexer`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleUpload}>
            <div className="space-y-2">
              <Label htmlFor="pdf">Arquivo PDF</Label>
              <Input
                ref={fileInputRef}
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!file || step === 'uploading'}>
                {step === 'uploading' ? 'Enviando…' : 'Enviar arquivo'}
              </Button>
              <Button type="button" variant="secondary" onClick={reset}>
                Limpar seleção
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleTrigger}
                disabled={!sessionId || step === 'uploading'}
              >
                Acionar workflow
              </Button>
            </div>
          </form>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <section className="space-y-2 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-neutral-900">Status atual:</span>
              <Badge variant={badgeVariantForStep(step)}>{stepLabel(step)}</Badge>
            </div>
            {sessionId && (
              <p>
                <span className="font-medium text-neutral-900">Session ID:</span> {sessionId}
              </p>
            )}
            {triggerResponse && (
              <p>
                <span className="font-medium text-neutral-900">Run ID:</span> {triggerResponse.run_id}
              </p>
            )}
          </section>
        </CardContent>
      </Card>

      <Card className={cn(!runId && 'opacity-50')}>
        <CardHeader>
          <CardTitle>Progresso do Workflow</CardTitle>
          <CardDescription>
            Dados provenientes de <code>/internal/v1/status/{'{run_id}'}</code>. Atualiza a cada 3s.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflowStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Stage atual</p>
                  <p className="text-lg font-semibold text-neutral-900">{workflowStatus.stage}</p>
                </div>
                <Badge variant="secondary">{workflowStatus.percent}%</Badge>
              </div>
              <Progress value={workflowStatus.percent} />
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">Retries por agente</h3>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agente</TableHead>
                      <TableHead>Tentativas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(workflowStatus.retries ?? {}).map(([agent, count]) => (
                      <TableRow key={agent}>
                        <TableCell className="font-medium text-neutral-800">{agent}</TableCell>
                        <TableCell>{count ?? 0}</TableCell>
                      </TableRow>
                    ))}
                    {Object.keys(workflowStatus.retries ?? {}).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-neutral-500">
                          Nenhuma tentativa registrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              Acione o workflow para visualizar o progresso em tempo real.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function stepLabel(step: UploadStep) {
  switch (step) {
    case 'idle':
      return 'Aguardando';
    case 'uploading':
      return 'Enviando arquivo';
    case 'uploaded':
      return 'Arquivo enviado';
    case 'triggered':
      return 'Workflow acionado';
    default:
      return step;
  }
}

function badgeVariantForStep(step: UploadStep) {
  switch (step) {
    case 'idle':
      return 'default';
    case 'uploading':
      return 'warning';
    case 'uploaded':
      return 'secondary';
    case 'triggered':
      return 'success';
    default:
      return 'default';
  }
}
