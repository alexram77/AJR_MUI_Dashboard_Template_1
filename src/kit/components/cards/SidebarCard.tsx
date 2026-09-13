/**
 * List card for a `SplitPane` rail: an uppercase section caption above a body
 * that scrolls on its own.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { sectionLabel } from '../../theme/styleTokens';

export interface SidebarCardProps {
  label: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function SidebarCard({ label, children, sx }: SidebarCardProps) {
  return (
    <Card sx={[{ overflowY: 'auto' }, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>}>
      <Box sx={{ py: 0.5 }}>
        <Typography sx={{ ...sectionLabel, display: 'block', px: 2, pt: 1, pb: 0.5 }}>
          {label}
        </Typography>
        {children}
      </Box>
    </Card>
  );
}
