/**
 * Search input with a leading icon and a clear button.
 *
 * Controlled — debouncing belongs to the caller, which knows whether the query
 * hits an API or filters an in-memory list.
 */
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Fired on Enter — for search-on-submit rather than search-as-you-type. */
  onSubmit?: (value: string) => void;
  fullWidth?: boolean;
  autoFocus?: boolean;
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
  onSubmit,
  fullWidth = false,
  autoFocus = false,
}: SearchFieldProps) {
  return (
    <TextField
      size="small"
      value={value}
      placeholder={placeholder}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onSubmit?.(value);
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: '1.05rem', color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')} aria-label="Clear search">
                <ClearRoundedIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
