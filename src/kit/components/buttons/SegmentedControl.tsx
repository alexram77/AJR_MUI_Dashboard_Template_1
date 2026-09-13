/**
 * Compact exclusive choice — range pickers, view switches, unit toggles.
 *
 * Lighter than tabs (no navigation semantics) and denser than a Select. Built
 * on ToggleButtonGroup so keyboard and ARIA behaviour come for free.
 */
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group. */
  ariaLabel?: string;
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label={ariaLabel}
      fullWidth={fullWidth}
      // `next` is null when the active button is re-clicked; ignore that so the
      // control can never end up with nothing selected.
      onChange={(_, next: T | null) => next !== null && onChange(next)}
    >
      {options.map((option) => (
        <ToggleButton key={String(option.value)} value={option.value} disabled={option.disabled}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
