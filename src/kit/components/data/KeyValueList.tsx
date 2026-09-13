/**
 * Label/value pairs — config summaries, metadata panels, detail sidebars.
 *
 * Two columns on desktop so long lists stay scannable; one on mobile.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { captionMuted, monoFamily } from '../../theme/styleTokens';

export interface KeyValueEntry {
  label: string;
  /** A string renders monospaced; a node renders as given. */
  value: ReactNode;
}

export interface KeyValueListProps {
  entries: KeyValueEntry[];
  /** Columns at md and up. Default 2. */
  columns?: 1 | 2 | 3;
  /** Render string values in the UI font rather than monospace. */
  proseValues?: boolean;
}

export function KeyValueList({ entries, columns = 2, proseValues = false }: KeyValueListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, minmax(0, 1fr))` },
        columnGap: 3,
        rowGap: 1.25,
      }}
    >
      {entries.map((entry) => (
        <Box
          key={entry.label}
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 2,
            borderBottom: '1px dashed',
            borderColor: 'divider',
            pb: 0.75,
          }}
        >
          <Typography sx={{ ...captionMuted, flexShrink: 0 }}>{entry.label}</Typography>

          {typeof entry.value === 'string' ? (
            <Typography
              sx={{
                fontSize: '0.8rem',
                textAlign: 'right',
                wordBreak: 'break-word',
                ...(proseValues ? {} : monoFamily),
              }}
            >
              {entry.value}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{entry.value}</Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
