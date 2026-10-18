// "Trusted apps": apps that are in the real RBI directory AND well reviewed on the Google Play Store.
//
// Wording rule: this is a trust SIGNAL, not a guarantee. RBI listing means the lender is registered;
// the Play rating shows what users say. Neither proves an app is safe.

const MIN_RATINGS_WELL = 1000;
const MIN_RATINGS_HIGH = 10000;

const TIERS = {
  high: { en: 'Highly rated', hi: 'बहुत अच्छी रेटिंग' },
  well: { en: 'Well rated', hi: 'अच्छी रेटिंग' },
};

// info: { score: 4.3, ratings: 120000 } from the Play Store
function trustFor(info) {
  const rating = Number(info && info.score);
  const ratings = Number(info && info.ratings);
  if (!(rating > 0) || !(ratings > 0)) return null;

  // 70 points from the star rating, up to 30 from how many people rated (1 rating = 0, 1M = 30).
  const crowd = Math.min(30, (Math.log10(ratings) / 6) * 30);
  const trustScore = Math.round((rating / 5) * 70 + crowd);

  let tier = null;
  if (rating >= 4.2 && ratings >= MIN_RATINGS_HIGH) tier = 'high';
  else if (rating >= 3.8 && ratings >= MIN_RATINGS_WELL) tier = 'well';

  return { rating: Math.round(rating * 10) / 10, ratings, trustScore, tier };
}

// Keep only the entries that count as "trusted", best first.
function buildTrustedList(rows) {
  return rows
    .filter((r) => r && r.tier)
    .sort((a, b) => b.trustScore - a.trustScore || b.ratings - a.ratings);
}

// Fetches Play info for many apps, a few at a time. fetcher(packageId) -> { score, ratings, installs, title }
async function collectPlayInfo(entries, fetcher, { concurrency = 4, onProgress } = {}) {
  const rows = [];
  let next = 0;
  let done = 0;
  async function worker() {
    while (next < entries.length) {
      const e = entries[next++];
      try {
        const info = await fetcher(e.packageId);
        const t = trustFor(info);
        if (t) {
          rows.push({
            appName: e.appName,
            lender: e.lender,
            packageId: e.packageId,
            installs: (info && info.installs) || null,
            ...t,
            ...(e.grievance ? { grievance: e.grievance } : {}),
          });
        }
      } catch (err) {
        // app removed from Play or lookup failed: skip it
      }
      done++;
      if (onProgress) onProgress(done, entries.length);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return rows;
}

module.exports = { trustFor, buildTrustedList, collectPlayInfo, TIERS };
