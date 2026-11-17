import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { AppTheme, CHART_SERIES, useChartTokens } from '@kit/theme';
import type { ChartTokens } from '@kit/theme';

// ── The palette checks, computed (OKLab ΔE ×100; Machado 2009 CVD at 1.0) ──
const hex2srgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const s2lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin = (h: string) => hex2srgb(h).map(s2lin);
const relLum = (h: string) => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a: string, b: string) => { const [hi, lo] = [relLum(a), relLum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
function oklab([r, g, b]: number[]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
};
const simulate = (h: string, M: number[][]) => {
  const [r, g, b] = lin(h);
  return M.map((row) => Math.max(0, Math.min(1, row[0] * r + row[1] * g + row[2] * b)));
};
const deltaE = (a: string, b: string, M?: number[][]) => {
  const x = oklab(M ? simulate(a, M) : lin(a));
  const y = oklab(M ? simulate(b, M) : lin(b));
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};

const SURFACE = { light: '#ffffff', dark: '#191919' } as const;
const BAND = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const;

describe.each(['light', 'dark'] as const)('CHART_SERIES.%s', (scheme) => {
  const ramp = CHART_SERIES[scheme];

  it('has 8 distinct slots, brand teal first', () => {
    expect(ramp).toHaveLength(8);
    expect(new Set(ramp).size).toBe(8);
    expect(ramp[0]).toBe('#029cb1');
  });

  it('sits in the lightness band with enough chroma', () => {
    for (const hex of ramp) {
      const [L, a, b] = oklab(lin(hex));
      expect(L, hex).toBeGreaterThanOrEqual(BAND[scheme][0]);
      expect(L, hex).toBeLessThanOrEqual(BAND[scheme][1]);
      expect(Math.hypot(a, b), hex).toBeGreaterThanOrEqual(0.1);
    }
  });

  it('keeps neighbours apart for colour-blind and full-colour readers', () => {
    for (let i = 0; i < ramp.length - 1; i += 1) {
      const [a, b] = [ramp[i], ramp[i + 1]];
      expect(Math.min(deltaE(a, b, MACHADO.protan), deltaE(a, b, MACHADO.deutan)), `${a}/${b}`).toBeGreaterThanOrEqual(8);
      expect(deltaE(a, b), `${a}/${b}`).toBeGreaterThanOrEqual(15);
    }
  });

  it('keeps the first three apart pairwise (x/y/z charts)', () => {
    const [a, b, c] = ramp;
    for (const [x, y] of [[a, b], [a, c], [b, c]]) {
      expect(Math.min(deltaE(x, y, MACHADO.protan), deltaE(x, y, MACHADO.deutan)), `${x}/${y}`).toBeGreaterThanOrEqual(8);
    }
  });

  it('clears 3:1 on the surface (light: all but amber and magenta, which need labels)', () => {
    const low = ramp.filter((hex) => contrast(hex, SURFACE[scheme]) < 3);
    expect(low).toEqual(scheme === 'light' ? ['#eda100', '#e87ba4'] : []);
  });
});

function Probe({ onTokens }: { onTokens: (t: ChartTokens) => void }) {
  onTokens(useChartTokens());
  return null;
}

describe('useChartTokens', () => {
  it.each(['light', 'dark'] as const)('follows the %s scheme', (scheme) => {
    localStorage.setItem('ajr-color-scheme', scheme);
    let tokens: ChartTokens | undefined;
    render(<AppTheme defaultMode={scheme}><Probe onTokens={(t) => (tokens = t)} /></AppTheme>);
    expect(tokens?.series).toEqual(CHART_SERIES[scheme]);
    // Axis text is the scheme's own secondary text colour, not the dark default.
    expect(tokens?.axis).toBe(scheme === 'light' ? 'hsl(220, 20%, 35%)' : '#8A8480');
    localStorage.clear();
  });
});
