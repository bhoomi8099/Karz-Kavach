import { useState, useEffect } from 'react';

// Format rating counts: 1,20,000 -> 1.2L, 1,500,000 -> 15L, 5000 -> 5K
function formatRatings(num) {
  if (!num || num < 0) return '0';
  const n = Number(num);
  if (n >= 10000000) {
    const cr = n / 10000000;
    return (cr % 1 === 0 ? cr : cr.toFixed(1)) + 'Cr';
  }
  if (n >= 100000) {
    const l = n / 100000;
    return (l % 1 === 0 ? l : l.toFixed(1)) + 'L';
  }
  if (n >= 1000) {
    const k = n / 1000;
    return (k % 1 === 0 ? k : k.toFixed(1)) + 'K';
  }
  return String(n);
}

// App icon with onError fallback
function AppIcon({ src, alt }) {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError) {
    return <div className="compare-app-icon-fallback" aria-hidden="true">📱</div>;
  }
  return (
    <img
      src={src}
      alt={alt || 'App icon'}
      className="compare-app-icon"
      onError={() => setHasError(true)}
    />
  );
}

export default function CompareApps({
  lang,
  t,
  initialApp1 = '',
  initialApp2 = '',
  onViewFullResult,
}) {
  const [app1Input, setApp1Input] = useState(initialApp1 || '');
  const [app2Input, setApp2Input] = useState(initialApp2 || '');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Sync if initialApp1 or initialApp2 changes from props
  useEffect(() => {
    if (initialApp1) {
      setApp1Input(initialApp1);
    }
    if (initialApp2) {
      setApp2Input(initialApp2);
    }
  }, [initialApp1, initialApp2]);

  // Fetch assessment helper for one input
  async function fetchAssessment(rawInput) {
    const q = String(rawInput || '').trim();
    if (!q) {
      return {
        success: false,
        query: '',
        error: { message: t.enterBothAppsPrompt },
      };
    }

    try {
      const res = await fetch(`/api/assess?input=${encodeURIComponent(q)}`);
      const data = await res.json().catch(() => null);

      if (res.ok && data && !data.error) {
        return { success: true, query: q, data };
      }

      // 404 or backend error
      const errorCode = data?.error;
      const errorMsg =
        (errorCode && t.assessErrors?.[errorCode]) ||
        data?.message ||
        t.notFound;

      return {
        success: false,
        query: q,
        error: { code: errorCode, message: errorMsg },
      };
    } catch {
      return {
        success: false,
        query: q,
        error: { message: t.serverError },
      };
    }
  }

  // Run comparison for two inputs in parallel via Promise.all
  async function runComparison(q1, q2) {
    const val1 = String(q1 || '').trim();
    const val2 = String(q2 || '').trim();

    if (!val1 && !val2) {
      setValidationError(t.enterBothAppsPrompt);
      return;
    }

    setValidationError('');
    setLoading(true);

    try {
      const [res1, res2] = await Promise.all([
        val1 ? fetchAssessment(val1) : Promise.resolve({ success: false, query: '', error: { message: t.enterBothAppsPrompt } }),
        val2 ? fetchAssessment(val2) : Promise.resolve({ success: false, query: '', error: { message: t.enterBothAppsPrompt } }),
      ]);

      setComparison({ app1: res1, app2: res2 });
    } catch {
      setComparison({
        app1: { success: false, query: val1, error: { message: t.serverError } },
        app2: { success: false, query: val2, error: { message: t.serverError } },
      });
    }

    setLoading(false);
  }

  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    runComparison(app1Input, app2Input);
  }

  function handleQuickTry(name1, name2) {
    setApp1Input(name1);
    setApp2Input(name2);
    runComparison(name1, name2);
  }

  // Shorthands
  const res1 = comparison?.app1;
  const res2 = comparison?.app2;
  const bothLoaded = comparison && (res1 || res2);
  const bothSuccess = res1?.success && res2?.success;

  // Extract scores for comparison if both succeeded
  const s1 = res1?.data?.score;
  const s2 = res2?.data?.score;

  // Helpers to determine which app has strictly fewer risk points in a given score metric
  const lowerTotal = bothSuccess && s1?.total != null && s2?.total != null
    ? (s1.total < s2.total ? 1 : s2.total < s1.total ? 2 : 0)
    : 0;

  const lowerPerm = bothSuccess && s1?.permission != null && s2?.permission != null
    ? (s1.permission < s2.permission ? 1 : s2.permission < s1.permission ? 2 : 0)
    : 0;

  const lowerReg = bothSuccess && s1?.registration != null && s2?.registration != null
    ? (s1.registration < s2.registration ? 1 : s2.registration < s1.registration ? 2 : 0)
    : 0;

  const lowerTrans = bothSuccess && s1?.transparency != null && s2?.transparency != null
    ? (s1.transparency < s2.transparency ? 1 : s2.transparency < s1.transparency ? 2 : 0)
    : 0;

  // Extract Grievance contacts for an app
  function getGrievanceInfo(data) {
    if (!data) return { primary: null, moreCount: 0 };
    const records = (data.directory?.records || []).filter(
      (r) => r.grievance && (r.grievance.name || r.grievance.email || r.grievance.phone || r.grievance.mobile)
    );
    if (records.length > 0) {
      return {
        primary: records[0].grievance,
        lender: records[0].lender || data.directory?.lender,
        moreCount: records.length - 1,
      };
    }
    if (data.directory?.grievance && (data.directory.grievance.name || data.directory.grievance.email || data.directory.grievance.phone || data.directory.grievance.mobile)) {
      return {
        primary: data.directory.grievance,
        lender: data.directory?.lender,
        moreCount: 0,
      };
    }
    return { primary: null, moreCount: 0 };
  }

  // Extract top 3 sorted signals
  function getTopSignals(data) {
    if (!data?.signals) return [];
    return [...data.signals]
      .sort((a, b) => {
        const rank = { warn: 0, info: 1, unknown: 2, ok: 3 };
        return (rank[a.status] ?? 4) - (rank[b.status] ?? 4);
      })
      .slice(0, 3);
  }

  // Map RBI directory status
  function getRbiStatus(data) {
    const match = data?.directory?.match || 'none';
    const text = t.rbiStatusMap[match] || t.rbiStatusMap.none;
    const type = match === 'id' ? 'ok' : match === 'name' ? 'info' : match === 'lookalike' ? 'warn' : 'unknown';
    const icon = match === 'id' ? '✔' : match === 'name' ? 'ℹ️' : match === 'lookalike' ? '⚠️' : '❓';
    return { text, type, icon, match };
  }

  // Render score bar inside compare column
  function renderScoreBar(label, value, max, isLower) {
    const pct = Math.min(100, Math.round(((value || 0) / (max || 40)) * 100));
    return (
      <div className="compare-bar-item">
        <div className="compare-bar-header">
          <span className="compare-bar-label">{label}</span>
          <div className="compare-bar-score-group">
            <span className="compare-bar-num">{value ?? 0} / {max}</span>
            {isLower && (
              <span className="compare-fewer-tag" title={t.fewerRiskPoints}>
                ↓ {t.fewerRiskPoints}
              </span>
            )}
          </div>
        </div>
        <div className="compare-bar-track">
          <div className="compare-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="view-container view-compare" key="compare">
      {/* Hero Header */}
      <div className="hero compare-hero">
        <span className="hero-tag">⚖️ {t.compareHeroTag}</span>
        <h1 className="hero-title">
          {t.compareTitle}
        </h1>
        <p className="hero-tagline">
          {t.compareSubtitle}
        </p>
      </div>

      {/* Two Search Boxes Form */}
      <section className="search-card compare-search-card">
        <form onSubmit={handleSubmit} className="compare-search-form">
          <div className="compare-inputs-grid">
            <div className="compare-input-group">
              <label className="compare-input-label" htmlFor="compare-app1-input">
                📱 {t.compareApp1Label}
              </label>
              <input
                id="compare-app1-input"
                className="compare-input"
                type="text"
                value={app1Input}
                onChange={(e) => setApp1Input(e.target.value)}
                placeholder={t.comparePlaceholder}
                aria-label={t.compareApp1Label}
              />
            </div>

            <div className="compare-input-group">
              <label className="compare-input-label" htmlFor="compare-app2-input">
                📱 {t.compareApp2Label}
              </label>
              <input
                id="compare-app2-input"
                className="compare-input"
                type="text"
                value={app2Input}
                onChange={(e) => setApp2Input(e.target.value)}
                placeholder={t.comparePlaceholder}
                aria-label={t.compareApp2Label}
              />
            </div>
          </div>

          {validationError && (
            <div className="compare-val-error">{validationError}</div>
          )}

          <div className="compare-actions-row">
            <button
              type="submit"
              className="search-btn compare-submit-btn"
              disabled={loading || (!app1Input.trim() && !app2Input.trim())}
            >
              <span>{loading ? t.comparing : `⚖️ ${t.compareBtn}`}</span>
              <span style={{ fontSize: 18 }}>→</span>
            </button>
          </div>
        </form>

        {/* Quick try chips */}
        <div className="try-chips-row">
          <span className="try-label">{t.tryLabel}</span>
          <div className="try-chips">
            <button
              type="button"
              className="suggestion-chip"
              onClick={() => handleQuickTry('Navi', 'Paytm')}
            >
              Navi vs Paytm
            </button>
            <button
              type="button"
              className="suggestion-chip"
              onClick={() => handleQuickTry('PhonePe', 'Paytm')}
            >
              PhonePe vs Paytm
            </button>
            <button
              type="button"
              className="suggestion-chip"
              onClick={() => handleQuickTry('Navi', 'Blink Credit')}
            >
              Navi vs Blink Credit
            </button>
          </div>
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div className="card assess-loading-card">
          <span className="assess-spinner">⏳</span>
          <span>{t.comparing}</span>
        </div>
      )}

      {/* Results View */}
      {!loading && bothLoaded && (
        <div className="compare-results-container">

          {/* Row Headers for Large Screens */}
          <div className="compare-table-root">

            {/* ── ROW 1: App Identity (Name, icon with onError, lender, developer) ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">1</span> {t.rowAppIdentity}
              </div>
              <div className="compare-grid-2col">
                {/* Column 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (
                    <div className="compare-identity-box">
                      <AppIcon src={res1.data.app?.icon} alt={res1.data.app?.title} />
                      <div className="compare-identity-details">
                        <h3 className="compare-app-name">{res1.data.app?.title || res1.data.app?.packageId}</h3>
                        <div className="compare-meta-line">
                          <strong>{t.lenderLabel}:</strong> {res1.data.directory?.lender || res1.data.directory?.records?.[0]?.lender || '—'}
                        </div>
                        <div className="compare-meta-line">
                          <strong>{t.developer}:</strong> {res1.data.app?.developer || '—'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="compare-col-error">
                      <span className="error-icon">🔍</span>
                      <div className="error-body">
                        <strong>{res1.query || t.compareApp1Label}</strong>
                        <p>{res1.error?.message || t.notFound}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (
                    <div className="compare-identity-box">
                      <AppIcon src={res2.data.app?.icon} alt={res2.data.app?.title} />
                      <div className="compare-identity-details">
                        <h3 className="compare-app-name">{res2.data.app?.title || res2.data.app?.packageId}</h3>
                        <div className="compare-meta-line">
                          <strong>{t.lenderLabel}:</strong> {res2.data.directory?.lender || res2.data.directory?.records?.[0]?.lender || '—'}
                        </div>
                        <div className="compare-meta-line">
                          <strong>{t.developer}:</strong> {res2.data.app?.developer || '—'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="compare-col-error">
                      <span className="error-icon">🔍</span>
                      <div className="error-body">
                        <strong>{res2.query || t.compareApp2Label}</strong>
                        <p>{res2.error?.message || t.notFound}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 2: Result Label & Total Risk Points ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">2</span> {t.rowAssessment}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (
                    <div className={`compare-verdict-box level-${res1.data.level}`}>
                      <div className="compare-verdict-header">
                        <span className="compare-verdict-icon">
                          {res1.data.level === 'proceed' ? '✅' : res1.data.level === 'pause' ? '⚠️' : '🛑'}
                        </span>
                        <div className="compare-verdict-text">
                          <span className="compare-verdict-label">
                            {res1.data.label?.[lang] || res1.data.label?.en}
                          </span>
                        </div>
                      </div>

                      <div className="compare-total-score-line">
                        <span className="compare-score-lead">{t.totalWarningScore}:</span>
                        <strong className="compare-score-big">{res1.data.score?.total ?? 0}</strong>
                        <span className="compare-score-max">/ 100</span>
                        {lowerTotal === 1 && (
                          <span className="compare-fewer-tag" title={t.fewerRiskPoints}>
                            ↓ {t.fewerRiskPoints}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (
                    <div className={`compare-verdict-box level-${res2.data.level}`}>
                      <div className="compare-verdict-header">
                        <span className="compare-verdict-icon">
                          {res2.data.level === 'proceed' ? '✅' : res2.data.level === 'pause' ? '⚠️' : '🛑'}
                        </span>
                        <div className="compare-verdict-text">
                          <span className="compare-verdict-label">
                            {res2.data.label?.[lang] || res2.data.label?.en}
                          </span>
                        </div>
                      </div>

                      <div className="compare-total-score-line">
                        <span className="compare-score-lead">{t.totalWarningScore}:</span>
                        <strong className="compare-score-big">{res2.data.score?.total ?? 0}</strong>
                        <span className="compare-score-max">/ 100</span>
                        {lowerTotal === 2 && (
                          <span className="compare-fewer-tag" title={t.fewerRiskPoints}>
                            ↓ {t.fewerRiskPoints}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 3: Three bars with scores (Permissions /40, RBI registration /40, Transparency & Fees /20) ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">3</span> {t.rowScoreBreakdown}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success && res1.data.score ? (
                    <div className="compare-bars-list">
                      {renderScoreBar(
                        t.permissionsScore,
                        res1.data.score.permission,
                        res1.data.score.max?.permission || 40,
                        lowerPerm === 1
                      )}
                      {renderScoreBar(
                        t.registrationScore,
                        res1.data.score.registration,
                        res1.data.score.max?.registration || 40,
                        lowerReg === 1
                      )}
                      {renderScoreBar(
                        t.transparencyScore,
                        res1.data.score.transparency,
                        res1.data.score.max?.transparency || 20,
                        lowerTrans === 1
                      )}
                    </div>
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success && res2.data.score ? (
                    <div className="compare-bars-list">
                      {renderScoreBar(
                        t.permissionsScore,
                        res2.data.score.permission,
                        res2.data.score.max?.permission || 40,
                        lowerPerm === 2
                      )}
                      {renderScoreBar(
                        t.registrationScore,
                        res2.data.score.registration,
                        res2.data.score.max?.registration || 40,
                        lowerReg === 2
                      )}
                      {renderScoreBar(
                        t.transparencyScore,
                        res2.data.score.transparency,
                        res2.data.score.max?.transparency || 20,
                        lowerTrans === 2
                      )}
                    </div>
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 4: RBI status line (listed by Play ID / name only / lookalike / not found) ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">4</span> {t.rowRbiStatus}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (() => {
                    const rbi = getRbiStatus(res1.data);
                    return (
                      <div className={`compare-status-badge status-${rbi.type}`}>
                        <span className="status-badge-icon">{rbi.icon}</span>
                        <div className="status-badge-text">
                          <strong className="status-badge-title">{rbi.text}</strong>
                          {res1.data.directory?.lender && (
                            <span className="status-badge-sub">
                              {t.lenderLabel}: {res1.data.directory.lender}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (() => {
                    const rbi = getRbiStatus(res2.data);
                    return (
                      <div className={`compare-status-badge status-${rbi.type}`}>
                        <span className="status-badge-icon">{rbi.icon}</span>
                        <div className="status-badge-text">
                          <strong className="status-badge-title">{rbi.text}</strong>
                          {res2.data.directory?.lender && (
                            <span className="status-badge-sub">
                              {t.lenderLabel}: {res2.data.directory.lender}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 5: Permissions the app declares (the existing permission names) ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">5</span> {t.rowPermissions}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (
                    (res1.data.permissionReport?.permissions && res1.data.permissionReport.permissions.length > 0) ? (
                      <div className="compare-perms-wrap">
                        {res1.data.permissionReport.permissions.map((p) => (
                          <span
                            key={p.permission}
                            className="compare-perm-pill"
                            title={p[lang] || p.en || p.permission}
                          >
                            <span className="perm-code-tag">{p.permission}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="compare-muted-text">{t.noDeclaredPermissions}</div>
                    )
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (
                    (res2.data.permissionReport?.permissions && res2.data.permissionReport.permissions.length > 0) ? (
                      <div className="compare-perms-wrap">
                        {res2.data.permissionReport.permissions.map((p) => (
                          <span
                            key={p.permission}
                            className="compare-perm-pill"
                            title={p[lang] || p.en || p.permission}
                          >
                            <span className="perm-code-tag">{p.permission}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="compare-muted-text">{t.noDeclaredPermissions}</div>
                    )
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 6: Rating and number of ratings ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">6</span> {t.rowRatings}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (
                    <div className="compare-ratings-box">
                      {res1.data.app?.rating != null ? (
                        <div className="compare-rating-val">
                          <span className="compare-star">★</span>
                          <span className="compare-rating-num">{Number(res1.data.app.rating).toFixed(1)}</span>
                          {res1.data.app.ratings != null && (
                            <span className="compare-rating-count">
                              ({formatRatings(res1.data.app.ratings)} {t.ratingsSuffix})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="compare-muted-text">—</span>
                      )}
                      {res1.data.app?.installs && (
                        <div className="compare-installs-line">
                          📥 {res1.data.app.installs} {lang === 'hi' ? 'डाउनलोड' : 'installs'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (
                    <div className="compare-ratings-box">
                      {res2.data.app?.rating != null ? (
                        <div className="compare-rating-val">
                          <span className="compare-star">★</span>
                          <span className="compare-rating-num">{Number(res2.data.app.rating).toFixed(1)}</span>
                          {res2.data.app.ratings != null && (
                            <span className="compare-rating-count">
                              ({formatRatings(res2.data.app.ratings)} {t.ratingsSuffix})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="compare-muted-text">—</span>
                      )}
                      {res2.data.app?.installs && (
                        <div className="compare-installs-line">
                          📥 {res2.data.app.installs} {lang === 'hi' ? 'डाउनलोड' : 'installs'}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 7: Top 3 signals, using the existing signal text ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">7</span> {t.rowSignals}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (() => {
                    const signals = getTopSignals(res1.data);
                    if (signals.length === 0) return <span className="compare-muted-text">—</span>;
                    return (
                      <ul className="compare-signals-list">
                        {signals.map((sig, idx) => (
                          <li key={sig.id || idx} className={`compare-signal-item status-${sig.status || 'info'}`}>
                            <span className="signal-badge-icon">
                              {sig.status === 'ok' ? '✔' : sig.status === 'warn' ? '⚠️' : sig.status === 'unknown' ? '❓' : 'ℹ️'}
                            </span>
                            <span className="signal-body-text">
                              {sig[lang] || sig.en}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  })() : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (() => {
                    const signals = getTopSignals(res2.data);
                    if (signals.length === 0) return <span className="compare-muted-text">—</span>;
                    return (
                      <ul className="compare-signals-list">
                        {signals.map((sig, idx) => (
                          <li key={sig.id || idx} className={`compare-signal-item status-${sig.status || 'info'}`}>
                            <span className="signal-badge-icon">
                              {sig.status === 'ok' ? '✔' : sig.status === 'warn' ? '⚠️' : sig.status === 'unknown' ? '❓' : 'ℹ️'}
                            </span>
                            <span className="signal-body-text">
                              {sig[lang] || sig.en}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  })() : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 8: Grievance contact (first one, plus "and N more" if there are others) ── */}
            <div className="compare-row-section">
              <div className="compare-row-title">
                <span className="compare-step-num">8</span> {t.rowGrievance}
              </div>
              <div className="compare-grid-2col">
                {/* Col 1 */}
                <div className="compare-cell-card">
                  {res1.success ? (() => {
                    const g = getGrievanceInfo(res1.data);
                    if (!g.primary) {
                      return <span className="compare-muted-text">{t.noGrievanceContact}</span>;
                    }
                    return (
                      <div className="compare-grievance-box">
                        <div className="compare-grievance-name">
                          👤 <strong>{g.primary.name || t.grievanceOfficer}</strong>
                        </div>
                        {g.primary.email && (
                          <div className="compare-grievance-item">
                            ✉️ <a href={`mailto:${g.primary.email}`}>{g.primary.email}</a>
                          </div>
                        )}
                        {(g.primary.phone || g.primary.mobile) && (
                          <div className="compare-grievance-item">
                            📞 <span>{g.primary.phone || g.primary.mobile}</span>
                          </div>
                        )}
                        {g.lender && (
                          <div className="compare-grievance-lender">
                            🏢 {g.lender}
                          </div>
                        )}
                        {g.moreCount > 0 && (
                          <div className="compare-more-contacts-tag">
                            +{t.andMoreContacts(g.moreCount)}
                          </div>
                        )}
                      </div>
                    );
                  })() : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>

                {/* Col 2 */}
                <div className="compare-cell-card">
                  {res2.success ? (() => {
                    const g = getGrievanceInfo(res2.data);
                    if (!g.primary) {
                      return <span className="compare-muted-text">{t.noGrievanceContact}</span>;
                    }
                    return (
                      <div className="compare-grievance-box">
                        <div className="compare-grievance-name">
                          👤 <strong>{g.primary.name || t.grievanceOfficer}</strong>
                        </div>
                        {g.primary.email && (
                          <div className="compare-grievance-item">
                            ✉️ <a href={`mailto:${g.primary.email}`}>{g.primary.email}</a>
                          </div>
                        )}
                        {(g.primary.phone || g.primary.mobile) && (
                          <div className="compare-grievance-item">
                            📞 <span>{g.primary.phone || g.primary.mobile}</span>
                          </div>
                        )}
                        {g.lender && (
                          <div className="compare-grievance-lender">
                            🏢 {g.lender}
                          </div>
                        )}
                        {g.moreCount > 0 && (
                          <div className="compare-more-contacts-tag">
                            +{t.andMoreContacts(g.moreCount)}
                          </div>
                        )}
                      </div>
                    );
                  })() : (
                    <div className="compare-cell-unavailable">—</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 9: Action button ("View full result") under each column ── */}
            <div className="compare-row-section compare-actions-section">
              <div className="compare-grid-2col">
                {/* Col 1 View full result */}
                <div className="compare-action-cell">
                  {res1.success ? (
                    <button
                      type="button"
                      className="compare-view-btn"
                      onClick={() => {
                        const target = res1.data.app?.packageId || res1.data.app?.title || res1.query;
                        if (onViewFullResult) onViewFullResult(target);
                      }}
                    >
                      <span>🔍 {t.viewFullResult}</span>
                      <span style={{ fontSize: 16 }}>→</span>
                    </button>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Col 2 View full result */}
                <div className="compare-action-cell">
                  {res2.success ? (
                    <button
                      type="button"
                      className="compare-view-btn"
                      onClick={() => {
                        const target = res2.data.app?.packageId || res2.data.app?.title || res2.query;
                        if (onViewFullResult) onViewFullResult(target);
                      }}
                    >
                      <span>🔍 {t.viewFullResult}</span>
                      <span style={{ fontSize: 16 }}>→</span>
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Under comparison note: exact wording in English & Hindi */}
          <div className="compare-disclaimer-card">
            <span className="disclaimer-icon">ℹ️</span>
            <p className="disclaimer-text">{t.compareNote}</p>
          </div>

        </div>
      )}
    </div>
  );
}
