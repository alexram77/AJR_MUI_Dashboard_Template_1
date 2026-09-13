/**
 * The button vocabulary.
 *
 * Every button in an app built on this kit is described by an *intent* — what
 * it does — rather than by a variant and a colour. That indirection is the
 * whole point: "the destructive button" looks the same in every project and on
 * every page, and changing how destructive buttons look is one edit here.
 *
 * Do not pass `variant`/`color` directly to a kit button. If you need an
 * appearance that is not here, add an intent rather than a one-off.
 */
import type { ButtonProps } from '@mui/material/Button';

export type ButtonIntent =
  /** The one affirmative action on a screen. At most one per view. */
  | 'primary'
  /** Everything else that acts — export, refresh, open. */
  | 'secondary'
  /** Destructive or irreversible. Always pair with a ConfirmDialog. */
  | 'danger'
  /** Cautionary but not destructive — pause, override, force. */
  | 'warning'
  /** Confirms or completes — approve, deploy, mark done. */
  | 'success'
  /** Lowest emphasis: cancel, dismiss, tertiary navigation. */
  | 'ghost';

export interface IntentStyle {
  variant: NonNullable<ButtonProps['variant']>;
  color: NonNullable<ButtonProps['color']>;
}

/** Intent → MUI variant + palette colour. The single mapping. */
export const BUTTON_INTENTS: Record<ButtonIntent, IntentStyle> = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'outlined', color: 'primary' },
  danger: { variant: 'outlined', color: 'error' },
  warning: { variant: 'outlined', color: 'warning' },
  success: { variant: 'contained', color: 'success' },
  ghost: { variant: 'text', color: 'inherit' },
};

/**
 * Control heights.
 *
 * `sm` is the toolbar/dense height and matches the theme's
 * `MuiButton.sizeSmall` override. `md` is the comfortable height for forms and
 * dialogs. `touch` is the 44px minimum a finger needs — the kit's mobile
 * layers opt into it rather than shrinking desktop to match.
 */
export const BUTTON_HEIGHTS = { sm: 30, md: 36, touch: 44 } as const;

export type ButtonSize = keyof typeof BUTTON_HEIGHTS;

/** Map a kit size onto the MUI size prop the theme overrides are keyed on. */
export function muiSizeFor(size: ButtonSize): 'small' | 'medium' {
  return size === 'sm' ? 'small' : 'medium';
}
