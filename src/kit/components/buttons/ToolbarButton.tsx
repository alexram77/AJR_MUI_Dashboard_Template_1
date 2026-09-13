/**
 * Toolbar action button.
 *
 * Height and font come from the theme's `MuiButton.sizeSmall` override, so
 * this matches every other small button in the app. What it adds on top is the
 * icon scale, a tooltip that still works while disabled, and a loading state
 * that swaps the icon for a spinner.
 */
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';

export interface ToolbarButtonProps extends Omit<ButtonProps, 'size'> {
  tooltip?: string;
  /** Shows a spinner in the icon slot and disables the button. */
  loading?: boolean;
}

// Icon size comes from the theme's MuiButton override, shared with every
// other button, so a toolbar row cannot drift from a form row.
const BASE_SX: SxProps<Theme> = {
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

export function ToolbarButton({
  tooltip,
  loading = false,
  startIcon,
  disabled,
  fullWidth,
  sx,
  children,
  ...rest
}: ToolbarButtonProps) {
  const button = (
    <Button
      size="small"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={14} color="inherit" /> : startIcon}
      sx={[BASE_SX, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>}
      {...rest}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  // A disabled button emits no pointer events, so the tooltip needs a wrapper.
  return (
    <Tooltip title={tooltip}>
      <span style={{ display: fullWidth ? 'flex' : 'inline-flex', flex: fullWidth ? 1 : undefined }}>
        {button}
      </span>
    </Tooltip>
  );
}
