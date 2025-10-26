import type { Meta, StoryObj } from '@storybook/react';
import { SWRConfig } from 'swr';
import { SessionExecutionPanel } from '@/components/session/session-execution';

const meta: Meta<typeof SessionExecutionPanel> = {
  title: 'Session/SessionExecutionPanel',
  component: SessionExecutionPanel,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <div className="max-w-5xl">
          <Story />
        </div>
      </SWRConfig>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SessionExecutionPanel>;

const useMockStream = () => ({
  isConnected: true,
  events: [
    { type: 'progress', payload: { stage: 'especialista.alternativas', percent: 72 } },
    {
      type: 'item',
      payload: {
        item_id: 'item-1',
        stem: 'Paciente apresenta sintomas X. Qual a conduta correta?',
        options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
      },
    },
  ],
});

export const Default: Story = {
  args: {
    executionId: 'exec-demo',
    useStream: useMockStream,
    fetchDetails: async () => ({ execution_id: 'exec-demo', session_id: 'sess-demo', status: 'active' }),
    answerFn: async () => ({ correct: true }),
    dislikeFn: async () => undefined,
    regenerateFn: async () => undefined,
  },
};
