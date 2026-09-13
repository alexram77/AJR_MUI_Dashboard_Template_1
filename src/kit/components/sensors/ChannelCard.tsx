/**
 * One live channel: status, meter, trend and reading.
 *
 * The card is the unit a dashboard is built from — a grid of these is a
 * monitoring page. Layout is fixed so a grid of mixed meter types stays
 * aligned; what varies is the meter, which the user can cycle through.
 *
 * A channel that has never reported shows its declared base value with the
 * reading greyed, rather than a confident zero.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SpeedIcon from '@mui/icons-material/Speed';
import { useTheme } from '@mui/material/styles';
import { captionMuted, flexCenter } from '../../theme/styleTokens';
import { EMPTY } from '../../utils/format';
import { MeterRenderer } from './MeterRenderer';
import { InlineAliasEditor } from './InlineAliasEditor';
import { statusTextForReading, toneForReading } from './channelStatus';
import type { ChannelDefinition, ChannelReading, ChannelTrend, HistoryPoint, MeterType } from './types';

/** Order the meter-cycle button walks. `state` is excluded: it is a property
 *  of the channel, not a view of a numeric one. */
const METER_CYCLE: MeterType[] = ['gauge', 'thermometer', 'level', 'chart'];

export interface ChannelCardProps {
  definition: ChannelDefinition;
  /** Latest reading. Undefined means the channel has not reported yet. */
  reading?: ChannelReading;
  history?: HistoryPoint[];
  trend?: ChannelTrend;
  meterType?: MeterType;
  /** User-chosen name, overriding `definition.label`. */
  alias?: string;
  /** Per-channel accent colour for the meter. */
  color?: string;
  /** Show a remove button on hover. */
  onRemove?: () => void;
  /** Enable the meter-cycle button. */
  onMeterTypeChange?: (meterType: MeterType) => void;
  /** Enable click-to-rename. */
  onAliasChange?: (alias: string) => void;
  /** Drag handlers for a reorderable grid. */
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
}

export function ChannelCard({
  definition,
  reading,
  history = [],
  trend,
  meterType,
  alias,
  color,
  onRemove,
  onMeterTypeChange,
  onAliasChange,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
}: ChannelCardProps) {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const activeMeter = meterType ?? definition.meterType;
  const hasReading = reading?.value !== null && reading?.value !== undefined && reading.valid;
  const value = hasReading ? (reading.value as number) : definition.baseValue ?? definition.min;

  const tone = toneForReading(value, definition);
  const statusColor = {
    ok: theme.palette.success.main,
    warn: theme.palette.warning.main,
    bad: theme.palette.error.main,
    neutral: theme.palette.text.disabled,
  }[tone];

  const TrendIcon =
    trend?.direction === 'up' ? ArrowUpwardIcon : trend?.direction === 'down' ? ArrowDownwardIcon : RemoveIcon;
  const trendColor =
    trend?.direction === 'up'
      ? theme.palette.success.main
      : trend?.direction === 'down'
        ? theme.palette.error.main
        : theme.palette.text.disabled;

  const cycleMeter = () => {
    const index = METER_CYCLE.indexOf(activeMeter);
    onMeterTypeChange?.(METER_CYCLE[(index + 1) % METER_CYCLE.length]);
  };

  return (
    <Card
      variant="outlined"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: draggable ? 'grab' : 'default',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: 3 },
      }}
    >
      {hovered && onRemove && (
        <Tooltip title="Remove card">
          <IconButton
            size="small"
            onClick={onRemove}
            aria-label="Remove card"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 1,
              width: 22,
              height: 22,
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'error.main', color: 'common.white' },
            }}
          >
            <CloseIcon sx={{ fontSize: '0.8rem' }} />
          </IconButton>
        </Tooltip>
      )}

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
          {/* Status well · meter cycle · trend — three equal boxes so every
              card's header row lines up regardless of which controls are on. */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
            <Tooltip title={statusTextForReading(value, definition)}>
              <Box sx={{ ...flexCenter, width: 28, height: 28, borderRadius: 1, bgcolor: statusColor }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.85)' }} />
              </Box>
            </Tooltip>

            {onMeterTypeChange ? (
              <Tooltip title={`View: ${activeMeter} — click to cycle`}>
                <IconButton
                  size="small"
                  onClick={cycleMeter}
                  aria-label="Change meter type"
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'primary.main', color: 'common.white' },
                  }}
                >
                  {activeMeter === 'chart' ? (
                    <ShowChartIcon sx={{ fontSize: '0.85rem' }} />
                  ) : (
                    <SpeedIcon sx={{ fontSize: '0.85rem' }} />
                  )}
                </IconButton>
              </Tooltip>
            ) : (
              <Box sx={{ width: 28 }} />
            )}

            <Box sx={{ ...flexCenter, width: 28, height: 28, borderRadius: 1, bgcolor: 'action.hover' }}>
              <TrendIcon sx={{ fontSize: '0.85rem', color: trendColor }} />
            </Box>
          </Stack>

          <InlineAliasEditor
            alias={alias}
            defaultLabel={definition.label}
            onCommit={(next) => onAliasChange?.(next)}
            disabled={!onAliasChange}
          />

          <Typography variant="caption" sx={captionMuted}>
            Status:{' '}
            <Box component="span" sx={{ color: statusColor, fontWeight: 600 }}>
              {statusTextForReading(value, definition)}
            </Box>
          </Typography>

          <Box
            sx={{
              ...flexCenter,
              width: '100%',
              flexGrow: 1,
              minHeight: 90,
            }}
          >
            <MeterRenderer
              meterType={activeMeter}
              value={value}
              definition={definition}
              color={color}
              history={history}
            />
          </Box>

          {/* Reading. Greyed when the channel has never reported, so a base
              value is never mistaken for a measurement. */}
          <Box
            sx={{
              ...flexCenter,
              width: '100%',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.4,
                color: hasReading ? 'text.primary' : 'text.disabled',
              }}
            >
              {hasReading ? `${value.toFixed(1)} ${definition.unit}`.trim() : EMPTY}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
