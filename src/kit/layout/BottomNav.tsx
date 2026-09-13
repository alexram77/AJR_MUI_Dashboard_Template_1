/**
 * Mobile bottom bar. Shows the nav items flagged `primary`; everything else
 * stays behind the hamburger. Renders nothing when no item is flagged, so an
 * app opts in simply by tagging its items.
 *
 * The bar is hard-capped at `maxItems` because the arithmetic is unforgiving:
 * eight destinations across a 320px screen leaves each one 40px wide, under
 * the 44px a fingertip needs. Five is the most that fits the narrowest phone
 * still in use, and is what both platform conventions recommend.
 */
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigation } from './NavigationContext';

export interface BottomNavProps {
  /** Hard cap on destinations. Raising it past 5 breaks tap targets at 320px. */
  maxItems?: number;
}

export function BottomNav({ maxItems = 5 }: BottomNavProps) {
  const { primaryItems } = useNavigation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (primaryItems.length === 0) return null;

  const items = primaryItems.slice(0, maxItems);

  // BottomNavigation warns when `value` matches no child, so fall back to false.
  const active = items.some((item) => item.href === pathname) ? pathname : false;

  return (
    <Paper
      elevation={0}
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
        bgcolor: 'background.paper',
        // Clear the browser's own chrome (iOS home indicator, Android gesture
        // bar). Requires viewport-fit=cover in index.html.
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation value={active} onChange={(_, href) => navigate(href)} showLabels>
        {items.map((item) => (
          <BottomNavigationAction
            key={item.href}
            value={item.href}
            label={item.shortLabel ?? item.label}
            icon={item.icon}
            // Guarantee the finger minimum even when the label wraps.
            sx={{ minWidth: 44 }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
