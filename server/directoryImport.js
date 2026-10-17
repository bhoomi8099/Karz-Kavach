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

  const entries = [];
  const seen = new Set();
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
    for (const appName of names) {
      const key = normalize(appName) + '|' + normalize(lender);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ appName, lender });
    }
  }

  return { entries, headers, appCol: appCol + 1, lenderCol: lenderCol + 1, skipped, filledDown };
}

module.exports = { parseTable, parseDirectory };
