import { ReactNode } from 'react';
import clsx from 'clsx';

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  className?: string;
  width?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  empty,
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  empty?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg border border-border-subtle bg-surface-card',
        className,
      )}
    >
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-surface-canvas text-xs uppercase tracking-wide text-text-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx('px-3 py-2 font-medium', col.className)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-6 text-center text-sm text-text-muted"
              >
                {empty ?? 'No rows.'}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                className="border-t border-border-subtle hover:bg-surface-canvas/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx('px-3 py-2 align-middle', col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as ReactNode) ??
                        null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
