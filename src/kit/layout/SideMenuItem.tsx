/**
 * One sidebar row. Selected state is a filled primary pill — high contrast so
 * the current page is unmistakable at a glance in either colour scheme.
 */
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import type { NavItem } from './types';

export interface SideMenuItemProps {
  item: NavItem;
  selected: boolean;
  onSelect: (item: NavItem) => void;
}

export function SideMenuItem({ item, selected, onSelect }: SideMenuItemProps) {
  const button = (
    <ListItemButton
      selected={selected}
      disabled={item.disabled}
      onClick={() => !item.disabled && onSelect(item)}
      sx={{
        borderRadius: 1.5,
        mb: 0.25,
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
          '&:hover': { bgcolor: 'primary.dark' },
        },
      }}
    >
      {item.icon && (
        <ListItemIcon sx={{ color: selected ? 'primary.contrastText' : 'text.secondary' }}>
          {item.icon}
        </ListItemIcon>
      )}
      <ListItemText
        primary={item.label}
        slotProps={{
          primary: { fontSize: '0.875rem', fontWeight: selected ? 600 : 400 },
        }}
      />
      {item.badge && (
        <Chip
          label={item.badge}
          size="small"
          variant="outlined"
          sx={{ height: 18, fontSize: '0.6rem', ml: 0.5 }}
        />
      )}
    </ListItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      {item.disabled ? (
        // Tooltips need a non-disabled wrapper to receive pointer events.
        <Tooltip title="Not available yet" placement="right">
          <span>{button}</span>
        </Tooltip>
      ) : (
        button
      )}
    </ListItem>
  );
}
