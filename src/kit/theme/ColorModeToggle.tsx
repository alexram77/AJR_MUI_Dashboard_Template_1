/**
 * Light/dark toggle.
 *
 * Reads and writes MUI's own colour-scheme state, so the choice persists via
 * `COLOR_MODE_STORAGE_KEY` and applies without a React re-render of the theme.
 * Renders nothing until mounted, which avoids the hydration flash where the
 * icon briefly shows the wrong mode.
 */
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useColorScheme } from '@mui/material/styles';

export interface ColorModeToggleProps {
  size?: 'small' | 'medium';
}

export function ColorModeToggle({ size = 'small' }: ColorModeToggleProps) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <IconButton size={size} disabled sx={{ visibility: 'hidden' }} />;

  // `mode` is 'system' until the user picks; resolve it for the icon + next value.
  const resolved = mode === 'system' ? systemMode ?? 'dark' : mode ?? 'dark';
  const isDark = resolved === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        size={size}
        onClick={() => setMode(isDark ? 'light' : 'dark')}
        sx={{ color: 'text.secondary' }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
