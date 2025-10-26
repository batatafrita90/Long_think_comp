import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { SessionsList } from '@/components/session/sessions-list';

function renderComponent(fetcher = async () => []) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <SessionsList fetcher={fetcher} />
    </SWRConfig>,
  );
}

describe('SessionsList', () => {
  it('renderiza sessões retornadas pelo serviço', async () => {
    const fetcher = async () => [
      { execution_id: 'exec-1', session_id: 'sess-1', status: 'active', percent: 50 },
      { execution_id: 'exec-2', session_id: 'sess-2', status: 'completed', percent: 100 },
    ];

    renderComponent(fetcher);

    expect(await screen.findByText('exec-1')).toBeInTheDocument();
    expect(await screen.findByText('exec-2')).toBeInTheDocument();
    expect(screen.getByText(/Em andamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Concluída/i)).toBeInTheDocument();
  });
});
