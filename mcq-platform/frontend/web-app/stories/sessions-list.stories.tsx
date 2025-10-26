import type { Meta, StoryObj } from '@storybook/react';
import { SWRConfig } from 'swr';
import { SessionsList } from '@/components/session/sessions-list';

const meta: Meta<typeof SessionsList> = {
  title: 'Session/SessionsList',
  component: SessionsList,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <div className="max-w-4xl">
          <Story />
        </div>
      </SWRConfig>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SessionsList>;

export const Default: Story = {
  args: {
    fetcher: async () => [
      { execution_id: 'exec-1', session_id: 'sess-1', status: 'active', percent: 60 },
      { execution_id: 'exec-2', session_id: 'sess-2', status: 'completed', percent: 100 },
    ],
  },
};
