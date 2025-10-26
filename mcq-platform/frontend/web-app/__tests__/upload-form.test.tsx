import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { UploadForm } from '@/components/ingest/upload-form';

function renderWithSWR(ui: React.ReactElement) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      {ui}
    </SWRConfig>,
  );
}

describe('UploadForm', () => {
  it('permite enviar arquivo e aciona workflow', async () => {
    const uploadFn = jest.fn(() => Promise.resolve({ session_id: 'sess-123', status: 'queued' }));
    const triggerFn = jest.fn(() => Promise.resolve({ run_id: 'run-123', status: 'accepted' }));
    const statusFetcher = jest.fn(() =>
      Promise.resolve({
        run_id: 'run-123',
        stage: 'especialista.itens',
        percent: 80,
        retries: { enunciado: 1 },
      }),
    );

    renderWithSWR(
      <UploadForm uploadFn={uploadFn} triggerFn={triggerFn} statusFetcher={statusFetcher} />,
    );

    const file = new File(['conteudo'], 'exemplo.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/arquivo pdf/i);
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /enviar arquivo/i }));

    await waitFor(() => expect(uploadFn).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: /acionar workflow/i }));
    await waitFor(() => expect(triggerFn).toHaveBeenCalledWith({ session_id: 'sess-123' }));

    expect(await screen.findByText(/run id/i)).toBeInTheDocument();
  });
});
