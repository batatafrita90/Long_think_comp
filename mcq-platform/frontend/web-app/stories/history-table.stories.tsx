import type { Meta, StoryObj } from '@storybook/react';
import { SWRConfig } from 'swr';
import { HistoryTable } from '@/components/reports/history-table';

const meta: Meta<typeof HistoryTable> = {
  title: 'Reports/HistoryTable',
  component: HistoryTable,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <Story />
      </SWRConfig>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof HistoryTable>;

export const Default: Story = {
  args: {
    fetcher: async () => [
      {
        execution_id: 'exec-1',
        session_id: 'sess-1',
        score: 8,
        total: 10,
        accuracy: 0.8,
        feedback_negative: 1,
        finished_at: new Date().toISOString(),
      },
    ],
  },
};
