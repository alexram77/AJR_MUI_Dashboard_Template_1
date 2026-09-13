/**
 * Header band content for `<PageContainer header={...}>`: title and one-line
 * description on the left, controls on the right, stacking on narrow screens.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface PageHeaderProps {
  title?: string;
  /** One line explaining what the page is for. Keep it factual. */
  subtitle?: string;
  /** Right-aligned controls — buttons, chips, switches. */
  actions?: ReactNode;
  /** Shorthand for a single primary button; rendered after `actions`. */
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, subtitle, actions, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ md: 'center' }}
      justifyContent="space-between"
      spacing={2}
    >
      <Box sx={{ minWidth: 0 }}>
        {title && (
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 860 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {(actions || actionLabel) && (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ flexShrink: 0 }}
        >
          {actions}
          {actionLabel && (
            <Button variant="contained" size="small" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}
