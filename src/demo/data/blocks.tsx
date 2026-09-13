/**
 * Block library for the flow-builder demo.
 *
 * A pipeline vocabulary rather than a mission one, to show the editor is not
 * tied to any single domain — the same palette, canvas and node chrome drive
 * both.
 */
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import type { BlockDefinition } from '@kit/components/flow';

export const BLOCKS: BlockDefinition[] = [
  { type: 'trigger.webhook', label: 'Webhook', category: 'trigger', icon: <BoltRoundedIcon fontSize="inherit" />, description: 'Start the run when an HTTP request arrives.' },
  { type: 'trigger.schedule', label: 'Schedule', category: 'trigger', icon: <ScheduleRoundedIcon fontSize="inherit" />, description: 'Start the run on a cron expression.' },

  { type: 'flow.loop', label: 'Loop', category: 'flow', icon: <LoopRoundedIcon fontSize="inherit" />, description: 'Repeat the contained blocks.', isContainer: true },
  { type: 'flow.branch', label: 'Branch', category: 'flow', icon: <CallSplitRoundedIcon fontSize="inherit" />, description: 'Take one path or the other on a condition.', isContainer: true },

  { type: 'time.wait', label: 'Wait', category: 'time', icon: <ScheduleRoundedIcon fontSize="inherit" />, description: 'Pause for a fixed duration.' },

  { type: 'io.fetch', label: 'Fetch', category: 'io', icon: <DownloadRoundedIcon fontSize="inherit" />, description: 'Read rows from a source.' },
  { type: 'io.publish', label: 'Publish', category: 'io', icon: <CloudUploadRoundedIcon fontSize="inherit" />, description: 'Write rows to a destination.' },

  { type: 'action.filter', label: 'Filter', category: 'action', icon: <FilterAltRoundedIcon fontSize="inherit" />, description: 'Drop rows that fail a predicate.' },
  { type: 'action.aggregate', label: 'Aggregate', category: 'action', icon: <FunctionsRoundedIcon fontSize="inherit" />, description: 'Group and reduce.' },

  { type: 'capture.snapshot', label: 'Snapshot', category: 'capture', icon: <PhotoCameraRoundedIcon fontSize="inherit" />, description: 'Persist the current state for replay.' },

  { type: 'log.note', label: 'Note', category: 'log', icon: <NotesRoundedIcon fontSize="inherit" />, description: 'Write a marker into the run log.' },

  { type: 'alert.notify', label: 'Notify', category: 'alert', icon: <NotificationsActiveRoundedIcon fontSize="inherit" />, description: 'Raise an alert.' },
];

export const BLOCKS_BY_TYPE: Record<string, BlockDefinition> = Object.fromEntries(
  BLOCKS.map((block) => [block.type, block]),
);

export const BLOCK_CATEGORY_ORDER = ['trigger', 'flow', 'time', 'io', 'action', 'capture', 'log', 'alert'];

/** Starting graph, so the canvas is not empty on first load. */
export const INITIAL_GRAPH = {
  nodes: [
    { id: 'n1', type: 'trigger.schedule', subtitle: 'every 15 min' },
    { id: 'n2', type: 'io.fetch', subtitle: 'orders table' },
    { id: 'n3', type: 'action.filter', subtitle: 'status = open' },
    { id: 'n4', type: 'flow.loop', subtitle: 'per region', childCount: 3 },
    { id: 'n5', type: 'action.aggregate', subtitle: 'sum by day' },
    { id: 'n6', type: 'io.publish', subtitle: 'warehouse' },
    { id: 'n7', type: 'alert.notify', subtitle: 'on failure' },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2' },
    { id: 'e2', source: 'n2', target: 'n3' },
    { id: 'e3', source: 'n3', target: 'n4' },
    { id: 'e4', source: 'n4', target: 'n5' },
    { id: 'e5', source: 'n5', target: 'n6' },
    { id: 'e6', source: 'n3', target: 'n7' },
  ],
};
