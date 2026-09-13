/**
 * Living reference for the design tokens.
 *
 * Swatches render from the same exports components import, so this page cannot
 * drift from the theme — change a ramp in `themePrimitives.ts` and this page
 * shows the new value on the next reload.
 */
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageContainer, PageHeader } from '@kit/components/page';
import { SectionCard } from '@kit/components/cards';
import { KeyValueList } from '@kit/components/data';
import { amber, bodyMuted, brand, captionMuted, gray, green, monoFamily, red, statusColors } from '@kit/theme';
import { seriesColor } from '@kit/theme';

/** One colour chip with its shade number and value. */
function Swatch({ shade, value }: { shade: string; value: string }) {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 74 }}>
      <Box
        sx={{
          height: 44,
          borderRadius: 1,
          bgcolor: value,
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
      <Typography sx={{ ...captionMuted, ...monoFamily }}>{shade}</Typography>
    </Stack>
  );
}

/** A full ramp, rendered as a wrapping row of swatches. */
function Ramp({ name, ramp }: { name: string; ramp: Record<string, string> }) {
  return (
    <Box>
      <Typography sx={{ ...captionMuted, mb: 1, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {name}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {Object.entries(ramp).map(([shade, value]) => (
          <Swatch key={shade} shade={shade} value={value} />
        ))}
      </Stack>
    </Box>
  );
}

/** Typography variants, shown at their real sizes. */
const TYPE_SCALE = [
  { variant: 'h4' as const, note: 'Metric values' },
  { variant: 'h6' as const, note: 'Card and page titles' },
  { variant: 'subtitle2' as const, note: 'Card sub-labels' },
  { variant: 'body2' as const, note: 'Default body copy' },
  { variant: 'caption' as const, note: 'Timestamps, helper text' },
  { variant: 'overline' as const, note: 'Metric labels' },
];

export default function ThemePage() {
  return (
    <PageContainer
      header={
        <PageHeader
          title="Theme Tokens"
          subtitle="Everything here renders from the same exports components import. Retheming an app is a one-file edit to themePrimitives.ts — never a hex value in a component."
        />
      }
    >
      <SectionCard title="Colour ramps" subtitle="Brand first; the semantic ramps only define the shades actually referenced.">
        <Stack spacing={3}>
          <Ramp name="brand" ramp={brand} />
          <Ramp name="gray" ramp={gray} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Ramp name="green" ramp={green} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Ramp name="amber" ramp={amber} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Ramp name="red" ramp={red} />
            </Grid>
          </Grid>
        </Stack>
      </SectionCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title="Chart series ramp"
            subtitle="Ordered so adjacent series stay distinguishable in both schemes and for the common forms of colour blindness."
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Array.from({ length: 8 }, (_, index) => (
                <Swatch key={index} shade={`series[${index}]`} value={seriesColor(index)} />
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title="Flat status colours"
            subtitle="For SVG and canvas surfaces that cannot read a palette token."
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {Object.entries(statusColors).map(([name, value]) => (
                <Swatch key={name} shade={name} value={value} />
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard title="Type scale" subtitle="Inter throughout, JetBrains Mono for values and identifiers.">
        <Stack spacing={2}>
          {TYPE_SCALE.map((item) => (
            <Stack
              key={item.variant}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'baseline' }}
              spacing={2}
              sx={{ borderBottom: '1px dashed', borderColor: 'divider', pb: 1.5 }}
            >
              <Typography sx={{ ...captionMuted, ...monoFamily, minWidth: 90 }}>{item.variant}</Typography>
              <Typography variant={item.variant} sx={{ flex: 1 }}>
                The quick brown fox — 1,284,400
              </Typography>
              <Typography sx={captionMuted}>{item.note}</Typography>
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard title="Layout constants" subtitle="The numbers the shell derives every measurement from.">
        <KeyValueList
          entries={[
            { label: 'Sidebar width', value: '220px' },
            { label: 'Top bar height', value: '52px mobile / 56px desktop' },
            { label: 'Small control height', value: '30px' },
            { label: 'In-card tab height', value: '40px' },
            { label: 'Border radius', value: '8px' },
            { label: 'Page content max width', value: '1500px' },
            { label: 'Card gap', value: '2.5 spacing units (20px)' },
            { label: 'Shell gutter', value: '2 units mobile / 3 units desktop' },
          ]}
        />
      </SectionCard>

      <SectionCard title="sx tokens" subtitle="Import these instead of retyping the same flex or typography recipe.">
        <Typography sx={{ ...bodyMuted, mb: 2 }}>
          Rule of thumb: an sx fragment that appears in three or more files belongs in
          <Box component="code" sx={{ ...monoFamily, mx: 0.5 }}>theme/styleTokens.ts</Box>
          — unless it encodes a colour, in which case it belongs in
          <Box component="code" sx={{ ...monoFamily, mx: 0.5 }}>themePrimitives.ts</Box>.
        </Typography>

        <KeyValueList
          columns={2}
          entries={[
            { label: 'flexCenter', value: 'centre on both axes' },
            { label: 'flexRow', value: 'row, vertically centred' },
            { label: 'flexBetween', value: 'row, last child to the edge' },
            { label: 'flexColGap2', value: 'column with the standard gap' },
            { label: 'truncateFlex', value: 'flex child that truncates' },
            { label: 'ellipsis', value: 'single-line ellipsis' },
            { label: 'fillFlex', value: 'fills parent, allows inner scroll' },
            { label: 'captionMuted', value: 'labels and timestamps' },
            { label: 'bodyMuted', value: 'secondary body copy' },
            { label: 'sectionLabel', value: 'uppercase micro-label' },
            { label: 'mono / monoFamily', value: 'ids, prices, hashes' },
            { label: 'insetPanel', value: 'card inside a card' },
          ]}
        />
      </SectionCard>
    </PageContainer>
  );
}
