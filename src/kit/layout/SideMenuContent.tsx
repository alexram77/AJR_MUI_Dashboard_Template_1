/**
 * Sidebar body — brand, the declared nav sections, and the build-info footer.
 * Shared verbatim by the permanent (desktop) and temporary (mobile) drawers so
 * the two can never diverge.
 */
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { SideMenuItem } from './SideMenuItem';
import { useNavigation } from './NavigationContext';
import { monoFamily, sectionLabel } from '../theme/styleTokens';
import type { NavItem } from './types';

export interface SideMenuContentProps {
  /** Called after a successful navigation — the mobile drawer closes on it. */
  onNavigate?: () => void;
}

export function SideMenuContent({ onNavigate }: SideMenuContentProps) {
  const { nav, buildInfo } = useNavigation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSelect = (item: NavItem) => {
    navigate(item.href);
    onNavigate?.();
  };

  return (
    <>
      <BrandMark />
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
        {nav.sections.map((section, index) => (
          <Box key={section.label ?? `section-${index}`} sx={{ mb: 0.5 }}>
            {section.label && (
              <Typography sx={{ ...sectionLabel, px: 2.5, pt: index === 0 ? 0 : 1.25, pb: 0.5 }}>
                {section.label}
              </Typography>
            )}
            <List dense disablePadding sx={{ px: 1 }}>
              {section.items.map((item) => (
                <SideMenuItem
                  key={item.href}
                  item={item}
                  selected={pathname === item.href}
                  onSelect={handleSelect}
                />
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {buildInfo && buildInfo.lines.length > 0 && (
        <Box sx={{ px: 2, py: 1.5, flexShrink: 0 }}>
          {buildInfo.lines.map((line) => (
            <Typography
              key={line}
              sx={{ ...monoFamily, fontSize: '0.6rem', color: 'text.disabled', lineHeight: 1.6 }}
            >
              {line}
            </Typography>
          ))}
        </Box>
      )}
    </>
  );
}
