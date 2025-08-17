import * as React from 'react';

export interface Column<T extends Record<string, any>> {
  key: string;
  title: string;
  dataIndex: keyof T;
  /** Optional: allow custom cell rendering */
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  /** called with currently selected rows */
  onRowSelect?: (selectedRows: T[]) => void;
}

/* Sort helpers */
type SortOrder = 'asc' | 'desc';
type SortState<T extends Record<string, any>> = {
  columnKey: string;
  dataIndex: keyof T;
  order: SortOrder;
} | null;

function compareValues(a: unknown, b: unknown): number {
  const isNil = (v: unknown) => v === null || v === undefined;
  if (isNil(a) && isNil(b)) return 0;
  if (isNil(a)) return -1;
  if (isNil(b)) return 1;

  // Dates
  if (a instanceof Date || b instanceof Date) {
    const ta = a instanceof Date ? a.getTime() : new Date(String(a)).getTime();
    const tb = b instanceof Date ? b.getTime() : new Date(String(b)).getTime();
    return ta - tb;
  }

  // Numbers
  if (typeof a === 'number' && typeof b === 'number') return a - b;

  // Booleans
  if (typeof a === 'boolean' && typeof b === 'boolean') return (a === b) ? 0 : (a ? 1 : -1);

  // Fall back to string compare (numeric aware)
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Generic DataTable
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
}: DataTableProps<T>) {
  // selection tracked by item identity (object references)
  const [selected, setSelected] = React.useState<Set<T>>(new Set());
  const [sort, setSort] = React.useState<SortState<T>>(null);

  // sorted (or original) data
  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    const { dataIndex, order } = sort;
    const copy = [...data];
    copy.sort((a, b) => {
      const r = compareValues(a[dataIndex], b[dataIndex]);
      return order === 'asc' ? r : -r;
    });
    return copy;
  }, [data, sort]);

  // prune selections if data reference changes
  React.useEffect(() => {
    setSelected(prev => {
      const next = new Set<T>();
      const present = new Set(data);
      prev.forEach(item => {
        if (present.has(item)) next.add(item);
      });
      return next;
    });
  }, [data]);

  // notify parent on selection change
  React.useEffect(() => {
    onRowSelect?.(Array.from(selected));
  }, [selected, onRowSelect]);

  function toggleRow(row: T) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  }

  const allSelected = selectable && sortedData.length > 0 && sortedData.every(r => selected.has(r));
  const someSelected = selectable && !allSelected && sortedData.some(r => selected.has(r));

  function toggleAll() {
    if (!selectable) return;
    setSelected(prev => {
      if (allSelected) return new Set();
      const next = new Set(prev);
      sortedData.forEach(r => next.add(r));
      return next;
    });
  }

  function handleHeaderClick(col: Column<T>) {
    if (!col.sortable) return;
    setSort(prev => {
      if (!prev || prev.columnKey !== col.key) {
        return { columnKey: col.key, dataIndex: col.dataIndex, order: 'asc' };
      }
      if (prev.order === 'asc') return { ...prev, order: 'desc' };
      return null; // cycle back to unsorted
    });
  }

  function ariaSortFor(col: Column<T>): React.AriaAttributes['aria-sort'] {
    if (!col.sortable) return undefined;
    if (!sort || sort.columnKey !== col.key) return 'none';
    return sort.order === 'asc' ? 'ascending' : 'descending';
  }

  return (
    <div className="w-full">
      {selectable && (
        <div className="mb-2 text-sm text-gray-500" aria-live="polite">
          {selected.size} selected
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5">
        <table className="min-w-full text-left text-sm" aria-busy={loading || undefined}>
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              {selectable && (
                <th className="w-10 p-3 align-middle">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      aria-label={allSelected ? "Deselect all rows" : "Select all rows"}
                      checked={allSelected}
                      ref={el => {
                        if (el) el.indeterminate = Boolean(someSelected);
                      }}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </label>
                </th>
              )}

              {columns.map(col => (
                <th key={col.key} scope="col" aria-sort={ariaSortFor(col)} className="p-3 font-semibold">
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleHeaderClick(col)}
                      className="inline-flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded"
                      aria-label={`Sort by ${col.title}`}
                    >
                      <span>{col.title}</span>
                      <span className="inline-block leading-none">
                        {sort?.columnKey === col.key ? (sort.order === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  ) : (
                    <span>{col.title}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {loading && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={columns.length + (selectable ? 1 : 0)}>
                  Loading…
                </td>
              </tr>
            )}

            {!loading && sortedData.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan={columns.length + (selectable ? 1 : 0)}>
                  No data to display
                </td>
              </tr>
            )}

            {!loading && sortedData.map((row, ri) => {
              const isSelected = selected.has(row);
              return (
                <tr
                  key={ri}
                  className={`border-t last:border-b hover:bg-gray-50 ${isSelected ? 'bg-indigo-50' : ''}`}
                >
                  {selectable && (
                    <td className="p-3 align-middle">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          aria-label={`Select row ${ri + 1}`}
                          checked={isSelected}
                          onChange={() => toggleRow(row)}
                        />
                      </label>
                    </td>
                  )}

                  {columns.map(col => (
                    <td key={col.key} className="p-3 align-middle text-gray-800 whitespace-nowrap">
                      {col.render ? col.render(row[col.dataIndex], row, ri) : String(row[col.dataIndex] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
