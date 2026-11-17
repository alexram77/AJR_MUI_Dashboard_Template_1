import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { ToastProvider, useToast } from '@kit/components/feedback';
import type { ToastApi } from '@kit/components/feedback';
import {
  EMPTY_TOAST_QUEUE,
  TOAST_DURATION,
  advanceToast,
  enqueueToast,
  makeToast,
} from '@kit/components/feedback/toastQueue';
import { renderWithTheme } from './render';

describe('toast queue', () => {
  it('shows the first toast at once and queues the rest in order', () => {
    let state = enqueueToast(EMPTY_TOAST_QUEUE, makeToast('one'));
    state = enqueueToast(state, makeToast('two'));
    state = enqueueToast(state, makeToast('three'));
    expect(state.current?.message).toBe('one');
    expect(state.pending.map((t) => t.message)).toEqual(['two', 'three']);

    state = advanceToast(state);
    expect(state.current?.message).toBe('two');
    state = advanceToast(advanceToast(state));
    expect(state).toEqual(EMPTY_TOAST_QUEUE);
  });

  it('drops an exact repeat of the last toast', () => {
    let state = enqueueToast(EMPTY_TOAST_QUEUE, makeToast('Saved', { severity: 'success' }));
    state = enqueueToast(state, makeToast('Saved', { severity: 'success' }));
    expect(state.pending).toHaveLength(0);
    // Same words at another severity are news.
    state = enqueueToast(state, makeToast('Saved', { severity: 'error' }));
    expect(state.pending).toHaveLength(1);
  });

  it('takes its duration from the severity unless told otherwise', () => {
    expect(makeToast('x', { severity: 'error' }).duration).toBe(TOAST_DURATION.error);
    expect(makeToast('x').duration).toBe(TOAST_DURATION.info);
    expect(makeToast('x', { duration: null }).duration).toBeNull();
    expect(TOAST_DURATION.error).toBeGreaterThan(TOAST_DURATION.success);
  });
});

function Harness({ onReady }: { onReady: (api: ToastApi) => void }) {
  onReady(useToast());
  return null;
}

describe('ToastProvider', () => {
  it('shows a toast with its severity, and runs its action', () => {
    let api!: ToastApi;
    const retry = vi.fn();
    renderWithTheme(
      <ToastProvider>
        <Harness onReady={(next) => (api = next)} />
      </ToastProvider>,
    );

    act(() => api.error('Save failed', { action: { label: 'Retry', onClick: retry } }));
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Save failed');
    expect(alert.className).toMatch(/Error/);

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it('hides itself after its duration and then shows the next', () => {
    vi.useFakeTimers();
    try {
      let api!: ToastApi;
      renderWithTheme(
        <ToastProvider>
          <Harness onReady={(next) => (api = next)} />
        </ToastProvider>,
      );
      act(() => {
        api.success('first', { duration: 1000 });
        api.info('second');
      });
      expect(screen.getByRole('alert').textContent).toContain('first');

      act(() => vi.advanceTimersByTime(1000)); // auto-hide
      act(() => vi.advanceTimersByTime(1000)); // exit transition
      expect(screen.getByRole('alert').textContent).toContain('second');
    } finally {
      vi.useRealTimers();
    }
  });

  it('throws a clear error without a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithTheme(<Harness onReady={() => {}} />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
