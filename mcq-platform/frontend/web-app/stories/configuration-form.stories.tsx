import type { Meta, StoryObj } from '@storybook/react';
import { ConfigurationForm } from '@/components/settings/config-form';

const meta: Meta<typeof ConfigurationForm> = {
  title: 'Settings/ConfigurationForm',
  component: ConfigurationForm,
};
export default meta;

type Story = StoryObj<typeof ConfigurationForm>;

export const Default: Story = {};
