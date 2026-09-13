/**
 * Vertical fluid bar.
 *
 * Proportion ticks on the left, optimal-range bracket on the right, so the two
 * annotations never collide. One continuous shape — no bulb.
 */
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { TICK_FRACTIONS, scaleFractions } from './meterGeometry';
import type { MeterScale } from './meterGeometry';

export interface ThermometerMeterProps extends MeterScale {
  size?: number;
  color?: string;
}

export function ThermometerMeter({ size = 140, color, ...scale }: ThermometerMeterProps) {
  const theme = useTheme();
  const fill = color ?? theme.palette.primary.main;

  const barWidth = Math.round(size * 0.2);
  const barHeight = Math.round(size * 0.72);
  const barX = Math.round((size - barWidth) / 2);
  const barY = 6;
  const barRadius = barWidth / 2;
  const svgHeight = barY + barHeight + 8;

  const { value: frac, optimalStart, optimalEnd } = scaleFractions(scale);

  /** Fraction 0 is the bottom of the bar, 1 the top. */
  const fracToY = (f: number) => barY + barHeight * (1 - f);

  const fillHeight = Math.max(barHeight * frac, 2);

  // Left ticks and right bracket.
  const tickRight = barX - 3;
  const tickLeft = tickRight - 8;
  const bracketX = barX + barWidth + 7;
  const capLength = 6;

  return (
    <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.primary',
        // The SVG carries a fixed width, which overflows a narrow grid column
        // on a phone. The cap is breakpoint-scoped rather than unconditional:
        // at md and up the meter keeps its declared size exactly, because
        // desktop layout is frozen. The viewBox preserves aspect ratio, so no
        // height rule is needed.
        maxWidth: { xs: '100%', md: 'none' },
        '& svg': { maxWidth: { xs: '100%', md: 'none' } },
      }}>
      <svg width={size} height={svgHeight} viewBox={`0 0 ${size} ${svgHeight}`} style={{ overflow: 'visible' }}>
        <rect x={barX} y={barY} width={barWidth} height={barHeight} rx={barRadius} fill={fill} fillOpacity={0.12} />

        {frac > 0 && (
          <rect
            x={barX}
            y={fracToY(frac)}
            width={barWidth}
            height={fillHeight}
            rx={Math.min(barRadius, fillHeight / 2)}
            fill={fill}
            fillOpacity={0.82}
            style={{ transition: 'y 0.4s ease, height 0.4s ease' }}
          />
        )}

        {TICK_FRACTIONS.map((f) => {
          const major = f === 0 || f === 1;
          const y = fracToY(f);
          return (
            <line
              key={f}
              x1={tickLeft + (major ? 0 : 3)}
              y1={y}
              x2={tickRight}
              y2={y}
              stroke="currentColor"
              strokeOpacity={major ? 0.35 : 0.22}
              strokeWidth={major ? 1.5 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {optimalStart !== null && optimalEnd !== null && (
          <g stroke={fill} strokeWidth={2} strokeOpacity={0.85} strokeLinecap="round">
            <line x1={bracketX} y1={fracToY(optimalEnd)} x2={bracketX} y2={fracToY(optimalStart)} />
            <line x1={bracketX} y1={fracToY(optimalEnd)} x2={bracketX + capLength} y2={fracToY(optimalEnd)} />
            <line x1={bracketX} y1={fracToY(optimalStart)} x2={bracketX + capLength} y2={fracToY(optimalStart)} />
          </g>
        )}
      </svg>
    </Box>
  );
}
