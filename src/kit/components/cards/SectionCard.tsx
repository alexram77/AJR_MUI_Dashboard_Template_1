/**
 * The workhorse content card: a titled, optionally collapsible section.
 *
 * Most page bodies are a vertical stack of these. `summary` stays visible when
 * folded, so a collapsed section can still carry its headline number.
 */
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export interface SectionCardProps {
  title: string;
  /** One line on what the section shows. */
  subtitle?: string;
  children: ReactNode;
  /** Adds a fold toggle to the header. */
  collapsible?: boolean;
  /** Initial state for a collapsible card. Default collapsed. */
  defaultExpanded?: boolean;
  /** Header content shown whether folded or not — usually a headline metric. */
  summary?: ReactNode;
  /** Header content on the right — buttons, chips, freshness badges. */
  headerExtra?: ReactNode;
}

export function SectionCard({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = false,
  summary,
  headerExtra,
}: SectionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showBody = !collapsible || expanded;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={collapsible ? () => setExpanded((value) => !value) : undefined}
          sx={{
            mb: showBody && (subtitle || children) ? 1 : 0,
            cursor: collapsible ? 'pointer' : 'default',
            userSelect: 'none',
          }}
        >
          {collapsible && (
            <IconButton size="small" sx={{ ml: -0.5 }} aria-label={expanded ? 'Collapse' : 'Expand'}>
              {expanded ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowRightIcon fontSize="small" />
              )}
            </IconButton>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>

          {summary && <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>{summary}</Box>}

          {headerExtra && (
            // Stop propagation so header controls do not toggle the fold.
            <Box sx={{ ml: summary ? 1 : 'auto' }} onClick={(event) => event.stopPropagation()}>
              {headerExtra}
            </Box>
          )}
        </Stack>

        {subtitle && showBody && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}

        {collapsible ? (
          <Collapse in={expanded} unmountOnExit>
            {children}
          </Collapse>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
