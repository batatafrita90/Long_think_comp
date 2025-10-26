import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { MetricsDashboard } from '@/components/reports/metrics-dashboard';

function renderDashboard(fetcher = async () => []) {
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MetricsDashboard fetcher={fetcher} />
    </SWRConfig>,
  );
}

describe('MetricsDashboard', () => {
  it('apresenta métricas agregadas', async () => {
    const fetcher = async () => [{ label: 'Acurácia média', value: 82.4, delta: 2.5, unit: '%' }];
    renderDashboard(fetcher);
    expect(await screen.findByText(/Acurácia média/i)).toBeInTheDocument();
    expect(await screen.findByText(/82.40/)).toBeInTheDocument();
  });
});
