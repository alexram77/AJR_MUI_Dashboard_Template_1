/**
 * The assembled block editor: palette rail, optional breadcrumb, canvas, and
 * inspector rail.
 *
 * A convenience composition — every part is exported separately, so an app
 * that wants a different arrangement (palette in a drawer, inspector below the
 * canvas) can lay the same pieces out itself. This also supplies the
 * `ReactFlowProvider` that `FlowCanvas` requires.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { ReactFlowProvider } from '@xyflow/react';
import { PAGE_CARD_SX } from '../page/pageCardSx';

export interface FlowEditorProps {
  /** Usually a `<BlockPalette/>`. Omit for a canvas with no library rail. */
  palette?: ReactNode;
  paletteWidth?: number;
  /** Usually a `<FlowBreadcrumb/>`, above the canvas. */
  breadcrumb?: ReactNode;
  /** Usually a `<FlowCanvas/>`. */
  canvas: ReactNode;
  /** Usually a `<BlockInspector/>`. */
  inspector?: ReactNode;
  /** A strip above everything — validation errors, a toolbar. */
  toolbar?: ReactNode;
}

export function FlowEditor({
  palette,
  paletteWidth = 240,
  breadcrumb,
  canvas,
  inspector,
  toolbar,
}: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <Box sx={{ ...PAGE_CARD_SX, flexDirection: 'column' }}>
        {toolbar && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>{toolbar}</Box>
        )}

        <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
          {palette && (
            <Box
              sx={{
                width: paletteWidth,
                flexShrink: 0,
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              {palette}
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {breadcrumb}
            {canvas}
          </Box>

          {inspector && <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>{inspector}</Box>}
        </Box>
      </Box>
    </ReactFlowProvider>
  );
}
