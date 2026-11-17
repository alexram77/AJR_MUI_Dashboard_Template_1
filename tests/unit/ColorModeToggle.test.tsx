import { describe, expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { ColorModeToggle } from '@kit/theme';
import { renderWithTheme } from './render';

describe('ColorModeToggle', () => {
  it('shows the switch for the current scheme and flips it', async () => {
    localStorage.clear();
    renderWithTheme(<ColorModeToggle />);
    fireEvent.click(await screen.findByRole('button', { name: 'Switch to light mode' }));
    expect(await screen.findByRole('button', { name: 'Switch to dark mode' })).toBeTruthy();
    expect(localStorage.getItem('ajr-color-scheme')).toBe('light');
    localStorage.clear();
  });
});
