const SESSION_BASE =
  process.env.NEXT_PUBLIC_SESSION_SERVICE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error('Configure NEXT_PUBLIC_SESSION_SERVICE_URL ou NEXT_PUBLIC_API_URL');
  })();

function url(path: string) {
  return `${SESSION_BASE.replace(/\/$/, '')}${path}`;
}

async function toJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || 'Falha na chamada ao quiz-session-service');
  }
  return response.json() as Promise<T>;
}

async function request<T>(input: RequestInfo, init?: RequestInit) {
  return toJson<T>(await fetch(input, init));
}

export type SessionSummary = {
  execution_id: string;
  session_id: string;
  status: 'waiting' | 'active' | 'completed';
  percent?: number;
  updated_at?: string;
};

export async function listSessions(signal?: AbortSignal) {
  return request<SessionSummary[]>(url('/internal/sessions'), {
    method: 'GET',
    signal,
    cache: 'no-store',
  });
}

export async function fetchSessionDetails(executionId: string, signal?: AbortSignal) {
  return request<SessionSummary>(url(`/internal/sessions/${executionId}`), {
    signal,
    cache: 'no-store',
  });
}

export type StartExecutionRequest = {
  session_id: string;
};

export type StartExecutionResponse = {
  execution_id: string;
  status: 'waiting' | 'active';
  first_item?: unknown;
};

export async function startExecution(payload: StartExecutionRequest, signal?: AbortSignal) {
  const response = await fetch(url('/api/v1/start'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  return toJson<StartExecutionResponse>(response);
}

export type AnswerPayload = {
  item_id: string;
  option: string;
};

export type AnswerResponse = {
  correct: boolean;
  next_item?: unknown;
  completed?: boolean;
};

export async function submitSessionAnswer(
  executionId: string,
  payload: AnswerPayload,
  signal?: AbortSignal,
) {
  const response = await fetch(url(`/api/v1/${executionId}/answer`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  return toJson<AnswerResponse>(response);
}

export type DislikePayload = {
  item_id: string;
  reason: string;
};

export async function sendDislike(
  executionId: string,
  payload: DislikePayload,
  signal?: AbortSignal,
) {
  const response = await fetch(url(`/api/v1/${executionId}/feedback/dislike`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(text || 'Falha ao registrar dislike');
  }
}

export type RegeneratePayload = {
  context_snapshot?: unknown;
};

export async function requestItemRegeneration(
  executionId: string,
  itemId: string,
  payload: RegeneratePayload,
  signal?: AbortSignal,
) {
  const response = await fetch(url(`/api/v1/${executionId}/item/${itemId}/regenerate`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(text || 'Falha ao solicitar regeneração');
  }
}
