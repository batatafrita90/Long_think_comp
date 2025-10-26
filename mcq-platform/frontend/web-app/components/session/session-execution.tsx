'use client';

import * as React from 'react';
import useSWR from 'swr';
import { useSessionStream } from '@/hooks/useSessionStream';
import {
  fetchSessionDetails,
  requestItemRegeneration,
  sendDislike,
  submitSessionAnswer,
  type AnswerResponse,
} from '@/lib/api/quiz-session-service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SessionExecutionPanelProps = {
  executionId: string;
  fetchDetails?: typeof fetchSessionDetails;
  answerFn?: typeof submitSessionAnswer;
  dislikeFn?: typeof sendDislike;
  regenerateFn?: typeof requestItemRegeneration;
  useStream?: typeof useSessionStream;
};

type MCQItem = {
  item_id: string;
  stem: string;
  options: Array<{ id: string; label: string }>;
  rationale?: string;
};

export function SessionExecutionPanel({ executionId, fetchDetails, answerFn, dislikeFn, regenerateFn, useStream }: SessionExecutionPanelProps) {
  const streamHook = useStream ?? useSessionStream;
  const { data: details } = useSWR(['session-details', executionId], () =>
    (fetchDetails ?? fetchSessionDetails)(executionId),
  );
  const { events, isConnected } = streamHook(executionId);
  

  const [currentItem, setCurrentItem] = React.useState<MCQItem | null>(null);
  const [progressValue, setProgressValue] = React.useState<number>(0);
  const [progressStage, setProgressStage] = React.useState<string>('Aguardando');
  const [history, setHistory] = React.useState<Array<{ item_id: string; correct: boolean }>>([]);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [answerError, setAnswerError] = React.useState<string | null>(null);
  const [dislikeReason, setDislikeReason] = React.useState('');
  const [regenerationContext, setRegenerationContext] = React.useState('');
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const lastEvent = events.at(-1);
    if (!lastEvent) {
      return;
    }

    switch (lastEvent.type) {
      case 'item':
        if (lastEvent.payload) {
          const payload = lastEvent.payload as {
            item_id: string;
            stem: string;
            options: string[];
            rationale?: string;
          };
          setCurrentItem({
            item_id: payload.item_id,
            stem: payload.stem,
            rationale: payload.rationale,
            options: payload.options.map((option, index) => ({
              id: String(index),
              label: option,
            })),
          });
          setSelectedOption(null);
          setActionMessage(null);
        }
        break;
      case 'progress':
        if (lastEvent.payload) {
          const payload = lastEvent.payload as { percent?: number; stage?: string };
          setProgressValue(payload.percent ?? 0);
          setProgressStage(payload.stage ?? 'Processando');
        }
        break;
      case 'finished':
        setActionMessage('Sessão concluída! Consulte os resultados no painel de histórico.');
        break;
      default:
        break;
    }
  }, [events]);

  const submitAnswer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentItem || !selectedOption) {
      setAnswerError('Selecione uma alternativa antes de enviar.');
      return;
    }

    try {
      setAnswerError(null);
      const response = await (answerFn ?? submitSessionAnswer)(executionId, {
        item_id: currentItem.item_id,
        option: selectedOption,
      });
      handleAnswerResponse(currentItem.item_id, response);
      setActionMessage(response.correct ? 'Resposta correta!' : 'Resposta registrada.');
    } catch (err) {
      setAnswerError(err instanceof Error ? err.message : 'Erro ao enviar resposta.');
    }
  };

  const handleAnswerResponse = (itemId: string, response: AnswerResponse) => {
    setHistory((history) => [...history, { item_id: itemId, correct: response.correct }]);
    if (response.next_item && typeof response.next_item === 'object') {
      const payload = response.next_item as MCQItem & { options: string[] };
      setCurrentItem({
        item_id: payload.item_id,
        stem: payload.stem,
        rationale: payload.rationale,
        options: payload.options.map((option, index) => ({
          id: String(index),
          label: option,
        })),
      });
      setSelectedOption(null);
    }
  };

  const handleDislike = async () => {
    if (!currentItem) {
      return;
    }
    try {
      await (dislikeFn ?? sendDislike)(executionId, {
        item_id: currentItem.item_id,
        reason: dislikeReason || 'Sem motivo descritivo',
      });
      setDislikeReason('');
      setActionMessage('Feedback enviado ao workflow-agentes.');
    } catch (err) {
      setAnswerError(err instanceof Error ? err.message : 'Falha ao enviar feedback.');
    }
  };

  const handleRegenerate = async () => {
    if (!currentItem) {
      return;
    }
    try {
      await (regenerateFn ?? requestItemRegeneration)(executionId, currentItem.item_id, {
        context_snapshot: regenerationContext ? { notes: regenerationContext } : undefined,
      });
      setRegenerationContext('');
      setActionMessage('Solicitação de regeneração enviada.');
    } catch (err) {
      setAnswerError(err instanceof Error ? err.message : 'Falha ao regenerar questão.');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Item atual</CardTitle>
            <CardDescription>
              Conectado ao stream SSE do `quiz-session-service`. Status:{' '}
              <Badge variant={isConnected ? 'success' : 'danger'}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentItem ? (
              <form className="space-y-6" onSubmit={submitAnswer}>
                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                    Enunciado
                  </p>
                  <p className="whitespace-pre-line text-base text-neutral-900">{currentItem.stem}</p>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-neutral-700">
                    Alternativas
                  </legend>
                  <div className="space-y-2">
                    {currentItem.options.map((option) => (
                      <label
                        key={option.id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-sm transition hover:border-neutral-300',
                          selectedOption === option.id && 'border-neutral-900 bg-neutral-50',
                        )}
                      >
                        <input
                          type="radio"
                          className="mt-1"
                          name="option"
                          value={option.id}
                          checked={selectedOption === option.id}
                          onChange={() => setSelectedOption(option.id)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Enviar resposta</Button>
                  <Button type="button" variant="outline" onClick={handleDislike}>
                    Feedback (dislike)
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleRegenerate}>
                    Regenerar item
                  </Button>
                </div>

                {answerError && (
                  <p className="text-sm text-red-600">
                    {answerError}
                  </p>
                )}
              </form>
            ) : (
              <p className="text-sm text-neutral-500">
                Aguardando próximo item do fluxo. Certifique-se de que o workflow-agentes publicou
                `quiz.generated`.
              </p>
            )}

            {currentItem?.rationale && (
              <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm font-semibold text-neutral-800">Racional preliminar</p>
                <p className="mt-2 text-sm text-neutral-600 whitespace-pre-line">
                  {currentItem.rationale}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico da sessão</CardTitle>
            <CardDescription>
              Respostas enviadas durante esta execução. Dados serão replicados para o Supabase e
              metrics-engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.length === 0 && (
              <p className="text-sm text-neutral-500">Nenhuma resposta registrada ainda.</p>
            )}
            {history.map((entry, index) => (
              <div
                key={`${entry.item_id}-${index}`}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                <span>
                  Item <span className="font-medium text-neutral-800">{entry.item_id}</span>
                </span>
                <Badge variant={entry.correct ? 'success' : 'danger'}>
                  {entry.correct ? 'Correta' : 'Incorreta'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
            <CardDescription>Eventos `agents.status.*` convertidos pelo serviço de sessão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Stage atual</span>
              <Badge variant="secondary">{progressStage}</Badge>
            </div>
            <Progress value={progressValue} />
            <p className="text-xs text-neutral-500">Percentual reportado: {progressValue}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback & Regeneração</CardTitle>
            <CardDescription>
              Opcionalmente descreva o motivo do dislike ou o contexto para regeneração antes de enviar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dislike">Motivo do dislike</Label>
              <Textarea
                id="dislike"
                placeholder="Ex: questão ambígua, alternativa incorreta…"
                value={dislikeReason}
                onChange={(event) => setDislikeReason(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regenerate">Contexto adicional para regeneração</Label>
              <Textarea
                id="regenerate"
                placeholder="Detalhes para auxiliar o workflow na geração da nova versão."
                value={regenerationContext}
                onChange={(event) => setRegenerationContext(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadados da sessão</CardTitle>
            <CardDescription>
              Informações fornecidas pelo `quiz-session-service` ou Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-600">
            <p>
              <span className="font-medium text-neutral-800">Execution ID:</span> {executionId}
            </p>
            <p>
              <span className="font-medium text-neutral-800">Session ID:</span>{' '}
              {details?.session_id ?? '—'}
            </p>
            <p>
              <span className="font-medium text-neutral-800">Status atual:</span>{' '}
              {details?.status ?? '—'}
            </p>
          </CardContent>
        </Card>

        {actionMessage && (
          <Card>
            <CardContent>
              <p className="text-sm text-neutral-700">{actionMessage}</p>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}



