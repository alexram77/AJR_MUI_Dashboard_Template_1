/**
 * True below the `md` breakpoint.
 *
 * One hook rather than `useMediaQuery(theme.breakpoints.down('md'))` scattered
 * through the codebase, so the mobile cut-over point is a single edit.
 */
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export function useIsMobile(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}
