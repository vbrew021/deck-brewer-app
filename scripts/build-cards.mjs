// Builds data/cards.json for Deck Brews from TCGdex (https://tcgdex.dev), a free, open-source card database.
// Run by the "Update card data" GitHub Action every week, or by hand with: node scripts/build-cards.mjs
//
// What it does:
//   1. Reads TCGdex's open set data (from its GitHub repo) to get each set's id and its
//      Pokémon TCG Live / Limitless code (TWM, SVI, MEG...).
//   2. Downloads every card from the Scarlet & Violet and Mega Evolution eras (all of Standard),
//      plus older sets if INCLUDE_EXPANDED=true.
//   3. Writes data/cards.json. If TCGdex returns far fewer cards than last time, it stops
//      without overwriting, so a TCGdex outage can't wipe out the saved copy.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const GQL = process.env.TCGDEX_GQL || 'https://api.tcgdex.net/v2/graphql';
const OUT = process.env.OUT_FILE || 'data/cards.json';
const INCLUDE_EXPANDED = /^(1|true|yes)$/i.test(process.env.INCLUDE_EXPANDED || '');
const SERIES = ['Scarlet & Violet', 'Mega Evolution', ...(INCLUDE_EXPANDED ? ['Sword & Shield', 'Sun & Moon', 'XY', 'Black & White'] : [])];
// Codes Pokémon TCG Live / Limitless use for promo sets.
const PROMO_ALIASES = { 'PR-SV': 'svp', 'PR-SW': 'swshp', 'PR-SM': 'smp', 'PR-ME': 'mep', 'PR-XY': 'xyp', 'PR-BLW': 'bwp' };

const FIELDS = `id localId name image category hp types evolveFrom stage suffix trainerType energyType effect regulationMark rarity illustrator retreat
  legal { standard expanded } abilities { name effect } attacks { name cost damage effect } set { id name releaseDate }`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gql(query, variables, tries = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(GQL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
      const d = await res.json();
      if (!res.ok || d.errors?.length) throw new Error(`TCGdex error ${res.status}: ${JSON.stringify(d.errors || d).slice(0, 200)}`);
      return d.data;
    } catch (e) {
      if (i >= tries) throw e;
      console.warn(`  retrying (${e.message})`);
      await sleep(2000 * i);
    }
  }
}

// 1. Set ids and codes from TCGdex's open data.
function loadSets() {
  let dir = process.env.CARDS_DB_DIR;
  if (!dir) {
    dir = join(tmpdir(), 'tcgdex-cards-database');
    if (!existsSync(dir)) {
      console.log('Downloading TCGdex set data…');
      execSync(`git clone --depth 1 --filter=blob:none --sparse https://github.com/tcgdex/cards-database.git "${dir}"`, { stdio: 'inherit' });
      execSync(`git -C "${dir}" sparse-checkout set --no-cone "data/*.ts" "data/*/*.ts"`, { stdio: 'inherit' });
    }
  }
  const setCodes = {}, sets = [];
  for (const serie of readdirSync(join(dir, 'data'), { withFileTypes: true }).filter((d) => d.isDirectory())) {
    for (const file of readdirSync(join(dir, 'data', serie.name)).filter((f) => f.endsWith('.ts'))) {
      const src = readFileSync(join(dir, 'data', serie.name, file), 'utf8');
      const id = src.match(/^\s*id:\s*['"]([^'"]+)/m)?.[1];
      if (!id) continue;
      const codes = new Set();
      const tcgOnline = src.match(/tcgOnline:\s*['"]([^'"]+)/)?.[1];
      const official = src.match(/abbreviations:\s*{[^}]*official:\s*['"]([^'"]+)/s)?.[1];
      if (tcgOnline) codes.add(tcgOnline.toUpperCase());
      if (official) codes.add(official.toUpperCase());
      for (const c of codes) (setCodes[c] ||= []).includes(id) || setCodes[c].push(id);
      if (SERIES.includes(serie.name)) sets.push(id);
    }
  }
  for (const [alias, id] of Object.entries(PROMO_ALIASES)) {
    if (Object.values(setCodes).some((ids) => ids.includes(id))) (setCodes[alias] ||= []).includes(id) || setCodes[alias].push(id);
  }
  for (const k of Object.keys(setCodes)) setCodes[k].sort();
  return { setCodes, sets: [...new Set(sets)] };
}

// Drop empty values to keep the file small.
function compact(v) {
  if (Array.isArray(v)) { const a = v.map(compact).filter((x) => x !== undefined); return a.length ? a : undefined; }
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) { const c = compact(x); if (c !== undefined) o[k] = c; }
    return Object.keys(o).length ? o : undefined;
  }
  return v === null || v === '' ? undefined : v;
}

async function main() {
  const { setCodes, sets } = loadSets();
  console.log(`${Object.keys(setCodes).length} set codes; fetching cards from ${sets.length} sets (${SERIES.join(', ')})`);

  const cards = [], setInfo = {};
  for (const sid of sets) {
    let got = 0;
    for (let page = 1; ; page++) {
      const d = await gql(`query($f: CardsFilters, $p: Pagination) { cards(filters: $f, pagination: $p) { ${FIELDS} } }`,
        { f: { id: `${sid}-` }, p: { page, itemsPerPage: 250 } });
      const batch = (d.cards || []).filter((c) => c && c.set?.id === sid);
      for (const c of batch) {
        setInfo[sid] = { name: c.set.name, releaseDate: c.set.releaseDate || '' };
        cards.push(compact({ ...c, set: sid }));
      }
      got += batch.length;
      if ((d.cards || []).length < 250) break;
      await sleep(300);
    }
    console.log(`  ${sid}: ${got} cards`);
    await sleep(200);
  }

  // Safety check: don't replace a good file with a much smaller one.
  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, 'utf8'));
      if (prev.cards?.length && cards.length < prev.cards.length * 0.8) {
        throw new Error(`Only ${cards.length} cards downloaded (last time: ${prev.cards.length}). Keeping the existing file.`);
      }
    } catch (e) { if (/Keeping the existing file/.test(e.message)) throw e; }
  }
  if (cards.length < 100) throw new Error(`Only ${cards.length} cards downloaded. Keeping the existing file.`);

  cards.sort((a, b) => (setInfo[a.set]?.releaseDate || '').localeCompare(setInfo[b.set]?.releaseDate || '') || a.id.localeCompare(b.id, 'en', { numeric: true }));
  // One card per line keeps weekly changes easy to read in GitHub's history.
  const header = { version: 1, source: 'TCGdex (https://tcgdex.dev)', updated: new Date().toISOString().slice(0, 10), series: SERIES, setCodes, sets: setInfo };
  const body = JSON.stringify(header).slice(0, -1) + ',"cards":[\n' + cards.map((c) => JSON.stringify(c)).join(',\n') + '\n]}\n';
  mkdirSync(OUT.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(OUT, body);
  console.log(`Wrote ${OUT}: ${cards.length} cards, ${(body.length / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
