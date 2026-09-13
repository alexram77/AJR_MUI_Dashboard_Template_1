/**
 * A button that opens a menu.
 *
 * Wraps the anchor state, keyboard handling and auto-close that every
 * hand-rolled version of this gets subtly wrong. Items are declared as data,
 * so a menu is a list rather than twenty lines of JSX.
 */
import { useState } from 'react';
import type { ReactNode } from 'react';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { ActionButton } from './ActionButton';
import { ToolbarIconButton } from './ToolbarIconButton';
import type { ButtonIntent, ButtonSize } from './buttonTokens';

export interface MenuAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Renders in the error colour — deletes, revokes, resets. */
  destructive?: boolean;
  /** Draw a divider above this item. */
  dividerBefore?: boolean;
}

export interface MenuButtonProps {
  /** Button label. Omit to render as an icon-only button. */
  label?: string;
  /** Leading icon for the labelled form, or the glyph for the icon-only form. */
  icon?: ReactNode;
  actions: MenuAction[];
  intent?: ButtonIntent;
  size?: ButtonSize;
  tooltip?: string;
  disabled?: boolean;
}

export function MenuButton({
  label,
  icon,
  actions,
  intent = 'secondary',
  size = 'sm',
  tooltip,
  disabled = false,
}: MenuButtonProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const close = () => setAnchor(null);

  const trigger = label ? (
    <ActionButton
      intent={intent}
      size={size}
      startIcon={icon}
      disabled={disabled}
      tooltip={tooltip}
      onClick={(event) => setAnchor(event.currentTarget)}
    >
      {label}
    </ActionButton>
  ) : (
    <ToolbarIconButton
      disabled={disabled}
      tooltip={tooltip}
      onClick={(event) => setAnchor(event.currentTarget)}
    >
      {icon}
    </ToolbarIconButton>
  );

  return (
    <>
      {trigger}
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        slotProps={{ paper: { elevation: 2, sx: { minWidth: 180 } } }}
      >
        {actions.map((action) => [
          action.dividerBefore ? <Divider key={`${action.id}-divider`} /> : null,
          <MenuItem
            key={action.id}
            disabled={action.disabled}
            onClick={() => {
              // Close first so the menu is gone before whatever the action
              // triggers (a dialog, a navigation) takes over the screen.
              close();
              action.onSelect();
            }}
            sx={action.destructive ? { color: 'error.main' } : undefined}
          >
            {action.icon && (
              <ListItemIcon sx={action.destructive ? { color: 'error.main' } : undefined}>
                {action.icon}
              </ListItemIcon>
            )}
            {action.label}
          </MenuItem>,
        ])}
      </Menu>
    </>
  );
}

/** Icon-only convenience wrapper, for an overflow "⋮" in a card header. */
export function OverflowMenuButton({
  actions,
  icon,
  tooltip = 'More actions',
  disabled,
}: Pick<MenuButtonProps, 'actions' | 'icon' | 'tooltip' | 'disabled'>) {
  return (
    <Tooltip title="" disableHoverListener>
      <span>
        <MenuButton actions={actions} icon={icon} tooltip={tooltip} disabled={disabled} />
      </span>
    </Tooltip>
  );
}
