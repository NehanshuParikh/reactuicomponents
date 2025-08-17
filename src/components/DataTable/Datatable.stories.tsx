import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './Datatable';
import type { Column } from './Datatable';

import * as React from 'react';

type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

const columns: Column<User>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
];

const data: User[] = [
  { id: 1, name: 'Aisha Shah', age: 24, email: 'aisha@example.com' },
  { id: 2, name: 'Rohit Verma', age: 29, email: 'rohit@example.com' },
  { id: 3, name: 'Meera Iyer', age: 22, email: 'meera@example.com' },
  { id: 4, name: 'Kabir Mehta', age: 31, email: 'kabir@example.com' },
];

const meta: Meta<typeof DataTable<User>> = {
    title: 'Components/DataTable',
    component: DataTable<User>,
    args: {
      data,
      columns,
      loading: false,
      selectable: false,
    },
  };
  export default meta;
  

type Story = StoryObj<typeof DataTable>;

export const Basic: Story = {};

export const Sortable: Story = {
  args: { selectable: false },
};

export const Selectable: Story = {
  args: { selectable: true },
};

export const Loading: Story = {
  args: { loading: true, data: [] },
};

export const Empty: Story = {
  args: { data: [] },
};
