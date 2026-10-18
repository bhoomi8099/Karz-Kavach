// Turns a table copied from the RBI directory page (saved as CSV or tab-separated text)
// into the list we use for checking: [{ appName, lender }, ...]

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Reads CSV or tab-separated text. Handles quotes and line breaks inside quoted cells.
function parseTable(text) {
  const clean = String(text).replace(/^﻿/, '');
  const firstLine = clean.split(/\r?\n/)[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : ',';

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"' && field === '') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && clean[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}

const PLAY_LINK_RE = /play\.google\.com\/store\/apps\/details\?id=([A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)+)/;

// options: { appCol, lenderCol } (1-based column numbers) if the headers cannot be guessed.
function parseDirectory(text, options = {}) {
  const rows = parseTable(text);
  if (rows.length < 2) {
    throw new Error('The file needs a header row and at least one data row.');
  }

  // The real RBI sheet has a title and blank lines above the header row.
  // Use the first row (in the top 15) that has both a lender-like and an app-like heading.
  const LENDER_RE = /lender|entity|\bre\b|bank|nbfc/;
  const APP_RE = /app|dla/;
  let headerRow = 0;
  if (options.lenderCol == null || options.appCol == null) {
    const found = rows.slice(0, 15).findIndex((r) => {
      const cells = r.map((h) => h.trim().toLowerCase());
      const l = cells.findIndex((h) => LENDER_RE.test(h));
      return l >= 0 && cells.some((h, i) => i !== l && APP_RE.test(h));
    });
    if (found > 0) headerRow = found;
  }

  const headers = rows[headerRow].map((h) => h.replace(/\s+/g, ' ').trim());
  const lower = headers.map((h) => h.toLowerCase());

  let lenderCol =
    options.lenderCol != null
      ? options.lenderCol - 1
      : lower.findIndex((h) => LENDER_RE.test(h));
  let appCol =
    options.appCol != null
      ? options.appCol - 1
      : lower.findIndex((h, i) => i !== lenderCol && APP_RE.test(h));

  if (lenderCol < 0 || appCol < 0 || lenderCol === appCol) {
    throw new Error(
      `Could not tell which columns are the app name and the lender. Columns found: ${headers
        .map((h, i) => `${i + 1}="${h}"`)
        .join(', ')}. Run again with --app-col N --lender-col N.`
    );
  }

  // Grievance officer details (columns are optional; used to show "who to complain to").
  const findCol = (test) => lower.findIndex((h) => /grievance/.test(h) && test(h));
  const gName = findCol((h) => !/mail|tele|phone|mobile/.test(h));
  const gEmail = findCol((h) => /mail/.test(h));
  const gPhone = findCol((h) => /tele|phone/.test(h));
  const gMobile = findCol((h) => /mobile/.test(h));
  const cell = (row, i) => (i >= 0 ? String(row[i] || '').replace(/\s+/g, ' ').trim() : '');

  const entries = [];
  const seen = new Set();
  const byKey = new Map();
  let skipped = 0;
  let filledDown = 0;
  let lastLender = '';

  for (const row of rows.slice(headerRow + 1)) {
    let lender = (row[lenderCol] || '').trim();
    if (!lender && lastLender) {
      lender = lastLender; // merged cells in the source table: reuse the lender above
      filledDown++;
    }
    if (lender) lastLender = lender;

    const names = String(row[appCol] || '')
      .split(/[\n;|]+/)
      .map((n) => n.trim())
      .filter(Boolean);

    if (!lender || names.length === 0) {
      skipped++;
      continue;
    }
    // The Play Store link (if this row has one) gives the app's package id, used later
    // to read the permissions the Play Store lists for it.
    const link = row.join(' ').match(PLAY_LINK_RE);
    const packageId = link ? link[1] : undefined;

    const grievance = {};
    const gn = cell(row, gName), ge = cell(row, gEmail), gp = cell(row, gPhone), gm = cell(row, gMobile);
    if (gn) grievance.name = gn;
    if (ge) grievance.email = ge;
    if (gp) grievance.phone = gp;
    if (gm && gm !== gp) grievance.mobile = gm;
    const hasGrievance = Object.keys(grievance).length > 0;

    for (const appName of names) {
      const key = normalize(appName) + '|' + normalize(lender);
      if (seen.has(key)) {
        // The same app is listed once per store (Android, iOS, website). Keep the package id.
        const existing = byKey.get(key);
        if (packageId && !existing.packageId) existing.packageId = packageId;
        if (hasGrievance && !existing.grievance) existing.grievance = grievance;
        continue;
      }
      seen.add(key);
      const entry = { appName, lender };
      if (packageId && names.length === 1) entry.packageId = packageId;
      if (hasGrievance) entry.grievance = grievance;
      byKey.set(key, entry);
      entries.push(entry);
    }
  }

  return { entries, headers, appCol: appCol + 1, lenderCol: lenderCol + 1, skipped, filledDown };
}

module.exports = { parseTable, parseDirectory };
