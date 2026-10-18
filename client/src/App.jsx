import { useEffect, useState } from 'react';
import './App.css';

// ── All screen text in English and Hindi ──────────────────────────────────────
const UI = {
  en: {
    title: 'Karz Kavach',
    titleHi: 'कर्ज़ कवच',
    tagline: 'Check the app before it checks you.',
    taglineHi: 'ऐप डाउनलोड करने से पहले जांचें',
    demoBanner: 'Demo Data • Every app here is a fictional example for this prototype.',
    placeholder: 'Type an app name, e.g. Rupee112, 4Fin, SureLoan Demo',
    check: 'Check app • ऐप की जांच करें',
    checking: 'Checking…',
    score: 'Risk score',
    scoreLabel: 'Total Threat Assessment',
    breakdown: 'Score Breakdown',
    permission: 'Permissions',
    registration: 'RBI Registration',
    transparency: 'Transparency & Fees',
    findings: 'What we found',
    findingsHi: 'जांच में क्या मिला',
    canDo: 'What this app can do to you',
    canDoHi: 'यह ऐप आपके साथ क्या कर सकता है',
    noPerms: 'No sensitive permissions requested.',
    nextSteps: 'What to do next',
    nextStepsHi: 'अब क्या करें',
    listen: 'Listen / सुनें',
    notFound: 'We could not find this app. Try one of these:',
    serverError: 'Could not reach the server. Is it running on port 5000?',
    claims: 'Claims to work with',
    developer: 'Developer',
    footer: 'Karz Kavach | Team Moon3 | Hack@BVP 8.0',
    quickSuggest: 'Quick Suggestions / लोकप्रिय खोजें',
    searchLabel: 'Search Loan App Name',
    matchedEntry: 'Matched directory entry',
    matchedEntryHi: 'डायरेक्टरी में नाम',
    listedUnder: 'Listed under',
    listedUnderHi: 'लेंडर का नाम',
    didYouMean: 'Did you mean:',
    didYouMeanHi: 'क्या आपका मतलब यह था:',
    dirNote: 'Permission details are not available for this app (the directory has no Play Store link for it, or the Play Store could not be reached).',
    dirNoteHi: 'इस ऐप की परमिशन की जानकारी उपलब्ध नहीं है (डायरेक्टरी में इसका Play Store लिंक नहीं है, या Play Store से जानकारी नहीं मिली)।',
    permExposureTitle: 'Permission exposure (from the Google Play listing)',
    permExposureTitleHi: 'परमिशन एक्सपोज़र (Google Play लिस्टिंग से)',
    noPlayPerms: 'No sensitive permissions declared on the Play Store listing.',
    grievanceTitle: 'Who to complain to (Grievance Redressal Officer)',
    grievanceTitleHi: 'शिकायत किससे करें (शिकायत निवारण अधिकारी)',
    grievanceOfficer: 'Officer',
    grievanceEmail: 'Email',
    grievancePhone: 'Phone',
    grievanceMobile: 'Mobile',
    grievanceNote: 'Contact details are published by the lender in the RBI directory.',
    grievanceNoteHi: 'संपर्क विवरण लेंडर द्वारा RBI डायरेक्टरी में प्रकाशित किए गए हैं।',
    verdictLabel: {
      safe: 'LOOKS SAFE',
      review: 'NEEDS A CLOSER LOOK',
      risky: 'RISKY — DO NOT INSTALL',
      listed: 'LISTED IN DIRECTORY',
      unverified: 'NOT FOUND IN DIRECTORY',
    },
    riskLabel: {
      safe: 'Very Low Risk',
      review: 'Moderate Risk',
      risky: 'Maximum Danger',
    },
    heroTag: 'Citizen Protection Engine',
  },
  hi: {
    title: 'कर्ज़ कवच',
    titleHi: 'Karz Kavach',
    tagline: 'ऐप आपको जाँचे, उससे पहले आप ऐप को जाँचें।',
    taglineHi: 'Check the app before it checks you',
    demoBanner: 'डेमो डेटा • यहाँ के सभी ऐप इस प्रोटोटाइप के लिए काल्पनिक उदाहरण हैं।',
    placeholder: 'ऐप का नाम लिखें, जैसे Rupee112, 4Fin, QuickRupee Demo',
    check: 'ऐप जाँचें • Check App',
    checking: 'जाँच हो रही है…',
    score: 'जोखिम स्कोर',
    scoreLabel: 'कुल खतरे का आकलन',
    breakdown: 'स्कोर कैसे बना',
    permission: 'परमिशन',
    registration: 'RBI रजिस्ट्रेशन',
    transparency: 'पारदर्शिता और शुल्क',
    findings: 'हमें क्या मिला',
    findingsHi: 'What we found',
    canDo: 'यह ऐप आपके साथ क्या कर सकता है',
    canDoHi: 'What this app can do to you',
    noPerms: 'कोई संवेदनशील परमिशन नहीं मांगी गई।',
    nextSteps: 'आगे क्या करें',
    nextStepsHi: 'What to do next',
    listen: 'सुनें (Listen)',
    notFound: 'यह ऐप नहीं मिला। इनमें से कोई आज़माएं:',
    serverError: 'सर्वर से संपर्क नहीं हो सका। क्या वह पोर्ट 5000 पर चल रहा है?',
    claims: 'दावा करता है कि इसके साथ काम करता है',
    developer: 'डेवलपर',
    footer: 'कर्ज़ कवच | Team Moon3 | Hack@BVP 8.0',
    quickSuggest: 'लोकप्रिय खोजें / Quick Suggestions',
    searchLabel: 'लोन ऐप का नाम खोजें',
    matchedEntry: 'डायरेक्टरी में नाम',
    matchedEntryHi: 'Matched directory entry',
    listedUnder: 'लेंडर का नाम',
    listedUnderHi: 'Listed under',
    didYouMean: 'क्या आपका मतलब यह था:',
    didYouMeanHi: 'Did you mean:',
    dirNote: 'इस ऐप की परमिशन की जानकारी उपलब्ध नहीं है (डायरेक्टरी में इसका Play Store लिंक नहीं है, या Play Store से जानकारी नहीं मिली)।',
    dirNoteHi: 'Permission details are not available for this app (the directory has no Play Store link for it, or the Play Store could not be reached).',
    permExposureTitle: 'परमिशन एक्सपोज़र (Google Play लिस्टिंग से)',
    permExposureTitleHi: 'Permission exposure (from the Google Play listing)',
    noPlayPerms: 'Play Store लिस्टिंग पर कोई संवेदनशील परमिशन घोषित नहीं है।',
    grievanceTitle: 'शिकायत किससे करें (शिकायत निवारण अधिकारी)',
    grievanceTitleHi: 'Who to complain to (Grievance Redressal Officer)',
    grievanceOfficer: 'अधिकारी',
    grievanceEmail: 'ईमेल',
    grievancePhone: 'फ़ोन',
    grievanceMobile: 'मोबाइल',
    grievanceNote: 'संपर्क विवरण लेंडर द्वारा RBI डायरेक्टरी में प्रकाशित किए गए हैं।',
    grievanceNoteHi: 'Contact details are published by the lender in the RBI directory.',
    verdictLabel: {
      safe: 'सुरक्षित ऐप',
      review: 'सावधानी बरतें',
      risky: 'खतरनाक — इंस्टॉल न करें',
      listed: 'डायरेक्टरी में सूचीबद्ध',
      unverified: 'डायरेक्टरी में नहीं मिला',
    },
    riskLabel: {
      safe: 'अत्यधिक सुरक्षित',
      review: 'मध्यम जोखिम',
      risky: 'अत्यंत खतरनाक',
    },
    heroTag: 'नागरिक सुरक्षा इंजन',
  },
};

const FLAG_ICONS = { good: '✔', warn: '!', bad: '✖' };
const VERDICT_ICONS = { safe: '🛡️', review: '⚠️', risky: '⛔', listed: '📋', unverified: 'ℹ️' };

// Maps verdict string → severity key for styling
function verdictClass(verdict) {
  const v = (verdict || '').toLowerCase();
  if (v === 'safe')       return 'safe';
  if (v === 'review')     return 'review';
  if (v === 'risky')      return 'risky';
  if (v === 'listed')     return 'listed';
  if (v === 'unverified') return 'unverified';
  return 'unverified';
}

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  window.speechSynthesis.speak(u);
}

// ── SVG Gauge Ring ─────────────────────────────────────────────────────────────
function GaugeRing({ score, max = 100 }) {
  const R = 50;
  const circ = 2 * Math.PI * R;
  const pct = Math.min(score / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div className="gauge-ring">
      <svg viewBox="0 0 120 120">
        <circle className="gauge-ring-track" cx="60" cy="60" r={R} fill="transparent" strokeWidth="10" />
        <circle
          className="gauge-ring-fill"
          cx="60" cy="60" r={R}
          fill="transparent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-inner">
        <span className="gauge-score">{String(score).padStart(2, '0')}</span>
        <span className="gauge-max">/ {max}</span>
        <span className="gauge-risk-label" style={{ marginTop: 2 }} />
      </div>
    </div>
  );
}

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max, level }) {
  const maxVal = max || 40;
  const pct = Math.min(100, Math.round(((value || 0) / maxVal) * 100));
  const lvlClass = level ? `bar-${String(level).toLowerCase()}` : '';
  return (
    <div className={`bar-row ${lvlClass}`.trim()}>
      <div className="bar-header">
        <span className="bar-label">{label}</span>
        <span className="bar-score">{value} / {maxVal}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Full result (SAFE / REVIEW / RISKY) for Demo Apps ──────────────────────────
function FullResult({ r, lang, t }) {
  const vClass = verdictClass(r.verdict);

  // Verdict hero label from our own UI dict
  const heroLabel = t.verdictLabel[vClass] || (r.verdictLabel && r.verdictLabel[lang]) || r.verdict;
  const riskText  = t.riskLabel[vClass] || '';

  const speechText = [
    r.verdictLabel?.[lang] || heroLabel,
    ...(r.flags || []).filter(f => f.severity !== 'good').map(f => f[lang]),
  ].join('. ');

  return (
    <div className="result-card">
      {/* App identity */}
      <div className="app-summary-card">
        <div className="app-info">
          <div className="app-name">{r.app?.name || r.name}</div>
          {r.app?.developer && <div className="app-meta">{t.developer}: {r.app.developer}</div>}
          {r.app?.claimedLender && (
            <div className="app-meta">{t.claims}: {r.app.claimedLender}</div>
          )}
        </div>
        <span className={`verdict-badge ${vClass}`}>
          {VERDICT_ICONS[vClass]} {heroLabel}
        </span>
      </div>

      {/* Verdict hero banner */}
      <div className={`verdict-hero ${vClass}`}>
        <div className="vh-icon-wrap">{VERDICT_ICONS[vClass]}</div>
        <div className="vh-content">
          <div className="vh-title">{heroLabel}</div>
          <div className="vh-subtitle">{riskText}</div>
        </div>
      </div>

      {/* Gauge + breakdown */}
      {r.score && (
        <div className={`gauge-card ${vClass}`}>
          <div className="gauge-header">
            <div className="gauge-header-group">
              <span className="gauge-header-label">{t.scoreLabel}</span>
              <span className="gauge-header-title">{r.score.total} / 100 {t.score}</span>
            </div>
            <span className="severity-pill">{riskText}</span>
          </div>

          <div className="gauge-body">
            <GaugeRing score={r.score.total} max={100} />
            <div className="gauge-text">
              <div className="gauge-text-title">{heroLabel}</div>
              <div className="gauge-text-sub">{riskText}</div>
              <button className="listen-btn" onClick={() => speak(speechText, lang)} type="button">
                🔊 {t.listen}
              </button>
            </div>
          </div>

          {/* Score bars */}
          <div className="bars-section">
            <ScoreBar label={t.permission}     value={r.score.permission}     max={r.score.max?.permission || 40} />
            <ScoreBar label={t.registration}   value={r.score.registration}   max={r.score.max?.registration || 40} />
            <ScoreBar label={t.transparency}   value={r.score.transparency}   max={r.score.max?.transparency || 20} />
          </div>
        </div>
      )}

      {/* What we found */}
      {r.flags && r.flags.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            🔍 {t.findings}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.findingsHi})
            </span>
          </div>
          <ul className="flags">
            {r.flags.map((f, i) => (
              <li key={f.code || i} className={`flag-item ${f.severity}`}>
                <span className="flag-icon-wrap">{FLAG_ICONS[f.severity] || '•'}</span>
                <span className="flag-text">{f[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Permissions */}
      {r.permissions && (
        <div className="section-card">
          <div className="section-title">
            🔒 {t.canDo}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.canDoHi})
            </span>
          </div>
          {r.permissions.length === 0 ? (
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t.noPerms}</p>
          ) : (
            <ul className="perms">
              {r.permissions.map(p => (
                <li key={p.permission} className="perm-item">
                  <span className="perm-code">{p.permission}</span>
                  <span>{p[lang]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Next steps */}
      {r.nextSteps?.[lang] && (
        <div className="section-card">
          <div className="section-title">
            ⚡ {t.nextSteps}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.nextStepsHi})
            </span>
          </div>
          <ol className="steps">
            {r.nextSteps[lang].map((s, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ── Directory-only result (LISTED / UNVERIFIED) ────────────────────────────────
function cleanSpeech(text) {
  if (!text) return '';
  return text
    .replace(/We did not check this app's permissions\.?/gi, '')
    .replace(/Permissions were not checked for this app \(directory lookup only\)\.?/gi, '')
    .replace(/permissions were not checked\.?/gi, '')
    .replace(/हमने इस ऐप की परमिशन की जाँच नहीं की।?/g, '')
    .replace(/इस ऐप की परमिशन की जाँच नहीं की गई है \(केवल डायरेक्टरी लुकअप\)।?/g, '')
    .trim();
}

function DirResult({ r, lang, t, onSearch }) {
  const isListed = r.verdict === 'LISTED';
  const vClass = isListed ? 'listed' : 'unverified';
  const verdictText = r.verdictLabel?.[lang] || (isListed ? t.verdictLabel.listed : t.verdictLabel.unverified);

  const speechText = [
    verdictText,
    ...(r.matches || []).map(m => `${m.appName}. ${m.lender}`),
    ...(r.flags || []).map(f => cleanSpeech(f[lang])),
    ...(r.permissionReport?.available
      ? [
          r.permissionReport.levelLabel?.[lang] || r.permissionReport.levelLabel?.en,
          ...(r.permissionReport.permissions || []).map(p => p[lang] || p.en),
          r.permissionReport.note?.[lang] || r.permissionReport.note?.en,
        ]
      : []),
    ...(r.nextSteps?.[lang] || []),
  ].map(cleanSpeech).filter(Boolean).join('. ');

  return (
    <div className={`dir-result-card ${vClass}`}>
      {/* App identity header */}
      <div className="app-summary-card">
        <div className="app-info">
          <div className="app-name">{r.query}</div>
          <div className="dir-lookup-tag">📋 {lang === 'hi' ? 'डायरेक्टरी लुकअप' : 'Directory Lookup'}</div>
        </div>
        <span className={`verdict-badge ${vClass}`}>
          {isListed ? '📋' : 'ℹ️'} {verdictText}
        </span>
      </div>

      {/* Verdict hero banner */}
      <div className={`verdict-hero ${vClass}`}>
        <div className="vh-icon-wrap">{isListed ? '📋' : 'ℹ️'}</div>
        <div className="vh-content" style={{ flex: 1 }}>
          <div className="vh-title">{verdictText}</div>
        </div>
        <button
          className="listen-btn dir-listen-btn"
          onClick={() => speak(speechText, lang)}
          title={t.listen}
          type="button"
        >
          🔊 {t.listen}
        </button>
      </div>

      {/* Matches (when app is listed) */}
      {r.matches && r.matches.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            📋 {lang === 'hi' ? 'डायरेक्टरी मिलान' : 'Matched RBI Directory Records'}
          </div>
          <div className="dir-matches">
            {r.matches.map((m, i) => (
              <div key={i} className="dir-match-item">
                <div className="dir-match-field">
                  <span className="dir-match-label">{lang === 'hi' ? t.matchedEntryHi : t.matchedEntry}:</span>
                  <span className="dir-match-val">{m.appName}</span>
                </div>
                <div className="dir-match-field">
                  <span className="dir-match-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>
                  <span className="dir-match-lender">{m.lender}</span>
                </div>
                {m.grievance && (m.grievance.name || m.grievance.email || m.grievance.phone || m.grievance.mobile) && (
                  <div className="dir-grievance-box">
                    <div className="dir-grievance-title">
                      🛡️ {t.grievanceTitle}
                      <span className="dir-grievance-title-sub">({t.grievanceTitleHi})</span>
                    </div>
                    <div className="dir-grievance-content">
                      {m.grievance.name && (
                        <div className="dir-grievance-row">
                          <span className="dir-grievance-label">{t.grievanceOfficer}:</span>
                          <span className="dir-grievance-val">{m.grievance.name}</span>
                        </div>
                      )}
                      {m.grievance.email && (
                        <div className="dir-grievance-row">
                          <span className="dir-grievance-label">{t.grievanceEmail}:</span>
                          <a className="dir-grievance-link" href={`mailto:${m.grievance.email}`}>
                            {m.grievance.email}
                          </a>
                        </div>
                      )}
                      {m.grievance.phone && (
                        <div className="dir-grievance-row">
                          <span className="dir-grievance-label">{t.grievancePhone}:</span>
                          <a className="dir-grievance-link" href={`tel:${String(m.grievance.phone).replace(/\s+/g, '')}`}>
                            {m.grievance.phone}
                          </a>
                        </div>
                      )}
                      {m.grievance.mobile && (
                        <div className="dir-grievance-row">
                          <span className="dir-grievance-label">{t.grievanceMobile}:</span>
                          <a className="dir-grievance-link" href={`tel:${String(m.grievance.mobile).replace(/\s+/g, '')}`}>
                            {m.grievance.mobile}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="dir-grievance-note">
                      ℹ️ {t.grievanceNote}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      {r.flags && r.flags.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            🔍 {t.findings}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.findingsHi})
            </span>
          </div>
          <ul className="flags">
            {r.flags.map((f, i) => (
              <li key={f.code || i} className={`flag-item ${f.severity || 'warn'}`}>
                <span className="flag-icon-wrap">
                  {f.severity === 'good' ? '✔' : '!'}
                </span>
                <span className="flag-text">{f[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Permission exposure (from the Google Play listing) */}
      {r.permissionReport && r.permissionReport.available && (
        <div className="section-card">
          <div className="section-title">
            🔒 {t.permExposureTitle}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.permExposureTitleHi})
            </span>
          </div>

          <ScoreBar
            label={r.permissionReport.levelLabel?.[lang] || r.permissionReport.levelLabel?.en || r.permissionReport.level}
            value={r.permissionReport.score ?? 0}
            max={r.permissionReport.max || 40}
            level={r.permissionReport.level}
          />

          {(!r.permissionReport.permissions || r.permissionReport.permissions.length === 0) ? (
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t.noPlayPerms}</p>
          ) : (
            <ul className="perms">
              {r.permissionReport.permissions.map(p => (
                <li key={p.permission} className="perm-item">
                  <span className="perm-code">{p.permission}</span>
                  <span>{p[lang] || p.en || p.permission}</span>
                </li>
              ))}
            </ul>
          )}

          {r.permissionReport.note && (
            <p className="perm-report-note">
              {r.permissionReport.note[lang] || r.permissionReport.note.en || (typeof r.permissionReport.note === 'string' ? r.permissionReport.note : '')}
            </p>
          )}
        </div>
      )}

      {/* "Did you mean" suggestion chips */}
      {r.similar && r.similar.length > 0 && (
        <div className="section-card">
          <div className="section-title" style={{ fontSize: 16 }}>
            💡 {lang === 'hi' ? t.didYouMeanHi : t.didYouMean}
          </div>
          <div className="chips">
            {r.similar.map((simName) => (
              <button
                key={simName}
                type="button"
                className="chip dir-chip"
                onClick={() => onSearch(simName)}
              >
                {simName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Next steps */}
      {r.nextSteps && r.nextSteps[lang] && (
        <div className="section-card">
          <div className="section-title">
            ⚡ {t.nextSteps}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.nextStepsHi})
            </span>
          </div>
          <ol className="steps">
            {r.nextSteps[lang].map((s, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Informational small note (shown ONLY when permission report is missing or not available) */}
      {(!r.permissionReport || !r.permissionReport.available) && (
        <div className="dir-note-box">
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <span>{t.dirNote}</span>
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]         = useState('en');
  const [name, setName]         = useState('');
  const [apps, setApps]         = useState([]);
  const [stats, setStats]       = useState(null);
  const [result, setResult]     = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const t = UI[lang];

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(setApps)
      .catch(() => {});

    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  async function runCheck(appName) {
    const query = String(appName || '').trim();
    if (!query) return;
    setLoading(true);
    setError('');
    setResult(null);
    setNotFound(null);
    try {
      const res  = await fetch(`/api/check?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.status === 200) {
        setResult(data);
      } else if (res.status === 404) {
        setNotFound(data.suggestions || []);
      } else {
        setError(data.error || t.serverError);
      }
    } catch {
      setError(t.serverError);
    }
    setLoading(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (name.trim()) runCheck(name);
  }

  // Decide which result component to show
  // Shape A has result.score; Shape B has result.mode === 'directory_only'
  const isDirectory = result && (result.mode === 'directory_only' || !result.score);

  return (
    <div className="page">
      {/* ── Sticky header ── */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-group">
            <span className="logo-shield">🛡️</span>
            <div className="logo-text">
              <span className="logo-en">{t.title}</span>
              <span className="logo-hi">{t.titleHi}</span>
            </div>
          </div>
          <div className="lang-toggle">
            <button
              className={lang === 'en' ? 'on' : ''}
              onClick={() => setLang('en')}
              type="button"
            >EN</button>
            <button
              className={lang === 'hi' ? 'on' : ''}
              onClick={() => setLang('hi')}
              type="button"
            >हिंदी</button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main-content">
        <div className="inner">

          {/* Yellow Banner */}
          {showBanner && (
            <aside className="demo-banner">
              <span className="demo-banner-icon">⚠️</span>
              <span className="demo-banner-text">
                {stats && stats.directorySource === 'rbi'
                  ? (lang === 'hi'
                      ? `डायरेक्टरी डेटा: RBI की DLA डायरेक्टरी से ${stats.importedAt || ''} को ${stats.directoryCount} ऐप आयात किए गए। पूर्ण परमिशन स्कोरिंग केवल काल्पनिक डेमो ऐप के लिए काम करती है।`
                      : `Directory data: ${stats.directoryCount} apps imported from RBI's DLA directory on ${stats.importedAt || ''}. Full permission scoring works only for the fictional demo apps.`)
                  : t.demoBanner}
              </span>
              <button
                onClick={() => setShowBanner(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#854d0e', fontSize: 14, padding: 0 }}
                aria-label="Dismiss"
                type="button"
              >✕</button>
            </aside>
          )}

          {/* Hero — only show when no result */}
          {!result && !notFound && !error && (
            <div className="hero">
              <div className="hero-shield">🛡️</div>
              <span className="hero-tag">🔒 {t.heroTag}</span>
              <h1 className="hero-title">
                {t.title}{' '}
                <span className="hero-title-hi">{t.titleHi}</span>
              </h1>
              <p className="hero-tagline">
                "{t.tagline}"
                <span className="hero-tagline-hi">{t.taglineHi}</span>
              </p>
            </div>
          )}

          {/* Search card */}
          <section className="search-card">
            <label className="search-label" htmlFor="app-search-input">
              🔍 {t.searchLabel}
            </label>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="search-input-wrap">
                <input
                  id="app-search-input"
                  list="app-list"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                />
                <datalist id="app-list">
                  {apps.map(a => <option key={a.id} value={a.name} />)}
                </datalist>
              </div>

              <button
                type="submit"
                className="search-btn"
                disabled={loading || !name.trim()}
              >
                {loading ? t.checking : t.check}
                <span style={{ fontSize: 20 }}>→</span>
              </button>
            </form>

            {/* Quick suggestion chips */}
            {apps.length > 0 && (
              <div>
                <div className="suggestions-label">{t.quickSuggest}</div>
                <div className="suggestions-row">
                  {apps.slice(0, 5).map(a => (
                    <button
                      key={a.id}
                      type="button"
                      className="suggestion-chip"
                      onClick={() => { setName(a.name); runCheck(a.name); }}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Error card */}
          {error && (
            <div className="card error-card">{error}</div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="card">
              <p className="not-found-text">{t.notFound}</p>
              <div className="chips">
                {notFound.map(n => (
                  <button
                    key={n}
                    type="button"
                    className="chip"
                    onClick={() => { setName(n); runCheck(n); }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            isDirectory
              ? <DirResult r={result} lang={lang} t={t} onSearch={(simName) => { setName(simName); runCheck(simName); }} />
              : <FullResult r={result} lang={lang} t={t} />
          )}
        </div>
      </main>

      <footer>{t.footer}</footer>
    </div>
  );
}
