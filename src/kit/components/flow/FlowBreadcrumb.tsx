/**
 * Drill-down breadcrumb for a nested canvas.
 *
 * Rendered as tabs rather than chevron text so it matches every other bar in
 * the app and gets keyboard navigation for free. The first tab always returns
 * to the root scope.
 */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import type { BreadcrumbSegment } from './types';

export interface FlowBreadcrumbProps {
  /** One entry per level below the root. Empty means "at the root". */
  segments: BreadcrumbSegment[];
  /** Called with the depth to pop to: 0 is the root. */
  onPopTo: (depth: number) => void;
  /** Label for the root tab. */
  rootLabel?: string;
}

const TAB_SX = {
  minHeight: 44,
  textTransform: 'none' as const,
  fontWeight: 500,
  fontSize: '0.85rem',
  px: 1.25,
  '& .MuiTab-iconWrapper': { mr: 0.5 },
};

export function FlowBreadcrumb({ segments, onPopTo, rootLabel = 'Root' }: FlowBreadcrumbProps) {
  // The deepest segment is always the active one — you cannot be at a shallower
  // level while a deeper segment is still on the path.
  const activeValue = String(segments.length);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        minHeight: 44,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}
    >
      <Tabs
        value={activeValue}
        onChange={(_event, value: string) => onPopTo(Number(value))}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: 44 }}
      >
        <Tab
          value="0"
          icon={<HomeRoundedIcon fontSize="small" />}
          iconPosition="start"
          label={rootLabel}
          sx={TAB_SX}
        />
        {segments.map((segment, index) => (
          <Tab
            key={segment.id}
            value={String(index + 1)}
            icon={<ChevronRightRoundedIcon fontSize="small" sx={{ opacity: 0.5 }} />}
            iconPosition="start"
            label={segment.label}
            sx={TAB_SX}
          />
        ))}
      </Tabs>
    </Box>
  );
}
