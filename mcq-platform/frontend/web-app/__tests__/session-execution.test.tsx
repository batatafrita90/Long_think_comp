import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { SessionExecutionPanel } from '@/components/session/session-execution';

const useMockStream = () => ({
  isConnected: true,
  events: [
    { type: 'progress', payload: { stage: 'especialista', percent: 70 } },
    {
      type: 'item',
      payload: {
        item_id: 'item-1',
        stem: 'Pergunta exemplo?',
        options: ['Opção A', 'Opção B'],
      },
    },
  ],
});

function renderPanel() {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <SessionExecutionPanel
        executionId="exec-1"
        useStream={useMockStream}
        fetchDetails={async () => ({ execution_id: 'exec-1', session_id: 'sess-1', status: 'active' })}
        answerFn={async () => ({ correct: true })}
        dislikeFn={async () => undefined}
        regenerateFn={async () => undefined}
      />
    </SWRConfig>,
  );
}

describe('SessionExecutionPanel', () => {
  it('exibe item atual e envia resposta', async () => {
    renderPanel();

    expect(await screen.findByText(/Pergunta exemplo/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /enviar resposta/i }));

    await waitFor(() => expect(screen.getByText(/Resposta correta/i)).toBeInTheDocument());
  });
});
