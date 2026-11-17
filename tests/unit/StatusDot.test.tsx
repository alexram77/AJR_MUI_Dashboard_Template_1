import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { StatusDot } from '@kit/components/status';
import { renderWithTheme } from './render';

// jsdom ignores @media rules, so a responsive `display` (the default, which
// hides the label below lg) computes to the span's plain `inline`; only an
// unconditional `display: block` shows up as 'block'.
describe('StatusDot', () => {
  it('makes its label responsive by default (top-bar use)', () => {
    renderWithTheme(<StatusDot name="api" state="ok" />);
    expect(getComputedStyle(screen.getByText('api')).display).not.toBe('block');
  });

  it('keeps its label at every width with labelFrom={false}', () => {
    renderWithTheme(<StatusDot name="Sys Log" state="down" labelFrom={false} />);
    expect(getComputedStyle(screen.getByText('Sys Log')).display).toBe('block');
  });

  it('can still drop the label entirely', () => {
    renderWithTheme(<StatusDot name="relay" state="checking" hideLabel labelFrom={false} />);
    expect(screen.queryByText('relay')).toBeNull();
  });
});
