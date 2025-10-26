import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigurationForm } from '@/components/settings/config-form';

describe('ConfigurationForm', () => {
  it('permite alterar valores e salvar', async () => {
    render(<ConfigurationForm />);

    const input = screen.getByLabelText(/supabase url/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://example.supabase.co' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar configurações/i }));

    expect(await screen.findByText(/Configurações salvas/i)).toBeInTheDocument();
  });
});
