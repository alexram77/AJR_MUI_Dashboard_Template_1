import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { BlockPalette, DEFAULT_BLOCK_CATEGORIES } from '@kit/components/flow';
import type { BlockDefinition } from '@kit/components/flow';
import { renderWithTheme } from './render';

const BLOCKS: BlockDefinition[] = [
  { type: 'io.fetch', label: 'Fetch', category: 'io', icon: null, description: 'Read rows.' },
  {
    type: 'capture.photo',
    label: 'Photo',
    category: 'capture',
    icon: null,
    description: 'Take a photo.',
    disabled: true,
    disabledReason: 'No camera on this unit',
  },
];

const row = (type: string) => document.querySelector(`[data-block-type="${type}"]`) as HTMLElement;

describe('BlockPalette', () => {
  it('shows a disabled block greyed, with its reason', () => {
    renderWithTheme(<BlockPalette blocks={BLOCKS} categories={DEFAULT_BLOCK_CATEGORIES} />);
    const photo = row('capture.photo');
    expect(photo.getAttribute('aria-disabled')).toBe('true');
    expect(photo.getAttribute('draggable')).toBe('false');
    expect(photo.getAttribute('title')).toBe('No camera on this unit');
    expect(screen.getByText('No camera on this unit')).toBeTruthy();
    expect(getComputedStyle(photo).opacity).toBe('0.55');
  });

  it('leaves an enabled block alone', () => {
    renderWithTheme(<BlockPalette blocks={BLOCKS} categories={DEFAULT_BLOCK_CATEGORIES} />);
    const fetch = row('io.fetch');
    expect(fetch.getAttribute('aria-disabled')).toBeNull();
    expect(fetch.getAttribute('draggable')).toBe('true');
    expect(fetch.getAttribute('title')).toBe('Read rows.');
  });

  it('will not add a disabled block by click', () => {
    const onAdd = vi.fn();
    renderWithTheme(<BlockPalette blocks={BLOCKS} categories={DEFAULT_BLOCK_CATEGORIES} onAdd={onAdd} />);
    fireEvent.click(row('capture.photo'));
    expect(onAdd).not.toHaveBeenCalled();
    fireEvent.click(row('io.fetch'));
    expect(onAdd).toHaveBeenCalledWith(BLOCKS[0]);
  });

  it('will not start a drag for a disabled block', () => {
    renderWithTheme(<BlockPalette blocks={BLOCKS} categories={DEFAULT_BLOCK_CATEGORIES} />);
    const setData = vi.fn();
    const blocked = fireEvent.dragStart(row('capture.photo'), { dataTransfer: { setData } });
    expect(blocked).toBe(false); // default prevented
    expect(setData).not.toHaveBeenCalled();

    fireEvent.dragStart(row('io.fetch'), { dataTransfer: { setData } });
    expect(setData).toHaveBeenCalled();
  });
});
