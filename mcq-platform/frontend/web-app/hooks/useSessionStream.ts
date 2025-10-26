'use client';

import { useEffect, useRef, useState } from 'react';

type SessionEvent =
  | { type: 'progress'; payload: unknown }
  | { type: 'item'; payload: unknown }
  | { type: 'regenerated'; payload: unknown }
  | { type: 'finished'; payload: unknown };

/**
 * Hook de utilidade para consumir o SSE do quiz-session-service.
 * Substituir o `EventSource` por um client real quando o backend estiver disponível.
 */
export function useSessionStream(executionId: string | undefined) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    if (!executionId) {
      return undefined;
    }

    const url = `${process.env.NEXT_PUBLIC_SSE_URL ?? ''}/api/v1/${executionId}/stream`;
    const stream = new EventSource(url);
    eventSourceRef.current = stream;

    stream.onopen = () => setConnected(true);
    stream.onerror = () => setConnected(false);

    stream.addEventListener('progress', (event) => {
      setEvents((current) => [...current, { type: 'progress', payload: safeParse(event.data) }]);
    });

    stream.addEventListener('item', (event) => {
      setEvents((current) => [...current, { type: 'item', payload: safeParse(event.data) }]);
    });

    stream.addEventListener('regenerated', (event) => {
      setEvents((current) => [
        ...current,
        { type: 'regenerated', payload: safeParse(event.data) },
      ]);
    });

    stream.addEventListener('finished', (event) => {
      setEvents((current) => [...current, { type: 'finished', payload: safeParse(event.data) }]);
    });

    return () => {
      stream.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [executionId]);

  return { events, isConnected };
}

function safeParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Falha ao interpretar evento SSE', error);
    return null;
  }
}
