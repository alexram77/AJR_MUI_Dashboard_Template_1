import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { SegmentedControl } from '@kit/components/buttons';
import { renderWithTheme } from './render';

const LAYOUTS = [
  { value: 'grid' as const, label: 'Grid', icon: <GridViewRoundedIcon />, iconOnly: true },
  { value: 'list' as const, label: 'List', icon: <ViewListRoundedIcon />, iconOnly: true },
];

describe('SegmentedControl', () => {
  it('renders icon-only options with the label as the accessible name', () => {
    renderWithTheme(<SegmentedControl options={LAYOUTS} value="grid" onChange={() => {}} />);
    const grid = screen.getByRole('button', { name: 'Grid' });
    expect(grid.textContent).toBe('');
    expect(grid.querySelector('svg')).not.toBeNull();
    expect(grid.getAttribute('aria-pressed')).toBe('true');
  });

  it('shows an icon beside a visible label', () => {
    renderWithTheme(
      <SegmentedControl
        options={[{ value: 'a', label: 'Alpha', icon: <GridViewRoundedIcon /> }]}
        value="a"
        onChange={() => {}}
      />,
    );
    const button = screen.getByRole('button', { name: 'Alpha' });
    expect(button.textContent).toBe('Alpha');
    expect(button.querySelector('svg')).not.toBeNull();
  });

  it('shows the tooltip on hover', async () => {
    renderWithTheme(
      <SegmentedControl
        options={[{ value: 'a', label: 'Alpha', tooltip: 'The first letter' }]}
        value="a"
        onChange={() => {}}
      />,
    );
    fireEvent.mouseOver(screen.getByRole('button', { name: 'Alpha' }));
    expect(await screen.findByRole('tooltip')).toHaveProperty('textContent', 'The first letter');
  });

  it('accepts null — nothing chosen yet', () => {
    renderWithTheme(<SegmentedControl options={LAYOUTS} value={null} onChange={() => {}} />);
    for (const button of screen.getAllByRole('button')) {
      expect(button.getAttribute('aria-pressed')).toBe('false');
    }
  });

  it('ignores a re-click on the active option by default', () => {
    const onChange = vi.fn();
    renderWithTheme(<SegmentedControl options={LAYOUTS} value="grid" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('clears on re-click with allowDeselect', () => {
    const onChange = vi.fn();
    renderWithTheme(<SegmentedControl allowDeselect options={LAYOUTS} value="grid" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
