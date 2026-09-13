/**
 * A titled, colour-coded band of channel cards.
 *
 * The repeating unit of a monitoring page: a coloured rule and title, a count,
 * a responsive grid of cards, and optional room for a combined plot beneath.
 * The section colour is what lets an operator find "the power block" on a busy
 * page without reading any labels.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

export interface ChannelSectionProps {
  title: string;
  /** Accent for the rule and title. Pick from the section palette. */
  color: string;
  /** Right-aligned header controls — add-card buttons, filters, chips. */
  actions?: ReactNode;
  /** Count shown next to the title. Defaults to the child grid's length. */
  count?: number;
  /** The channel cards. */
  children: ReactNode;
  /** Full-width content under the grid — usually a combined plot. */
  footer?: ReactNode;
  /** Columns at each breakpoint. */
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

export function ChannelSection({
  title,
  color,
  actions,
  count,
  children,
  footer,
  columns = { xs: 6, sm: 4, md: 3, lg: 2 },
}: ChannelSectionProps) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        flexWrap="wrap"
        useFlexGap
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
          // Faint wash of the section colour so the band reads as one unit.
          bgcolor: alpha(color, 0.07),
        }}
      >
        <Box sx={{ width: 4, height: 20, borderRadius: 1, bgcolor: color, flexShrink: 0 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color }}>
          {title}
        </Typography>

        {count !== undefined && (
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {count}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1 }} />
        {actions}
      </Stack>

      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Each child is wrapped so callers pass plain cards, not Grid items. */}
          {Array.isArray(children)
            ? children.map((child, index) => (
                <Grid size={columns} key={index}>
                  {child}
                </Grid>
              ))
            : <Grid size={columns}>{children}</Grid>}
        </Grid>

        {footer && <Box sx={{ mt: 2 }}>{footer}</Box>}
      </Box>
    </Box>
  );
}
