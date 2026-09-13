/**
 * Horizontal segmented bar.
 *
 * Segments fill left to right with rising opacity, so the reading is legible
 * from across a room. The optimal band is an underbar beneath the segments and
 * proportion ticks sit below that.
 */
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { TICK_FRACTIONS, scaleFractions } from './meterGeometry';
import type { MeterScale } from './meterGeometry';

/** Segment count and gap. Twelve reads as a bar, not as countable blocks. */
const SEGMENTS = 12;
const GAP = 3;

export interface LevelMeterProps extends MeterScale {
  width?: number;
  height?: number;
  color?: string;
}

export function LevelMeter({ width = 160, height = 26, color, ...scale }: LevelMeterProps) {
  const theme = useTheme();
  const fill = color ?? theme.palette.primary.main;

  const { value: frac, optimalStart, optimalEnd } = scaleFractions(scale);

  const segmentWidth = (width - (SEGMENTS - 1) * GAP) / SEGMENTS;
  const segmentRadius = Math.min(segmentWidth / 2, height / 2);

  /** x position of a fraction along the bar. */
  const fracToX = (f: number) => f * (width - GAP);

  // Vertical stack: segments, optimal underbar, tick marks.
  const underbarY = height + 5;
  const underbarHeight = 3;
  const ticksTop = underbarY + underbarHeight + 4;
  const ticksBottom = ticksTop + 5;
  const svgHeight = ticksBottom + 2;

  return (
    <Box sx={{
        display: 'flex', flexDirection: 'column', width, color: 'text.primary',
        // The SVG carries a fixed width, which overflows a narrow grid column
        // on a phone. The cap is breakpoint-scoped rather than unconditional:
        // at md and up the meter keeps its declared size exactly, because
        // desktop layout is frozen. The viewBox preserves aspect ratio, so no
        // height rule is needed.
        maxWidth: { xs: '100%', md: 'none' },
        '& svg': { maxWidth: { xs: '100%', md: 'none' } },
      }}>
      <svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
        {Array.from({ length: SEGMENTS }, (_, index) => {
          const filled = frac * SEGMENTS > index;
          // Filled segments brighten toward the right end; unfilled stay faint.
          const opacity = filled ? 0.35 + (index / (SEGMENTS - 1)) * 0.65 : 0.13;
          return (
            <rect
              key={index}
              x={index * (segmentWidth + GAP)}
              y={0}
              width={segmentWidth}
              height={height}
              rx={segmentRadius}
              fill={fill}
              opacity={opacity}
            />
          );
        })}

        {optimalStart !== null && optimalEnd !== null && (
          <rect
            x={fracToX(optimalStart)}
            y={underbarY}
            width={fracToX(optimalEnd) - fracToX(optimalStart)}
            height={underbarHeight}
            rx={underbarHeight / 2}
            fill={fill}
            opacity={0.88}
          />
        )}

        {TICK_FRACTIONS.map((f) => (
          <line
            key={f}
            x1={fracToX(f)}
            y1={ticksTop}
            x2={fracToX(f)}
            y2={ticksBottom}
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </Box>
  );
}
