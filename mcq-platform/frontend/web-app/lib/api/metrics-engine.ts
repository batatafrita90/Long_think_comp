const METRICS_BASE =
  process.env.NEXT_PUBLIC_METRICS_SERVICE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error('Configure NEXT_PUBLIC_METRICS_SERVICE_URL ou NEXT_PUBLIC_API_URL');
  })();

function build(path: string) {
  return `${METRICS_BASE.replace(/\/$/, '')}${path}`;
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(text || 'Falha na chamada ao metrics-engine');
  }
  return response.json() as Promise<T>;
}

export type SessionMetrics = {
  execution_id: string;
  session_id: string;
  score: number;
  total: number;
  accuracy: number;
  feedback_negative: number;
  finished_at: string;
};

export async function listRecentSessions(signal?: AbortSignal) {
  return parse<SessionMetrics[]>(await fetch(build('/internal/v1/metrics/sessions/recent'), {
    method: 'GET',
    signal,
    cache: 'no-store',
  }));
}

export type AggregatedMetric = {
  label: string;
  value: number;
  delta?: number;
  unit?: string;
};

export async function fetchAggregatedMetrics(signal?: AbortSignal) {
  return parse<AggregatedMetric[]>(await fetch(build('/internal/v1/metrics/aggregated'), {
    method: 'GET',
    signal,
    cache: 'no-store',
  }));
}
