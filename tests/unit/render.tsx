import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { AppTheme } from '@kit/theme';

/** Render inside the kit theme, as every app does. */
export function renderWithTheme(ui: ReactElement) {
  return render(<AppTheme defaultMode="dark">{ui}</AppTheme>);
}
