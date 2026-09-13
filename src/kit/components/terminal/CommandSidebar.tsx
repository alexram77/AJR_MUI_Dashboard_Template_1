/**
 * Clickable command list for a terminal rail.
 *
 * Commands are grouped by category and sent to the terminal on click, so the
 * operations a project supports are discoverable instead of remembered. A
 * command with `subcommands` renders its variants indented beneath it.
 */
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Tooltip from '@mui/material/Tooltip';
import SubdirectoryArrowRightRoundedIcon from '@mui/icons-material/SubdirectoryArrowRightRounded';
import { monoFamily, sectionLabel } from '../../theme/styleTokens';
import type { CommandEntry } from './types';

export interface CommandSidebarProps {
  commands: CommandEntry[];
  /** Called with the command text. Usually `panel.sendText(cmd + '\r')`. */
  onSelect: (command: string) => void;
  /** Grey everything out — e.g. while disconnected. */
  disabled?: boolean;
  /** Categories render in this order; anything else follows alphabetically. */
  categoryOrder?: string[];
  /** Display names for category keys. Falls back to a humanised key. */
  categoryLabels?: Record<string, string>;
}

/** `run_diagnostics` → `Run Diagnostics`. */
function humanise(key: string): string {
  return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CommandSidebar({
  commands,
  onSelect,
  disabled = false,
  categoryOrder = [],
  categoryLabels = {},
}: CommandSidebarProps) {
  const groups = useMemo(() => {
    const byCategory = new Map<string, CommandEntry[]>();
    for (const entry of commands) {
      const key = entry.category ?? 'general';
      const list = byCategory.get(key);
      if (list) list.push(entry);
      else byCategory.set(key, [entry]);
    }

    // Canonical order first, then whatever is left, alphabetically.
    const ordered: Array<{ key: string; label: string; entries: CommandEntry[] }> = [];
    for (const key of categoryOrder) {
      const entries = byCategory.get(key);
      if (entries) {
        ordered.push({ key, label: categoryLabels[key] ?? humanise(key), entries });
        byCategory.delete(key);
      }
    }
    for (const key of [...byCategory.keys()].sort()) {
      ordered.push({ key, label: categoryLabels[key] ?? humanise(key), entries: byCategory.get(key)! });
    }
    return ordered;
  }, [commands, categoryOrder, categoryLabels]);

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <List dense disablePadding>
        {groups.map((group, index) => (
          <Box key={group.key}>
            {index > 0 && <Divider />}
            <ListSubheader
              disableSticky
              sx={{ ...sectionLabel, bgcolor: 'transparent', lineHeight: 2.2, px: 2 }}
            >
              {group.label}
            </ListSubheader>

            {group.entries.map((entry) => (
              <Box key={entry.id}>
                <Tooltip title={entry.description ?? entry.command} placement="right">
                  <span>
                    <ListItemButton
                      disabled={disabled}
                      onClick={() => onSelect(entry.command)}
                      sx={{ mx: 1, borderRadius: 1, py: 0.5 }}
                    >
                      <ListItemText
                        primary={entry.label}
                        slotProps={{ primary: { fontSize: '0.82rem', fontWeight: 500 } }}
                      />
                      {entry.subcommands && entry.subcommands.length > 0 && (
                        <Chip
                          label={entry.subcommands.length}
                          size="small"
                          variant="outlined"
                          sx={{ height: 17, fontSize: '0.58rem' }}
                        />
                      )}
                    </ListItemButton>
                  </span>
                </Tooltip>

                {entry.subcommands?.map((sub) => (
                  <Tooltip key={sub.label} title={sub.description ?? sub.command} placement="right">
                    <span>
                      <ListItemButton
                        disabled={disabled}
                        onClick={() => onSelect(sub.command)}
                        sx={{ mx: 1, ml: 2.5, borderRadius: 1, py: 0.25 }}
                      >
                        <SubdirectoryArrowRightRoundedIcon
                          sx={{ fontSize: '0.85rem', color: 'text.disabled', mr: 0.75 }}
                        />
                        <ListItemText
                          primary={sub.label}
                          slotProps={{
                            primary: { ...monoFamily, fontSize: '0.74rem', color: 'text.secondary' },
                          }}
                        />
                      </ListItemButton>
                    </span>
                  </Tooltip>
                ))}
              </Box>
            ))}
          </Box>
        ))}
      </List>
    </Box>
  );
}
