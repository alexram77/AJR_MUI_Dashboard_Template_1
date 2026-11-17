/**
 * Compact exclusive choice — range pickers, view switches, unit toggles.
 *
 * Lighter than tabs (no navigation semantics) and denser than a Select. Built
 * on ToggleButtonGroup so keyboard and ARIA behaviour come for free.
 *
 * Options can carry an icon and a tooltip. An icon-only option (`iconOnly`)
 * still needs its `label`: it becomes the accessible name and, unless a
 * tooltip is given, the tooltip too.
 *
 * `value` may be null — nothing chosen yet. By default a choice, once made,
 * cannot be undone by re-clicking it; pass `allowDeselect` for a control
 * where "none" is a real answer (a filter that can be switched off).
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { CONTROL_SIZING } from '../../theme/sizing';

export interface SegmentedOption<T extends string | number> {
  value: T;
  /** Visible text, and the accessible name when `iconOnly`. */
  label: string;
  /** Shown before the label, or alone when `iconOnly`. */
  icon?: ReactNode;
  /** Hide the label and show only the icon. */
  iconOnly?: boolean;
  /** Hover text. Defaults to the label for an icon-only option. */
  tooltip?: string;
  disabled?: boolean;
}

interface SegmentedControlBase<T extends string | number> {
  options: SegmentedOption<T>[];
  /** The chosen option, or null when nothing is chosen. */
  value: T | null;
  /** Accessible name for the group. */
  ariaLabel?: string;
  fullWidth?: boolean;
}

export interface SegmentedControlRequiredProps<T extends string | number> extends SegmentedControlBase<T> {
  /** Re-clicking the active option is ignored; the change is always a value. */
  allowDeselect?: false;
  onChange: (value: T) => void;
}

export interface SegmentedControlDeselectProps<T extends string | number> extends SegmentedControlBase<T> {
  /** Re-clicking the active option clears it; the change may be null. */
  allowDeselect: true;
  onChange: (value: T | null) => void;
}

export type SegmentedControlProps<T extends string | number> =
  | SegmentedControlRequiredProps<T>
  | SegmentedControlDeselectProps<T>;

export function SegmentedControl<T extends string | number>(props: SegmentedControlProps<T>) {
  const { options, value, ariaLabel, fullWidth = false } = props;

  const handleChange = (_: unknown, next: T | null) => {
    if (props.allowDeselect) props.onChange(next);
    // Without allowDeselect, `next` is null only when the active button is
    // re-clicked; ignoring it means a choice can never be undone by accident.
    else if (next !== null) props.onChange(next);
  };

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label={ariaLabel}
      fullWidth={fullWidth}
      onChange={handleChange}
    >
      {options.map((option) => {
        const tooltip = option.tooltip ?? (option.iconOnly ? option.label : undefined);
        const button = (
          <ToggleButton
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
            aria-label={option.iconOnly ? option.label : undefined}
          >
            {option.icon && (
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: 'inline-flex',
                  mr: option.iconOnly ? 0 : 0.75,
                  // Same icon scale as a labelled / icon-only button.
                  '& svg': {
                    fontSize: option.iconOnly ? CONTROL_SIZING.iconButtonIcon : CONTROL_SIZING.buttonIcon,
                  },
                }}
              >
                {option.icon}
              </Box>
            )}
            {!option.iconOnly && option.label}
          </ToggleButton>
        );
        // MUI cannot show a tooltip on a disabled button (it gets no pointer
        // events), and wrapping one in a span would break the group's joined
        // borders, so a disabled option goes without.
        return tooltip && !option.disabled ? (
          <Tooltip key={String(option.value)} title={tooltip}>
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </ToggleButtonGroup>
  );
}
