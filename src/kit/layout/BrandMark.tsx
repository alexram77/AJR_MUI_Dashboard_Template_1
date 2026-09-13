/**
 * Sidebar wordmark — name on one line, optional letter-spaced tagline beneath.
 * Clicking navigates to `brand.href` when one is configured.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from './NavigationContext';

export function BrandMark() {
  const { brand } = useNavigation();
  const navigate = useNavigate();
  const clickable = Boolean(brand.href);

  return (
    <Box
      onClick={clickable ? () => navigate(brand.href as string) : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 2.5,
        minHeight: { xs: 52, md: 56 },
        flexShrink: 0,
        cursor: clickable ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      {brand.icon}
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: 0.5, lineHeight: 1.2 }}
      >
        {brand.name}
        {brand.tagline && (
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 400,
              color: 'text.secondary',
              lineHeight: 1.2,
              letterSpacing: 2,
            }}
          >
            {brand.tagline}
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
