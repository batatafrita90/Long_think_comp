import type { Meta, StoryObj } from '@storybook/react';
import { SWRConfig } from 'swr';
import { MetricsDashboard } from '@/components/reports/metrics-dashboard';

const meta: Meta<typeof MetricsDashboard> = {
  title: 'Reports/MetricsDashboard',
  component: MetricsDashboard,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <Story />
      </SWRConfig>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MetricsDashboard>;

export const Default: Story = {
  args: {
    fetcher: async () => [
      { label: 'Acurácia média', value: 82.5, delta: 1.5, unit: '%' },
      { label: 'Feedbacks negativos', value: 8, delta: -2 },
    ],
  },
};
