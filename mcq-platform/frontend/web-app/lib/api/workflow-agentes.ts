const WORKFLOW_BASE =
  process.env.NEXT_PUBLIC_WORKFLOW_SERVICE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error('Configure NEXT_PUBLIC_WORKFLOW_SERVICE_URL ou NEXT_PUBLIC_API_URL');
  })();

function buildUrl(path: string) {
  return `${WORKFLOW_BASE.replace(/\/$/, '')}${path}`;
}

async function jsonOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || 'Falha na chamada workflow-agentes');
  }
  return response.json() as Promise<T>;
}

export type TriggerWorkflowRequest = {
  session_id: string;
};

export type TriggerWorkflowResponse = {
  run_id: string;
  status: 'accepted';
};

export async function triggerWorkflow(
  payload: TriggerWorkflowRequest,
  signal?: AbortSignal,
) {
  const response = await fetch(buildUrl('/internal/v1/run'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  return jsonOrThrow<TriggerWorkflowResponse>(response);
}

export type WorkflowStatus = {
  run_id: string;
  stage: string;
  percent: number;
  retries: {
    enunciado?: number;
    alternativas?: number;
    revisor?: number;
    [agent: string]: number | undefined;
  };
};

export async function getWorkflowStatus(runId: string, signal?: AbortSignal) {
  const response = await fetch(buildUrl(`/internal/v1/status/${runId}`), {
    method: 'GET',
    signal,
    cache: 'no-store',
  });

  return jsonOrThrow<WorkflowStatus>(response);
}
