'use client';

import useSWR from 'swr';
import { listRecentSessions } from '@/lib/api/metrics-engine';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type HistoryTableProps = {
  fetcher?: typeof listRecentSessions;
};

export function HistoryTable({ fetcher = listRecentSessions }: HistoryTableProps = {}) {
  const { data, error, isLoading } = useSWR('metrics:recent-sessions', () => fetcher(), {
    refreshInterval: 10000,
  });

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
        Erro ao carregar histórico: {error instanceof Error ? error.message : 'desconhecido'}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Execução</TableHead>
          <TableHead>Sessão</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Acurácia</TableHead>
          <TableHead>Feedbacks negativos</TableHead>
          <TableHead>Finalizada</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6} className="text-sm text-neutral-500">
              Carregando sessões concluídas…
            </TableCell>
          </TableRow>
        )}
        {(data ?? []).map((session) => (
          <TableRow key={session.execution_id}>
            <TableCell className="font-medium text-neutral-900">{session.execution_id}</TableCell>
            <TableCell>{session.session_id}</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {session.score}/{session.total}
              </Badge>
            </TableCell>
            <TableCell>{Math.round(session.accuracy * 100)}%</TableCell>
            <TableCell>{session.feedback_negative}</TableCell>
            <TableCell className="text-neutral-600">
              {new Date(session.finished_at).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
        {!isLoading && (data ?? []).length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-sm text-neutral-500">
              Nenhuma sessão concluída nas últimas 24h.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
