import type { Meta, StoryObj } from '@storybook/react';
import { SWRConfig } from 'swr';
import { UploadForm } from '@/components/ingest/upload-form';

const meta: Meta<typeof UploadForm> = {
  title: 'Ingest/UploadForm',
  component: UploadForm,
  decorators: [
    (Story) => (
      <SWRConfig value={{ provider: () => new Map() }}>
        <div className="max-w-3xl">
          <Story />
        </div>
      </SWRConfig>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof UploadForm>;

export const Default: Story = {
  args: {
    uploadFn: async () => ({ session_id: 'sess-demo', status: 'queued' }),
    triggerFn: async () => ({ run_id: 'run-demo', status: 'accepted' }),
    statusFetcher: async () => ({
      run_id: 'run-demo',
      stage: 'especialista.itens',
      percent: 45,
      retries: { enunciado: 1, revisor: 0 },
    }),
  },
};
