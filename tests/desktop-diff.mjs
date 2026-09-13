/**
 * Compare two desktop screenshot sets and report any route that moved.
 *
 * Desktop layout is frozen, so a difference on a static page means a
 * responsive change leaked out of its breakpoint. Find the unscoped rule.
 *
 * Routes that animate on their own are expected to differ; they are reported
 * separately rather than failed, because a pixel diff cannot tell an animation
 * frame from a regression.
 *
 *   node tests/desktop-diff.mjs ./baseline ./after
 */
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const BEFORE = process.argv[2] ?? './baseline';
const AFTER = process.argv[3] ?? './after';

/**
 * Routes that legitimately differ between two runs, and why.
 *
 * A pixel diff cannot tell an animation frame or a moving clock from a layout
 * regression, so these are reported rather than failed. Everything else must
 * be byte-identical.
 */
const VOLATILE = {
  // Live simulated readings; every needle moves each second.
  sensors: 'live simulated data',
  // Shows absolute timestamps derived from relative demo data, so the rendered
  // text moves with the wall clock.
  tables: 'wall-clock derived timestamps',
  split: 'wall-clock derived timestamps',
};

/** Byte-identical is the strongest possible statement; hash rather than decode. */
function hash(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const files = readdirSync(BEFORE).filter((name) => name.endsWith('.png')).sort();
if (files.length === 0) {
  console.error(`No screenshots in ${BEFORE} — capture a baseline first.`);
  process.exit(1);
}

const changed = [];
const volatile = [];
const missing = [];

for (const file of files) {
  let afterHash;
  try {
    afterHash = hash(`${AFTER}/${file}`);
  } catch {
    missing.push(file);
    continue;
  }

  if (hash(`${BEFORE}/${file}`) === afterHash) continue;

  const route = file.replace(/^(dark|light)-/, '').replace(/\.png$/, '');
  if (route in VOLATILE) volatile.push(`${file} (${VOLATILE[route]})`);
  else changed.push(file);
}

if (missing.length > 0) {
  console.error(`Missing from ${AFTER}:`);
  for (const file of missing) console.error('  -', file);
}

if (volatile.length > 0) {
  console.log('Expected to differ:');
  for (const entry of volatile) console.log('  -', entry);
}

if (changed.length > 0 || missing.length > 0) {
  console.error(`\nDESKTOP CHANGED — ${changed.length} route(s):`);
  for (const file of changed) console.error('  -', file);
  console.error('\nDesktop layout is frozen. Scope the change to an xs/sm breakpoint.');
  process.exit(1);
}

console.log(`Desktop unchanged: ${files.length - volatile.length} screenshots byte-identical.`);
