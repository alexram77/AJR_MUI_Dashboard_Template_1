/**
 * Column-driven table.
 *
 * Declare columns once and the table handles the head row, alignment, sorting,
 * the empty state and the scroll container. Generic over the row type, so
 * `render` receives a fully typed row rather than `any`.
 *
 * This deliberately does not do pagination, selection or editing — at that
 * point reach for MUI X DataGrid and register its theme customizations through
 * `AppTheme`'s `themeComponents`.
 */
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { ScrollPanel } from '../scroll/ScrollPanel';
import { StateBlock } from '../feedback/StateBlock';

export interface DataColumn<Row> {
  /** Stable key — also the default sort key. */
  id: string;
  label: string;
  /** Cell content. Return a string for plain values, a node for chips/bars. */
  render: (row: Row) => ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Fixed column width, e.g. 120 or '20%'. */
  width?: number | string;
  /**
   * Comparable value for sorting. Provide it to make the column sortable;
   * omit and the header renders as plain text.
   */
  sortValue?: (row: Row) => string | number;
}

export interface DataTableProps<Row> {
  rows: Row[];
  columns: DataColumn<Row>[];
  /** Stable React key per row. */
  rowKey: (row: Row, index: number) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  /** Column id to sort by initially. */
  defaultSortBy?: string;
  defaultSortDir?: 'asc' | 'desc';
  /** Cap the height and scroll inside, with a pinned head row. */
  maxHeight?: number | Record<string, number>;
  onRowClick?: (row: Row) => void;
}

export function DataTable<Row>({
  rows,
  columns,
  rowKey,
  loading = false,
  error = null,
  emptyMessage = 'No rows match this view.',
  defaultSortBy,
  defaultSortDir = 'asc',
  maxHeight = { xs: 360, md: 540 },
  onRowClick,
}: DataTableProps<Row>) {
  const [sortBy, setSortBy] = useState<string | undefined>(defaultSortBy);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);

  const sorted = useMemo(() => {
    const column = columns.find((candidate) => candidate.id === sortBy);
    if (!column?.sortValue) return rows;

    const compare = column.sortValue;
    return [...rows].sort((a, b) => {
      const left = compare(a);
      const right = compare(b);
      const order =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right));
      return sortDir === 'asc' ? order : -order;
    });
  }, [rows, columns, sortBy, sortDir]);

  /** Toggle direction when re-clicking the active column, else sort ascending. */
  const handleSort = (id: string) => {
    if (sortBy === id) setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(id);
      setSortDir('asc');
    }
  };

  if (loading || error || rows.length === 0) {
    return <StateBlock loading={loading} error={error} empty={rows.length === 0} emptyMessage={emptyMessage} />;
  }

  return (
    <ScrollPanel stickyHeader maxHeight={maxHeight}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align ?? 'left'} style={{ width: column.width }}>
                {column.sortValue ? (
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortBy === column.id ? sortDir : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {sorted.map((row, index) => (
            <TableRow
              key={rowKey(row, index)}
              hover={Boolean(onRowClick)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align ?? 'left'}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollPanel>
  );
}
