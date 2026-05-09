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
        'overflow-hidden border border-brand-rule bg-brand-paper',
        className,
      )}
    >
      <table className="w-full text-left">
        <thead className="sticky top-0 bg-brand-paper">
          <tr className="border-b border-brand-rule">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx('ft-eyebrow px-3 py-3 text-brand-navy/55', col.className)}
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
                className="px-3 py-6 text-center text-[13px] text-brand-navy/55"
              >
                {empty ?? 'No rows.'}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                className="border-t border-brand-rule transition-colors hover:bg-brand-bone/40"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx('px-3 py-3 align-middle text-[14px] text-brand-navy', col.className)}
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
