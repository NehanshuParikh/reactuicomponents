import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from './Datatable';
import type { Column } from './Datatable';

import { vi } from 'vitest';

type Row = { id: number; name: string; age: number };

const columns: Column<Row>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

const data: Row[] = [
  { id: 2, name: 'B', age: 30 },
  { id: 1, name: 'A', age: 20 },
];

describe('DataTable', () => {
  it('renders rows', () => {
    render(<DataTable<Row> data={data} columns={columns} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('sorts rows when clicking a sortable header', () => {
    const { container } = render(<DataTable<Row> data={data} columns={columns} />);
    const nameHeader = screen.getByRole('button', { name: /sort by name/i });

    // click to sort ascending (A, B)
    fireEvent.click(nameHeader);
    const rowsAsc = container.querySelectorAll('tbody tr');
    expect(rowsAsc[0].textContent).toContain('A');
    expect(rowsAsc[1].textContent).toContain('B');

    // click to sort descending (B, A)
    fireEvent.click(nameHeader);
    const rowsDesc = container.querySelectorAll('tbody tr');
    expect(rowsDesc[0].textContent).toContain('B');
    expect(rowsDesc[1].textContent).toContain('A');
  });

  it('selection triggers callback', () => {
    const onRowSelect = vi.fn();
    const { container } = render(<DataTable<Row> data={data} columns={columns} selectable onRowSelect={onRowSelect} />);

    // checkboxes: header checkbox + 2 row checkboxes
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    // click first row checkbox (index 1)
    fireEvent.click(checkboxes[1]);
    expect(onRowSelect).toHaveBeenCalled();
    const lastCall = onRowSelect.mock.calls[onRowSelect.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(1);
    expect(lastCall[0].name).toBe('B'); // first rendered row
  });
});
