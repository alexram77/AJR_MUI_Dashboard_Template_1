/**
 * Draggable block library for the canvas rail.
 *
 * Rows are grouped under their category heading and tinted to match the node
 * cards they produce, so a block is recognisable before it is dropped. Drags
 * carry `BLOCK_DND_TYPE`, which `FlowCanvas` uses to tell a palette drag from
 * a text or file drag.
 *
 * A block marked `disabled` stays in the list, greyed, with its reason under
 * the label; it cannot be dragged or clicked in. Its category heading counts
 * it like any other, so the library does not reshuffle as availability changes.
 */
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { sectionLabel } from '../../theme/styleTokens';
import { BLOCK_DND_TYPE, styleForCategory } from './blockCategories';
import type { BlockCategoryStyle, BlockDefinition } from './types';

export interface BlockPaletteProps {
  blocks: BlockDefinition[];
  categories: Record<string, BlockCategoryStyle>;
  /** Categories render in this order; the rest follow in first-seen order. */
  categoryOrder?: string[];
  /** Optional click-to-add, alongside dragging. */
  onAdd?: (block: BlockDefinition) => void;
  /** Helper line pinned under the list. */
  hint?: string;
}

export function BlockPalette({
  blocks,
  categories,
  categoryOrder = [],
  onAdd,
  hint = 'Drag a block onto the canvas, or click to add it.',
}: BlockPaletteProps) {
  const theme = useTheme();

  const groups = useMemo(() => {
    const byCategory = new Map<string, BlockDefinition[]>();
    for (const block of blocks) {
      const list = byCategory.get(block.category);
      if (list) list.push(block);
      else byCategory.set(block.category, [block]);
    }

    const ordered: Array<{ key: string; style: BlockCategoryStyle; items: BlockDefinition[] }> = [];
    for (const key of categoryOrder) {
      const items = byCategory.get(key);
      if (items) {
        ordered.push({ key, style: styleForCategory(categories, key), items });
        byCategory.delete(key);
      }
    }
    for (const [key, items] of byCategory) {
      ordered.push({ key, style: styleForCategory(categories, key), items });
    }
    return ordered;
  }, [blocks, categories, categoryOrder]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ px: 2, py: 1.25, flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}>
        <Typography sx={{ ...sectionLabel, display: 'block' }}>Block library</Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: 1.5 }}>
        {groups.map((group) => (
          <Box key={group.key} sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                px: 2,
                py: 0.5,
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: 0.4,
                color: group.style.color,
              }}
            >
              {group.style.label}
            </Typography>

            <Stack spacing={0.25} sx={{ px: 1 }}>
              {group.items.map((block) => {
                const disabled = block.disabled === true;
                return (
                  <Box
                    key={block.type}
                    draggable={!disabled}
                    aria-disabled={disabled || undefined}
                    data-block-type={block.type}
                    title={disabled ? block.disabledReason ?? block.description : block.description}
                    onClick={onAdd && !disabled ? () => onAdd(block) : undefined}
                    onDragStart={(event) => {
                      if (disabled) {
                        event.preventDefault();
                        return;
                      }
                      event.dataTransfer.setData(BLOCK_DND_TYPE, block.type);
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: disabled && block.disabledReason ? 'flex-start' : 'center',
                      gap: 1,
                      px: 1.25,
                      py: 0.75,
                      borderRadius: 1,
                      border: '1px solid transparent',
                      cursor: disabled ? 'not-allowed' : 'grab',
                      opacity: disabled ? 0.55 : 1,
                      transition: 'background-color 100ms ease, border-color 100ms ease',
                      '&:hover': disabled
                        ? {}
                        : {
                            bgcolor: alpha(group.style.color, theme.palette.mode === 'dark' ? 0.08 : 0.06),
                            borderColor: alpha(group.style.color, 0.3),
                          },
                      '&:active': { cursor: disabled ? 'not-allowed' : 'grabbing' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 22,
                        height: 22,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 0.75,
                        bgcolor: group.style.iconBg,
                        color: group.style.color,
                        fontSize: '0.95rem',
                      }}
                    >
                      {block.icon}
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.825rem', fontWeight: 500, lineHeight: 1.2 }}>
                        {block.label}
                      </Typography>
                      {disabled && block.disabledReason && (
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', fontSize: '0.66rem', lineHeight: 1.3, mt: 0.25, color: 'text.secondary' }}
                        >
                          {block.disabledReason}
                        </Typography>
                      )}
                    </Box>

                    {block.isContainer && (
                      <Box
                        sx={{
                          ml: 'auto',
                          px: 0.5,
                          borderRadius: 0.5,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          color: 'text.secondary',
                          bgcolor: alpha(theme.palette.text.secondary, 0.12),
                        }}
                      >
                        GRP
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ))}

        {hint && (
          <Typography
            variant="caption"
            sx={{ display: 'block', px: 2, mt: 1, color: 'text.disabled', fontSize: '0.7rem', fontStyle: 'italic' }}
          >
            {hint}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
