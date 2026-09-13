/**
 * Click-to-rename label.
 *
 * Reads as plain text until clicked, then becomes an input. Commits on Enter
 * or blur, reverts on Escape. Clearing the field restores the default label
 * rather than leaving the card nameless.
 */
import { useEffect, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export interface InlineAliasEditorProps {
  /** Current override, or undefined when the default is in use. */
  alias?: string;
  /** Shown when no alias is set. */
  defaultLabel: string;
  /** Receives the new alias, or '' to clear it back to the default. */
  onCommit: (alias: string) => void;
  disabled?: boolean;
}

export function InlineAliasEditor({
  alias,
  defaultLabel,
  onCommit,
  disabled = false,
}: InlineAliasEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(alias ?? defaultLabel);
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-sync when the card's alias changes underneath us (a reset, a reload).
  useEffect(() => {
    if (!editing) setDraft(alias ?? defaultLabel);
  }, [alias, defaultLabel, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    // An empty field means "go back to the default", not "no name".
    onCommit(next === defaultLabel ? '' : next);
  };

  const cancel = () => {
    setDraft(alias ?? defaultLabel);
    setEditing(false);
  };

  if (editing) {
    return (
      <InputBase
        inputRef={inputRef}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') cancel();
        }}
        sx={{
          fontSize: '0.85rem',
          fontWeight: 600,
          textAlign: 'center',
          '& input': { textAlign: 'center', p: 0 },
          borderBottom: '1px solid',
          borderColor: 'primary.main',
        }}
      />
    );
  }

  return (
    <Tooltip title={disabled ? '' : 'Click to rename'}>
      <Typography
        variant="subtitle2"
        onClick={disabled ? undefined : () => setEditing(true)}
        sx={{
          fontWeight: 600,
          fontSize: '0.85rem',
          textAlign: 'center',
          cursor: disabled ? 'default' : 'text',
          borderBottom: '1px solid transparent',
          '&:hover': disabled ? {} : { borderColor: 'divider' },
        }}
      >
        {alias || defaultLabel}
      </Typography>
    </Tooltip>
  );
}
