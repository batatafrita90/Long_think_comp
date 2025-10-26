'use client';

import * as React from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { listSessions, type SessionSummary } from '@/lib/api/quiz-session-service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type SessionsListProps = {
  fetcher?: typeof listSessions;
};

export function SessionsList({ fetcher = listSessions }: SessionsListProps = {}) {
  const [query, setQuery] = React.useState('');
  const { data, isLoading, error, mutate } = useSWR('sessions', () => fetcher(), {
    refreshInterval: 5000,
  });

  const sessions = (data ?? []).filter((session) =>
    [session.execution_id, session.session_id]
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          className="w-full max-w-xs"
          placeholder="Filtrar por execution ou session ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button variant="outline" onClick={() => mutate()}>
          Atualizar agora
        </Button>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Carregando sessões…</p>}
      {error && (
        <p className="text-sm text-red-600">
          Erro ao carregar sessões: {error instanceof Error ? error.message : 'desconhecido'}
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Execution</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <SessionRow key={session.execution_id} session={session} />
          ))}
          {!isLoading && sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-sm text-neutral-500">
                Nenhuma sessão encontrada. Inicie o workflow ou aguarde a geração de itens.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function SessionRow({ session }: { session: SessionSummary }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-neutral-900">{session.execution_id}</TableCell>
      <TableCell>{session.session_id}</TableCell>
      <TableCell>
        <Badge variant={badgeVariant(session.status)}>{labelForStatus(session.status)}</Badge>
      </TableCell>
      <TableCell>{session.percent != null ? `${session.percent}%` : '—'}</TableCell>
      <TableCell className="text-right">
        <Button asChild variant="secondary">
          <Link href={`/sessions/${session.execution_id}`}>Abrir</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function badgeVariant(status: SessionSummary['status']) {
  switch (status) {
    case 'waiting':
      return 'warning';
    case 'active':
      return 'secondary';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}

function labelForStatus(status: SessionSummary['status']) {
  switch (status) {
    case 'waiting':
      return 'Aguardando';
    case 'active':
      return 'Em andamento';
    case 'completed':
      return 'Concluída';
    default:
      return status;
  }
}
