/**
 * A small in-browser shell for the terminal demo.
 *
 * Handlers stand in for whatever a real project runs — a script over ttyd, an
 * API call, a local action. Swapping `createLocalTransport` for
 * `createTtydTransport` is the only change needed to point the same panel at a
 * real machine.
 */
import { ansi } from '@kit/components/terminal';
import type { CommandEntry, CommandHandler } from '@kit/components/terminal';
import { fmtBytes } from '@kit/utils';

/** Fake filesystem listing, so `ls` has something to print. */
const FILES = ['README.md', 'netlify.toml', 'package.json', 'src/', 'docs/', 'dist/'];

const STARTED_AT = Date.now();

export const DEMO_COMMANDS: Record<string, CommandHandler> = {
  help: () =>
    [
      ansi.bold('Available commands'),
      '  help              this list',
      '  ls                list files',
      '  status            service health',
      '  storage           disk usage',
      '  uptime            session uptime',
      '  echo <text>       print text back',
      '  sensors           current channel readings',
      '  clear             clear the screen',
      '',
      ansi.dim('This is a local transport — no server is involved.'),
    ].join('\n'),

  ls: () => FILES.map((file) => (file.endsWith('/') ? ansi.cyan(file) : file)).join('  '),

  status: () =>
    [
      `${ansi.green('●')} ingest-gateway   healthy    84ms p95`,
      `${ansi.green('●')} feature-store    healthy   122ms p95`,
      `${ansi.yellow('●')} scoring-api      watch     318ms p95`,
      `${ansi.red('●')} notify-relay     degraded  964ms p95  ${ansi.dim('4.7% errors')}`,
    ].join('\n'),

  storage: () =>
    [
      `root       ${fmtBytes(412e9).padStart(9)} / ${fmtBytes(1e12)}`,
      `data       ${fmtBytes(806e9).padStart(9)} / ${fmtBytes(1e12)}   ${ansi.yellow('80%')}`,
      `archive    ${fmtBytes(78e9).padStart(9)} / ${fmtBytes(2e12)}`,
    ].join('\n'),

  uptime: () => {
    const seconds = Math.floor((Date.now() - STARTED_AT) / 1000);
    return `up ${Math.floor(seconds / 60)}m ${seconds % 60}s (this browser session)`;
  },

  sensors: () =>
    [
      `host.cpu_temp      ${ansi.green('48.2')} °C`,
      `host.cpu_load      ${ansi.green('32.4')} %`,
      `power.voltage      ${ansi.green('12.41')} V`,
      `safety.leak        ${ansi.green('clear')}`,
    ].join('\n'),

  echo: (args) => args.join(' '),

  clear: () => '\x1b[2J\x1b[H',
};

/** The clickable command list shown in the rail. */
export const DEMO_COMMAND_ENTRIES: CommandEntry[] = [
  {
    id: 'help',
    label: 'Show help',
    command: 'help',
    category: 'general',
    description: 'List every command this demo shell understands.',
  },
  {
    id: 'ls',
    label: 'List files',
    command: 'ls',
    category: 'general',
    description: 'Print the (simulated) working directory.',
  },
  {
    id: 'status',
    label: 'Service health',
    command: 'status',
    category: 'diagnostics',
    description: 'Per-service health with p95 latency.',
  },
  {
    id: 'sensors',
    label: 'Read channels',
    command: 'sensors',
    category: 'diagnostics',
    description: 'Current value of every declared channel.',
    subcommands: [
      { label: '--watch', command: 'sensors --watch', description: 'Re-read continuously (demo: single shot).' },
      { label: '--json', command: 'sensors --json', description: 'Machine-readable output.' },
    ],
  },
  {
    id: 'storage',
    label: 'Disk usage',
    command: 'storage',
    category: 'diagnostics',
    description: 'Usage and quota for every mounted volume.',
  },
  {
    id: 'uptime',
    label: 'Uptime',
    command: 'uptime',
    category: 'maintenance',
    description: 'How long this session has been running.',
  },
  {
    id: 'clear',
    label: 'Clear screen',
    command: 'clear',
    category: 'maintenance',
    description: 'Wipe the scrollback.',
  },
];

export const COMMAND_CATEGORY_ORDER = ['general', 'diagnostics', 'maintenance'];

export const COMMAND_CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  diagnostics: 'Diagnostics',
  maintenance: 'Maintenance',
};

export const DEMO_BANNER = [
  ansi.cyan('  AJR dashboard kit — demo shell'),
  ansi.dim("  Local transport, no server. Type 'help' or pick a command from the rail."),
  '',
].join('\n');
