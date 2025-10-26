const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error('NEXT_PUBLIC_API_URL não definido');
  })();

function resolveUrl(path: string) {
  return `${API_BASE.replace(/\/$/, '')}${path}`;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => 'Falha desconhecida');
    throw new Error(text || response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type UploadDocumentResponse = {
  session_id: string;
  status: 'queued' | 'processing';
  expire_at?: string;
};

export async function uploadDocument(file: File, signal?: AbortSignal) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(resolveUrl('/api/v1/upload'), {
    method: 'POST',
    body: formData,
    signal,
  });

  return handleResponse<UploadDocumentResponse>(response);
}

export type StartSessionRequest = {
  session_id: string;
};

export type StartSessionResponse = {
  execution_id: string;
  status: 'waiting' | 'active';
  first_item?: unknown;
};

export async function startSession(payload: StartSessionRequest, signal?: AbortSignal) {
  const response = await fetch(resolveUrl('/api/v1/sessions/start'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  return handleResponse<StartSessionResponse>(response);
}

export type SubmitAnswerRequest = {
  item_id: string;
  option: string;
};

export type SubmitAnswerResponse = {
  correct: boolean;
  next_item?: unknown;
  completed?: boolean;
};

export async function submitAnswer(
  executionId: string,
  payload: SubmitAnswerRequest,
  signal?: AbortSignal,
) {
  const response = await fetch(resolveUrl(`/api/v1/sessions/${executionId}/answer`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  return handleResponse<SubmitAnswerResponse>(response);
}

export type SessionResults = {
  execution_id: string;
  score: number;
  total: number;
  finished_at: string;
  answers: Array<{
    item_id: string;
    correct: boolean;
    option: string;
    answer: string;
  }>;
};

export async function fetchSessionResults(executionId: string, signal?: AbortSignal) {
  const response = await fetch(resolveUrl(`/api/v1/sessions/${executionId}/results`), {
    method: 'GET',
    signal,
    cache: 'no-store',
  });

  return handleResponse<SessionResults>(response);
}
