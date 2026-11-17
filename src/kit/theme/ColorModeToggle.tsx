/**
 * Light/dark toggle.
 *
 * Reads and writes MUI's own colour-scheme state, so the choice persists via
 * `COLOR_MODE_STORAGE_KEY` and applies without a React re-render of the theme.
 * Holds an invisible placeholder until MUI has resolved the mode (`mode` is
 * undefined on the first render), so the icon never briefly shows the wrong
 * one. Waiting on `mode` itself, not a mounted flag set in an effect, keeps
 * it to one render.
 */
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

  if (!mode) return <IconButton size={size} disabled sx={{ visibility: 'hidden' }} />;

  // `mode` is 'system' until the user picks; resolve it for the icon + next value.
  const resolved = mode === 'system' ? systemMode ?? 'dark' : mode;
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
