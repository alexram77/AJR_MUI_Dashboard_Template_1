import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { ChannelCard } from '@kit/components/sensors';
import type { ChannelDefinition } from '@kit/components/sensors';
import { renderWithTheme } from './render';

const battery: ChannelDefinition = {
  id: 'power.charge',
  label: 'Battery',
  unit: '%',
  min: 0,
  max: 100,
  optimalMin: 20,
  optimalMax: 100,
  baseValue: 78,
  meterType: 'gauge',
};

/** Meter drawings, as opposed to the 24×24 MUI icons in the card header. */
const meterSvgs = (container: HTMLElement) => container.querySelectorAll('svg:not([viewBox="0 0 24 24"])');

describe('ChannelCard', () => {
  it('shows "No data" and no meter when the channel has never reported', () => {
    const { container } = renderWithTheme(<ChannelCard definition={battery} />);

    expect(screen.getByText('Status:', { exact: false }).textContent).toContain('No data');
    // The meter area says so too, and the reading is a dash, not the base value.
    expect(screen.getAllByText('No data').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('—')).toBeTruthy();
    expect(container.textContent).not.toContain('78');
    expect(meterSvgs(container)).toHaveLength(0);
  });

  it('treats an invalid reading as no reading', () => {
    const { container } = renderWithTheme(
      <ChannelCard definition={battery} reading={{ value: 55, valid: false, timestamp: 0 }} />,
    );
    expect(container.textContent).toContain('No data');
    expect(container.textContent).not.toContain('55.0');
  });

  it('draws the meter and the reading when there is one', () => {
    const { container } = renderWithTheme(
      <ChannelCard definition={battery} reading={{ value: 55, valid: true, timestamp: 0 }} />,
    );
    expect(screen.getByText('55.0 %')).toBeTruthy();
    expect(container.textContent).toContain('Optimal');
    expect(meterSvgs(container).length).toBeGreaterThan(0);
  });

  it('dims the card and says why when the hardware is absent', () => {
    const { container } = renderWithTheme(
      <ChannelCard
        definition={battery}
        hardware={{ absent: true, label: 'Not detected', tone: 'neutral', detail: 'No fuel gauge on I²C' }}
      />,
    );
    expect(screen.getByText('Not detected')).toBeTruthy();
    const card = container.querySelector('[data-absent="true"]') as HTMLElement;
    expect(card).not.toBeNull();
    expect(getComputedStyle(card).opacity).toBe('0.55');
  });

  it('shows no badge when the hardware is present', () => {
    renderWithTheme(
      <ChannelCard
        definition={battery}
        reading={{ value: 55, valid: true, timestamp: 0 }}
        hardware={{ absent: false, label: 'Connected', tone: 'ok' }}
      />,
    );
    expect(screen.queryByText('Connected')).toBeNull();
  });
});
