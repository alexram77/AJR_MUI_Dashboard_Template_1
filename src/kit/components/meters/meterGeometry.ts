/**
 * Geometry shared by the SVG meters.
 *
 * The meters are hand-drawn SVG rather than a charting library because they
 * need exact control over concentric arcs, tick placement and optimal-range
 * brackets. Keeping the maths here means the drawing code in each meter stays
 * short enough to read.
 */
import { fraction } from '../../utils/number';

/** Range and optional "good" band shared by every meter. */
export interface MeterScale {
  value: number;
  min: number;
  max: number;
  /** Lower bound of the healthy band. */
  optimalMin?: number;
  /** Upper bound of the healthy band. */
  optimalMax?: number;
}

/** Fractions along the scale for the value and the optimal band. */
export function scaleFractions(scale: MeterScale) {
  const { value, min, max, optimalMin, optimalMax } = scale;
  return {
    value: fraction(value, min, max),
    optimalStart: optimalMin !== undefined ? fraction(optimalMin, min, max) : null,
    optimalEnd: optimalMax !== undefined ? fraction(optimalMax, min, max) : null,
  };
}

/** Tick positions every meter marks: 0, 25, 50, 75, 100%. */
export const TICK_FRACTIONS = [0, 0.25, 0.5, 0.75, 1] as const;

/**
 * Point on a 180° gauge arc, sweeping left → top → right.
 * `f` is a fraction in [0, 1] along that sweep.
 */
export function polarOnGauge(cx: number, cy: number, radius: number, f: number) {
  const radians = (180 + f * 180) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

/**
 * SVG path for a gauge sub-arc. The gauge spans exactly 180°, so any sub-arc
 * is at most 180° and the large-arc flag is always 0.
 */
export function gaugeArcPath(cx: number, cy: number, radius: number, from: number, to: number): string {
  const start = polarOnGauge(cx, cy, radius, from);
  const end = polarOnGauge(cx, cy, radius, to);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}
