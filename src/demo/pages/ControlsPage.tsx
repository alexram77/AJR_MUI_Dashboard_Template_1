/**
 * Controls, dialogs and the three non-content states.
 */
import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard } from '@kit/components/cards';
import { ActionButton, ButtonRow, MenuButton, SegmentedControl, ToolbarButton, ToolbarIconButton } from '@kit/components/buttons';
import { SearchField } from '@kit/components/controls';
import { ConfirmDialog, EmptyState, FullScreenDialog, StateBlock } from '@kit/components/feedback';
import { KeyValueList } from '@kit/components/data';
import { useDisclosure } from '@kit/hooks';
import { bodyMuted, captionMuted } from '@kit/theme';

export default function ControlsPage() {
  const confirm = useDisclosure();
  const fullScreen = useDisclosure();
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [density, setDensity] = useState<'compact' | 'cosy' | 'roomy'>('cosy');

  /** Fake a request so the loading state is visible for a beat. */
  const runSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      confirm.onClose();
    }, 1200);
  };

  return (
    <PageContainer
      header={
        <PageHeader
          title="Controls & Dialogs"
          subtitle="Toolbar actions share one height from the theme's MuiButton sizeSmall override — which is what keeps a mixed row of buttons and icon buttons aligned with no per-call sx."
          actions={
            <Stack direction="row" spacing={1} alignItems="center">
              <ToolbarIconButton tooltip="Refresh">
                <RefreshRoundedIcon />
              </ToolbarIconButton>
              <ToolbarButton variant="contained" startIcon={<AddRoundedIcon />}>
                New
              </ToolbarButton>
            </Stack>
          }
        />
      }
    >
      <SectionCard
        title="Intents, not variants"
        subtitle="Every kit button takes an intent — what it does — instead of a variant and a colour. One mapping in buttonTokens.ts decides how each looks, so 'the destructive button' is identical in every project and on every page."
      >
        <ButtonRow gap={1.25}>
          <ActionButton intent="primary" startIcon={<SaveRoundedIcon />}>Primary</ActionButton>
          <ActionButton intent="secondary" startIcon={<DownloadRoundedIcon />}>Secondary</ActionButton>
          <ActionButton intent="success" startIcon={<SaveRoundedIcon />}>Success</ActionButton>
          <ActionButton intent="warning" startIcon={<FilterListRoundedIcon />}>Warning</ActionButton>
          <ActionButton intent="danger" startIcon={<DeleteOutlineRoundedIcon />} onClick={confirm.onOpen}>
            Danger
          </ActionButton>
          <ActionButton intent="ghost">Ghost</ActionButton>
        </ButtonRow>

        <Typography sx={{ ...captionMuted, mt: 2, display: 'block' }}>
          Below the sm breakpoint a ButtonRow stacks and its children go full width — which is what
          makes a six-action toolbar usable on a phone without changing anything on desktop.
        </Typography>
      </SectionCard>

      <SectionCard
        title="States"
        subtitle="Loading swaps the icon for a spinner and blocks re-clicks; a tooltip still fires while the button is disabled."
      >
        <ButtonRow gap={1.25}>
          <ActionButton intent="primary" loading>Saving</ActionButton>
          <ActionButton intent="secondary" disabled tooltip="Disabled — but this tooltip still fires">
            Disabled
          </ActionButton>
          <ActionButton intent="secondary" size="sm">Small</ActionButton>
          <ActionButton intent="secondary" size="md">Medium</ActionButton>
          <ActionButton intent="secondary" size="touch">Touch (44px)</ActionButton>
        </ButtonRow>
      </SectionCard>

      <SectionCard
        title="ToolbarButton & ToolbarIconButton"
        subtitle="The dense pair for a page header. Height comes from the theme's MuiButton sizeSmall override, which is what keeps a mixed row of buttons and icon buttons aligned with no per-call sx."
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
          <ToolbarButton variant="contained" startIcon={<SaveRoundedIcon />}>Save</ToolbarButton>
          <ToolbarButton variant="outlined" startIcon={<DownloadRoundedIcon />}>Export</ToolbarButton>
          <ToolbarButton variant="outlined" color="error" startIcon={<DeleteOutlineRoundedIcon />} onClick={confirm.onOpen}>
            Delete
          </ToolbarButton>
          <ToolbarButton variant="outlined" loading>Saving</ToolbarButton>
          <ToolbarIconButton tooltip="Filter"><FilterListRoundedIcon /></ToolbarIconButton>
          <ToolbarIconButton tooltip="Refresh"><RefreshRoundedIcon /></ToolbarIconButton>
        </Stack>
      </SectionCard>

      <SectionCard
        title="MenuButton"
        subtitle="Menus are declared as data, not twenty lines of JSX. The menu closes before the action fires, so a dialog it opens is not racing the menu's own exit transition."
      >
        <ButtonRow gap={1.25}>
          <MenuButton
            label="Actions"
            icon={<FilterListRoundedIcon />}
            actions={[
              { id: 'export', label: 'Export as CSV', icon: <DownloadRoundedIcon fontSize="small" />, onSelect: () => {} },
              { id: 'save', label: 'Save a copy', icon: <SaveRoundedIcon fontSize="small" />, onSelect: () => {} },
              { id: 'delete', label: 'Delete pipeline', icon: <DeleteOutlineRoundedIcon fontSize="small" />, onSelect: confirm.onOpen, destructive: true, dividerBefore: true },
            ]}
          />
          <MenuButton
            icon={<MoreVertRoundedIcon />}
            tooltip="More actions"
            actions={[
              { id: 'rename', label: 'Rename', onSelect: () => {} },
              { id: 'duplicate', label: 'Duplicate', onSelect: () => {} },
              { id: 'archive', label: 'Archive', onSelect: () => {}, destructive: true, dividerBefore: true },
            ]}
          />
        </ButtonRow>
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="SegmentedControl" subtitle="Compact exclusive choice — lighter than tabs, denser than a Select.">
            <Stack spacing={2}>
              <SegmentedControl
                options={[
                  { value: 'compact' as const, label: 'Compact' },
                  { value: 'cosy' as const, label: 'Cosy' },
                  { value: 'roomy' as const, label: 'Roomy' },
                ]}
                value={density}
                onChange={setDensity}
                ariaLabel="Row density"
              />
              <Typography sx={captionMuted}>
                Selected: {density}. Re-clicking the active option is ignored, so the control can
                never end up with nothing selected.
              </Typography>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="SearchField" subtitle="Controlled. Debouncing belongs to the caller, which knows whether this hits an API.">
            <Stack spacing={2}>
              <SearchField value={query} onChange={setQuery} fullWidth placeholder="Type to see the clear button…" />
              <Typography sx={captionMuted}>Query: {query || '(empty)'}</Typography>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="StateBlock"
        subtitle="The three states a panel can be in. An empty result and a failed request must never look the same — so the error always shows its message, and the empty state says what is absent."
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ ...bodyMuted, mb: 1 }}>loading</Typography>
            <StateBlock loading />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ ...bodyMuted, mb: 1 }}>error</Typography>
            <StateBlock error="read-api unreachable on port 8787 (ECONNREFUSED)" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{ ...bodyMuted, mb: 1 }}>empty</Typography>
            <StateBlock empty emptyMessage="No runs recorded since the last deploy." />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Dialogs" subtitle="ConfirmDialog for destructive actions; FullScreenDialog for pickers that will not fit in a modal.">
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" size="small" color="error" onClick={confirm.onOpen}>
            Open ConfirmDialog
          </Button>
          <Button variant="outlined" size="small" onClick={fullScreen.onOpen}>
            Open FullScreenDialog
          </Button>
        </Stack>
      </SectionCard>

      <SectionCard title="EmptyState" subtitle="For a whole page or panel with no content at all.">
        <EmptyState
          title="No pipelines configured"
          description="A pipeline defines what gets ingested and on what schedule. Create one to start collecting."
          action={
            <Button variant="contained" size="small" startIcon={<AddRoundedIcon />}>
              Create pipeline
            </Button>
          }
        />
      </SectionCard>

      <ConfirmDialog
        open={confirm.open}
        onClose={confirm.onClose}
        onConfirm={runSave}
        loading={saving}
        title="Delete this pipeline?"
        confirmLabel="Delete"
        confirmColor="error"
        body="The pipeline and its 14 scheduled runs are removed. Ingested data is not affected. This cannot be undone."
      />

      <FullScreenDialog
        open={fullScreen.open}
        onClose={fullScreen.onClose}
        title="Pipeline detail"
        actions={
          <ToolbarButton variant="contained" onClick={fullScreen.onClose}>
            Done
          </ToolbarButton>
        }
      >
        <Stack sx={{ p: 3, gap: 2 }}>
          <Typography sx={bodyMuted}>
            The mobile answer to a picker or detail panel. On desktop it still goes full-screen, so
            reach for it only where that is what you want.
          </Typography>
          <KeyValueList
            entries={[
              { label: 'Pipeline', value: 'ingest-gateway' },
              { label: 'Schedule', value: '*/5 * * * *' },
              { label: 'Last run', value: '2026-09-11T09:05:00Z' },
              { label: 'Owner', value: 'platform' },
            ]}
          />
        </Stack>
      </FullScreenDialog>
    </PageContainer>
  );
}
