/**
 * Half-circle gauge with a needle.
 *
 * The optimal band is a thin concentric arc just outside the bar rather than a
 * coloured zone inside it — so "where the needle is" and "where it should be"
 * are two separate readings instead of one ambiguous one.
 */
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { TICK_FRACTIONS, gaugeArcPath, polarOnGauge, scaleFractions } from './meterGeometry';
import type { MeterScale } from './meterGeometry';

export interface GaugeMeterProps extends MeterScale {
  /** Overall width in px; height derives from it. */
  size?: number;
  /** Defaults to the theme's primary colour. */
  color?: string;
}

export function GaugeMeter({ size = 140, color, ...scale }: GaugeMeterProps) {
  const theme = useTheme();
  const stroke = color ?? theme.palette.primary.main;

  // ── Layout ────────────────────────────────────────────────────────────────
  const svgHeight = size * 0.62;
  const cx = size / 2;
  const cy = svgHeight * 0.91;
  const midRadius = size * 0.37;
  const barWidth = size * 0.11;
  const outerRadius = midRadius + barWidth / 2;
  const innerRadius = midRadius - barWidth / 2;

  const { value: frac, optimalStart, optimalEnd } = scaleFractions(scale);

  // Optimal band sits just outside the bar so the two never overlap.
  const optimalRadius = outerRadius + 4;

  // Ticks point inward from the hollow centre.
  const tickOuter = innerRadius - 3;
  const tickInner = innerRadius - 12;

  // ── Needle ────────────────────────────────────────────────────────────────
  const needleRadians = (180 + frac * 180) * (Math.PI / 180);
  const tip = polarOnGauge(cx, cy, innerRadius - 8, frac);
  const perpendicular = needleRadians + Math.PI / 2;
  const baseHalfWidth = barWidth * 0.28;
  const baseA = {
    x: cx + baseHalfWidth * Math.cos(perpendicular),
    y: cy + baseHalfWidth * Math.sin(perpendicular),
  };
  const baseB = {
    x: cx - baseHalfWidth * Math.cos(perpendicular),
    y: cy - baseHalfWidth * Math.sin(perpendicular),
  };

  return (
    <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.primary',
        // The SVG carries a fixed width, which overflows a narrow grid column
        // on a phone. The cap is breakpoint-scoped rather than unconditional:
        // at md and up the meter keeps its declared size exactly, because
        // desktop layout is frozen. The viewBox preserves aspect ratio, so no
        // height rule is needed.
        maxWidth: { xs: '100%', md: 'none' },
        '& svg': { maxWidth: { xs: '100%', md: 'none' } },
      }}>
      <svg width={size} height={svgHeight} viewBox={`0 0 ${size} ${svgHeight}`} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path
          d={gaugeArcPath(cx, cy, midRadius, 0, 1)}
          fill="none"
          stroke={stroke}
          strokeWidth={barWidth}
          strokeLinecap="round"
          opacity={0.1}
        />

        {/* Value fill */}
        {frac > 0 && (
          <path
            d={gaugeArcPath(cx, cy, midRadius, 0, frac)}
            fill="none"
            stroke={stroke}
            strokeWidth={barWidth}
            strokeLinecap="round"
            opacity={0.85}
          />
        )}

        {/* Optimal band */}
        {optimalStart !== null && optimalEnd !== null && (
          <path
            d={gaugeArcPath(cx, cy, optimalRadius, optimalStart, optimalEnd)}
            fill="none"
            stroke={stroke}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.45}
          />
        )}

        {/* Proportion ticks */}
        {TICK_FRACTIONS.map((f) => {
          const outer = polarOnGauge(cx, cy, tickOuter, f);
          const inner = polarOnGauge(cx, cy, tickInner, f);
          return (
            <line
              key={f}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle + hub */}
        <path d={`M ${tip.x} ${tip.y} L ${baseA.x} ${baseA.y} L ${baseB.x} ${baseB.y} Z`} fill={stroke} />
        <circle cx={cx} cy={cy} r={barWidth * 0.36} fill={stroke} />
        <circle cx={cx} cy={cy} r={barWidth * 0.16} fill="white" opacity={0.6} />
      </svg>
    </Box>
  );
}
