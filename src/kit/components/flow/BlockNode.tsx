/**
 * The node card every block on the canvas renders as.
 *
 * Fixed 200 × 76 so a graph reads as a grid rather than a ransom note, with a
 * left accent bar and icon well tinted by category. Container blocks get a
 * child-count badge and a drill-in chevron; an optional full-width strip
 * across the top carries a severity or state label.
 *
 * Selection is a brand ring, validation failure a red one — never a colour
 * change to the card body, which would fight the category tint.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { alpha, useTheme } from '@mui/material/styles';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { ellipsis } from '../../theme/styleTokens';
import type { BlockNodeData } from './types';

/** Card dimensions. Auto-layout and the palette preview both derive from these. */
export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 76;

export function BlockNode({ id, data, selected }: NodeProps) {
  const theme = useTheme();
  const {
    definition,
    style,
    subtitle,
    childCount,
    invalid = false,
    accent,
    connectable = false,
    hideTargetHandle = false,
    hideSourceHandle = false,
    onDrillIn,
  } = data as BlockNodeData;

  const isContainer = childCount !== undefined;

  const borderColor = invalid
    ? theme.palette.error.main
    : selected
      ? theme.palette.primary.main
      : alpha(theme.palette.divider, 0.9);

  const boxShadow = invalid
    ? `0 0 0 2px ${alpha(theme.palette.error.main, 0.55)}, 0 2px 6px ${alpha('#000', 0.3)}`
    : selected
      ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.6)}, 0 4px 12px ${alpha('#000', 0.35)}`
      : `0 1px 4px ${alpha('#000', 0.3)}`;

  const handleStyle = {
    width: 10,
    height: 10,
    background: style.color,
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: '50%',
  } as const;

  return (
    <Box
      onDoubleClick={isContainer && onDrillIn ? () => onDrillIn(id) : undefined}
      sx={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '2px solid',
        borderColor,
        boxShadow,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.55) },
      }}
    >
      {accent && (
        <Box
          sx={{
            height: 18,
            flexShrink: 0,
            bgcolor: accent.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: 0.7,
              lineHeight: 1,
              color: theme.palette.getContrastText(accent.color),
            }}
          >
            {accent.label}
          </Typography>
        </Box>
      )}

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'stretch' }}>
        {/* Category accent bar */}
        <Box sx={{ width: 5, bgcolor: style.color, flexShrink: 0 }} />

        {/* Icon well */}
        <Box
          sx={{
            width: 44,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: style.iconBg,
            color: style.color,
            fontSize: '1.3rem',
          }}
        >
          {definition.icon}
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            px: 1.25,
            py: 0.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ ...ellipsis, fontWeight: 700, lineHeight: 1.25 }}>
            {definition.label}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ ...ellipsis, color: 'text.secondary', lineHeight: 1.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {isContainer && (
          <Box
            title="Double-click to open"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 0.75,
              minWidth: 38,
              borderLeft: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', lineHeight: 1 }}>
              {childCount}
            </Typography>
            <KeyboardArrowRightRoundedIcon sx={{ fontSize: '1rem', mt: 0.25 }} />
          </Box>
        )}
      </Box>

      {!hideTargetHandle && (
        <Handle type="target" position={Position.Left} isConnectable={connectable} style={handleStyle} />
      )}
      {!hideSourceHandle && (
        <Handle type="source" position={Position.Right} isConnectable={connectable} style={handleStyle} />
      )}
    </Box>
  );
}

/** nodeTypes map for React Flow. Declared once so the canvas keeps a stable identity. */
export const BLOCK_NODE_TYPES = { blockNode: BlockNode } as const;
