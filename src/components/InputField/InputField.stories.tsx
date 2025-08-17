import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';
import * as React from 'react';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    helperText: 'This is your public handle',
    variant: 'outlined',
    size: 'md',
    disabled: false,
    invalid: false,
    loading: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'outlined', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  }
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Basic: Story = {};

export const Invalid: Story = {
  args: { invalid: true, errorMessage: 'Required field' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <InputField {...args} variant="filled" label="Filled" />
      <InputField {...args} variant="outlined" label="Outlined" />
      <InputField {...args} variant="ghost" label="Ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <InputField {...args} size="sm" label="Small" />
      <InputField {...args} size="md" label="Medium" />
      <InputField {...args} size="lg" label="Large" />
    </div>
  ),
};