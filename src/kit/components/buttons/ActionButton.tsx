/**
 * The general-purpose button.
 *
 * Takes an `intent` instead of a variant and colour, so the meaning of a
 * button is declared and its appearance is decided centrally. Adds the two
 * things a raw MUI Button always ends up needing: a tooltip that still works
 * while disabled, and a loading state that swaps the icon for a spinner and
 * blocks re-clicks.
 *
 * Use this everywhere except inside a toolbar row, where `ToolbarButton` pins
 * the denser height.
 */
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';
import { BUTTON_HEIGHTS, BUTTON_INTENTS, muiSizeFor } from './buttonTokens';
import type { ButtonIntent, ButtonSize } from './buttonTokens';

export interface ActionButtonProps extends Omit<ButtonProps, 'variant' | 'color' | 'size'> {
  /** What the button does. Decides variant and colour. */
  intent?: ButtonIntent;
  size?: ButtonSize;
  /** Tooltip. Rendered through a wrapper so it fires while disabled. */
  tooltip?: string;
  /** Spinner in the icon slot; also disables the button. */
  loading?: boolean;
}

export function ActionButton({
  intent = 'secondary',
  size = 'md',
  tooltip,
  loading = false,
  startIcon,
  disabled,
  fullWidth,
  sx,
  children,
  ...rest
}: ActionButtonProps) {
  const { variant, color } = BUTTON_INTENTS[intent];

  const button = (
    <Button
      variant={variant}
      color={color}
      size={muiSizeFor(size)}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={14} color="inherit" /> : startIcon}
      sx={[
        // Icon size comes from the theme, so every button in the app matches.
        { minHeight: BUTTON_HEIGHTS[size], whiteSpace: 'nowrap' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ] as SxProps<Theme>}
      {...rest}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  // A disabled button emits no pointer events, so the tooltip needs a wrapper
  // element of its own to hang off.
  return (
    <Tooltip title={tooltip}>
      <span style={{ display: fullWidth ? 'flex' : 'inline-flex', flex: fullWidth ? 1 : undefined }}>
        {button}
      </span>
    </Tooltip>
  );
}
