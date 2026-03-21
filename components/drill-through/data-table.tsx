export interface DataTableTag {
  text: string;
  bg: string;
  colour: string;
}

export type DataTableCell = string | DataTableTag;

interface DataTableProps {
  headers: string[];
  rows: DataTableCell[][];
}

function isTag(cell: DataTableCell): cell is DataTableTag {
  return typeof cell === 'object' && 'text' in cell;
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <table
      className="w-full"
      style={{ borderCollapse: 'collapse', fontSize: '11px' }}
      data-testid="data-table"
    >
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="text-left px-3 py-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: 'var(--text-dim)',
                background: 'var(--bg)',
                borderBottom: '2px solid var(--border)',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            style={{ transition: 'background 0.15s ease' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLTableRowElement).style.background = 'var(--amber-glow)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLTableRowElement).style.background = '';
            }}
            data-testid={`data-table-row-${rowIndex}`}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-3 py-2.5"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {isTag(cell) ? (
                  <span
                    style={{
                      display: 'inline-block',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                      background: cell.bg,
                      color: cell.colour,
                    }}
                  >
                    {cell.text}
                  </span>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
