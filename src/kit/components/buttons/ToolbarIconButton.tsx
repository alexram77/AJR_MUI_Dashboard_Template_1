/**
 * Icon-only toolbar action, sized to line up with `ToolbarButton`.
 *
 * Passing `href` renders it as an anchor, so a toolbar can hold a link
 * (docs, an external dashboard) without breaking the row's alignment.
 */
import type { IconButtonProps } from '@mui/material/IconButton';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import type { SxProps, Theme } from '@mui/material/styles';
import { SMALL_CONTROL_HEIGHT } from '../../theme/customizations';

export interface ToolbarIconButtonProps extends Omit<IconButtonProps, 'size'> {
  tooltip?: string;
  loading?: boolean;
  /** Render as an anchor pointing here. */
  href?: string;
  target?: string;
  rel?: string;
}

// Size and icon scale both come from the theme's MuiIconButton override.
const BASE_SX: SxProps<Theme> = {
  width: SMALL_CONTROL_HEIGHT,
  height: SMALL_CONTROL_HEIGHT,
  flexShrink: 0,
};

export function ToolbarIconButton({
  tooltip,
  loading = false,
  disabled,
  href,
  sx,
  children,
  ...rest
}: ToolbarIconButtonProps) {
  // IconButton is polymorphic at runtime but its default prop type is fixed to
  // 'button'; the cast is confined to this one prop object.
  const linkProps = href ? ({ component: 'a', href } as Record<string, unknown>) : {};

  const button = (
    <IconButton
      size="small"
      disabled={disabled || loading}
      sx={[BASE_SX, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>}
      {...linkProps}
      {...rest}
    >
      {loading ? <CircularProgress size={14} color="inherit" /> : children}
    </IconButton>
  );

  if (!tooltip) return button;

  // A disabled button emits no pointer events, so the tooltip needs a wrapper.
  return (
    <Tooltip title={tooltip}>
      <span style={{ display: 'inline-flex' }}>{button}</span>
    </Tooltip>
  );
}
