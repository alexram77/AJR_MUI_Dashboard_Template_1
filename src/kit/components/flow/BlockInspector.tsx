/**
 * Right-hand details panel for the selected block.
 *
 * The kit supplies the frame — header with the block's identity, a body slot,
 * a close button, and the empty state when nothing is selected. The form
 * inside is the app's, because only the app knows a block's parameters.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { flexCenter } from '../../theme/styleTokens';
import type { BlockCategoryStyle, BlockDefinition } from './types';

export interface BlockInspectorProps {
  /** The selected block's definition, or null for the empty state. */
  definition: BlockDefinition | null;
  style?: BlockCategoryStyle;
  /** Secondary line under the title — an id, a type, a parameter summary. */
  subtitle?: string;
  /** The parameter form. */
  children?: ReactNode;
  onClose?: () => void;
  width?: number;
}

export function BlockInspector({
  definition,
  style,
  subtitle,
  children,
  onClose,
  width = 320,
}: BlockInspectorProps) {
  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {definition ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
          >
            {style && (
              <Box
                sx={{
                  ...flexCenter,
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  borderRadius: 1,
                  bgcolor: style.iconBg,
                  color: style.color,
                  fontSize: '1.1rem',
                }}
              >
                {definition.icon}
              </Box>
            )}

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {definition.label}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>

            {onClose && (
              <IconButton size="small" onClick={onClose} aria-label="Close inspector">
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2 }}>
            {children ?? (
              <Typography variant="body2" color="text.secondary">
                {definition.description ?? 'This block takes no parameters.'}
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <Box sx={{ ...flexCenter, flexDirection: 'column', gap: 1, height: '100%', px: 3, textAlign: 'center' }}>
          <TuneRoundedIcon sx={{ fontSize: '2rem', color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary">
            Select a block to edit its parameters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
