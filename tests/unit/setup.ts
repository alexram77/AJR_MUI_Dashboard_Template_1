/**
 * jsdom gaps the kit's components touch. Kept minimal: each stub is something
 * jsdom does not implement, not behaviour under test.
 */
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

if (!('ResizeObserver' in window)) {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
