/**
 * What this app puts in the top bar's `status` and `actions` slots.
 *
 * The intended pattern: the kit's TopBar has no app-specific branches; each
 * app supplies its own indicators as plain nodes. This one shows the full
 * vocabulary — service dots, a connection chip, an alert chip, and a quota bar
 * — each collapsing out at a breakpoint where it would crowd the title.
 */
import Box from '@mui/material/Box';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { AlertChip, ConnectionChip, QuotaBar, StatusDot } from '@kit/components/status';
import { ToolbarIconButton } from '@kit/components/buttons';
import { fmtBytes } from '@kit/utils';

export function DemoTopBarStatus() {
  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
        <StatusDot name="api" state="ok" detail="94ms" />
        <StatusDot name="store" state="ok" detail="12ms" />
        <StatusDot name="relay" state="degraded" detail="retrying (4/5)" />
      </Box>

      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <AlertChip
          active={false}
          okLabel="No alarms"
          alertLabel="ALARM"
          okTooltip="No active alarms across any monitored subsystem"
        />
      </Box>

      <Box sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: 140, md: 190 } }}>
        <QuotaBar
          used={734_000_000_000}
          total={1_000_000_000_000}
          format={fmtBytes}
          dense
          breakdown={[
            ['raw', 412_000_000_000],
            ['curated', 244_000_000_000],
            ['archive', 78_000_000_000],
          ]}
        />
      </Box>

      <ConnectionChip
        connected
        modeLabel="DEMO"
        modeIcon={<CloudRoundedIcon />}
        latencyMs={24}
        detail="Simulated data — no backend"
        simulated
      />
    </>
  );
}

export function DemoTopBarActions() {
  return (
    <>
      <ToolbarIconButton tooltip="Refresh (demo only)" sx={{ color: 'text.secondary' }}>
        <RefreshRoundedIcon />
      </ToolbarIconButton>
      <ToolbarIconButton
        tooltip="View the source"
        sx={{ color: 'text.secondary' }}
        href="https://github.com/alexram77/AJR_MUI_Dashboard_Template_1"
        target="_blank"
        rel="noreferrer"
      >
        <GitHubIcon />
      </ToolbarIconButton>
    </>
  );
}
