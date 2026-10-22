import { useState, useMemo } from 'react';
import { calculateLoanCost, formatINR, formatPercent } from './utils/loanCost';

export default function LoanCostCalculator({ lang, t }) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState('% per day');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState('days');
  const [feeValue, setFeeValue] = useState('');
  const [feeType, setFeeType] = useState('% of loan');
  const [gstPercent, setGstPercent] = useState('18');
  const [otherCharges, setOtherCharges] = useState('');

  // Validate to disallow negative numbers
  const handleNonNegativeInput = (setter) => (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setter(val);
    }
  };

  const handleReset = () => {
    setAmount('');
    setRate('');
    setRateUnit('% per day');
    setTenure('');
    setTenureUnit('days');
    setFeeValue('');
    setFeeType('% of loan');
    setGstPercent('18');
    setOtherCharges('');
  };

  // Live calculation as user types
  const result = useMemo(() => {
    return calculateLoanCost({
      amount,
      rate,
      rateUnit,
      tenure,
      tenureUnit,
      feeValue,
      feeType,
      gstPercent,
      otherCharges,
    });
  }, [amount, rate, rateUnit, tenure, tenureUnit, feeValue, feeType, gstPercent, otherCharges]);

  return (
    <section id="loan-calculator" className="card loan-calculator-card" aria-labelledby="loan-calc-title">
      {/* Header */}
      <div className="calc-header">
        <div className="calc-header-title-group">
          <span className="calc-badge">🧮 {lang === 'hi' ? 'लागत कैलकुलेटर' : 'Cost Engine'}</span>
          <h2 id="loan-calc-title" className="calc-title">{t.calcTitle}</h2>
          <p className="calc-subtitle">{t.calcSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="calc-reset-btn"
          title={t.calcReset}
        >
          🔄 {t.calcReset}
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="calc-inputs-grid">
        {/* 1. Loan amount */}
        <div className="calc-field">
          <label htmlFor="calc-amount" className="calc-label">
            {t.calcLoanAmount}
          </label>
          <div className="calc-input-wrapper">
            <span className="calc-input-prefix">₹</span>
            <input
              id="calc-amount"
              type="text"
              inputMode="decimal"
              placeholder="10000"
              value={amount}
              onChange={handleNonNegativeInput(setAmount)}
              className="calc-input with-prefix"
            />
          </div>
        </div>

        {/* 2. Interest rate + unit selector */}
        <div className="calc-field">
          <label htmlFor="calc-rate" className="calc-label">
            {t.calcInterestRate}
          </label>
          <div className="calc-combo-input">
            <input
              id="calc-rate"
              type="text"
              inputMode="decimal"
              placeholder="0.1"
              value={rate}
              onChange={handleNonNegativeInput(setRate)}
              className="calc-input combo-field"
            />
            <select
              id="calc-rate-unit"
              value={rateUnit}
              onChange={(e) => setRateUnit(e.target.value)}
              className="calc-select combo-unit"
              aria-label="Interest rate unit"
            >
              <option value="% per day">{t.calcRateUnitDay}</option>
              <option value="% per month">{t.calcRateUnitMonth}</option>
              <option value="% per year">{t.calcRateUnitYear}</option>
            </select>
          </div>
        </div>

        {/* 3. Tenure + unit selector */}
        <div className="calc-field">
          <label htmlFor="calc-tenure" className="calc-label">
            {t.calcTenure}
          </label>
          <div className="calc-combo-input">
            <input
              id="calc-tenure"
              type="text"
              inputMode="numeric"
              placeholder="30"
              value={tenure}
              onChange={handleNonNegativeInput(setTenure)}
              className="calc-input combo-field"
            />
            <select
              id="calc-tenure-unit"
              value={tenureUnit}
              onChange={(e) => setTenureUnit(e.target.value)}
              className="calc-select combo-unit"
              aria-label="Tenure unit"
            >
              <option value="days">{t.calcTenureUnitDays}</option>
              <option value="months">{t.calcTenureUnitMonths}</option>
            </select>
          </div>
        </div>

        {/* 4. Processing fee + type selector */}
        <div className="calc-field">
          <label htmlFor="calc-fee" className="calc-label">
            {t.calcProcessingFee}
          </label>
          <div className="calc-combo-input">
            <input
              id="calc-fee"
              type="text"
              inputMode="decimal"
              placeholder="5"
              value={feeValue}
              onChange={handleNonNegativeInput(setFeeValue)}
              className="calc-input combo-field"
            />
            <select
              id="calc-fee-type"
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="calc-select combo-unit"
              aria-label="Processing fee type"
            >
              <option value="% of loan">{t.calcFeeTypePercent}</option>
              <option value="₹">{t.calcFeeTypeFlat}</option>
            </select>
          </div>
        </div>

        {/* 5. GST on processing fee */}
        <div className="calc-field">
          <label htmlFor="calc-gst" className="calc-label">
            {t.calcGstOnFee}
          </label>
          <div className="calc-input-wrapper">
            <input
              id="calc-gst"
              type="text"
              inputMode="decimal"
              placeholder="18"
              value={gstPercent}
              onChange={handleNonNegativeInput(setGstPercent)}
              className="calc-input with-suffix"
            />
            <span className="calc-input-suffix">%</span>
          </div>
        </div>

        {/* 6. Other upfront charges */}
        <div className="calc-field">
          <label htmlFor="calc-other" className="calc-label">
            {t.calcOtherCharges}
          </label>
          <div className="calc-input-wrapper">
            <span className="calc-input-prefix">₹</span>
            <input
              id="calc-other"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={otherCharges}
              onChange={handleNonNegativeInput(setOtherCharges)}
              className="calc-input with-prefix"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="calc-results-wrap">
        {result.status === 'empty' && (
          <div className="calc-empty-card">
            <span className="calc-empty-icon">ℹ️</span>
            <span className="calc-empty-text">{t.calcPromptEmpty}</span>
          </div>
        )}

        {result.status === 'charges_exceed' && (
          <div className="calc-error-card">
            <span className="calc-error-icon">⚠️</span>
            <div className="calc-error-content">
              <span className="calc-error-title">{t.calcChargesExceed}</span>
              <span className="calc-error-sub">
                {lang === 'hi'
                  ? `कुल शुल्क: ${formatINR(result.upfront)} • लोन राशि: ${formatINR(result.amount)}`
                  : `Total upfront charges: ${formatINR(result.upfront)} • Loan amount: ${formatINR(result.amount)}`}
              </span>
            </div>
          </div>
        )}

        {result.status === 'ok' && (
          <div className="calc-outputs-container">
            {/* 4 Cards Grid */}
            <div className="calc-cards-grid">
              {/* You actually receive */}
              <div className="calc-metric-card metric-received">
                <div className="calc-metric-head">
                  <span className="calc-metric-icon">💵</span>
                  <span className="calc-metric-label">{t.calcYouReceive}</span>
                </div>
                <div className="calc-metric-val">{formatINR(result.received)}</div>
                <div className="calc-metric-sub">
                  {lang === 'hi' ? 'खाते में आने वाली राशि' : 'Cash in hand / disbursal'}
                </div>
              </div>

              {/* You repay in total */}
              <div className="calc-metric-card metric-repay">
                <div className="calc-metric-head">
                  <span className="calc-metric-icon">💳</span>
                  <span className="calc-metric-label">{t.calcYouRepay}</span>
                </div>
                <div className="calc-metric-val">{formatINR(result.totalRepay)}</div>
                <div className="calc-metric-sub">
                  {lang === 'hi' ? 'मूलधन + कुल ब्याज' : 'Principal + Interest'}
                </div>
              </div>

              {/* Extra you pay */}
              <div className="calc-metric-card metric-extra">
                <div className="calc-metric-head">
                  <span className="calc-metric-icon">💸</span>
                  <span className="calc-metric-label">{t.calcExtraPaid}</span>
                </div>
                <div className="calc-metric-val">{formatINR(result.extraPaid)}</div>
                <div className="calc-metric-sub">
                  {lang === 'hi' ? 'ब्याज + सभी फीस व GST' : 'Interest + Fees + GST'}
                </div>
              </div>

              {/* Approx yearly cost */}
              <div className="calc-metric-card metric-yearly">
                <div className="calc-metric-head">
                  <span className="calc-metric-icon">📈</span>
                  <span className="calc-metric-label">{t.calcApproxYearlyCost}</span>
                  <span className="calc-approx-pill">{t.calcApproxTag}</span>
                </div>
                <div className="calc-metric-val">{formatPercent(result.effectiveYearlyCost)}</div>
                <div className="calc-metric-sub">
                  {lang === 'hi' ? 'प्रभावी वार्षिक दर (APR)' : 'Effective APR on received sum'}
                </div>
              </div>
            </div>

            {/* Horizontal Stacked Bar */}
            <div className="calc-breakdown-box">
              <div className="calc-breakdown-header">
                <span className="calc-breakdown-title">
                  📊 {lang === 'hi' ? 'रुपयों का विभाजन' : 'Where your money goes'}
                </span>
                <span className="calc-breakdown-total">
                  {lang === 'hi' ? 'कुल देनदारी:' : 'Total obligation:'} {formatINR(result.totalRepay)}
                </span>
              </div>

              {/* The stacked bar */}
              <div className="calc-stacked-bar" role="img" aria-label="Loan cost breakdown bar">
                <div
                  className="calc-bar-segment segment-received"
                  style={{ width: `${result.breakdown.receivedPercent}%` }}
                  title={`${t.calcLegendReceive}: ${formatINR(result.received)} (${result.breakdown.receivedPercent.toFixed(1)}%)`}
                />
                <div
                  className="calc-bar-segment segment-upfront"
                  style={{ width: `${result.breakdown.upfrontPercent}%` }}
                  title={`${t.calcLegendUpfront}: ${formatINR(result.upfront)} (${result.breakdown.upfrontPercent.toFixed(1)}%)`}
                />
                <div
                  className="calc-bar-segment segment-interest"
                  style={{ width: `${result.breakdown.interestPercent}%` }}
                  title={`${t.calcLegendInterest}: ${formatINR(result.interest)} (${result.breakdown.interestPercent.toFixed(1)}%)`}
                />
              </div>

              {/* Stacked bar legend */}
              <div className="calc-legend-row">
                <div className="calc-legend-item">
                  <span className="calc-legend-dot dot-received" />
                  <span className="calc-legend-name">{t.calcLegendReceive}:</span>
                  <strong className="calc-legend-val">{formatINR(result.received)}</strong>
                  <span className="calc-legend-pct">({result.breakdown.receivedPercent.toFixed(0)}%)</span>
                </div>
                <div className="calc-legend-item">
                  <span className="calc-legend-dot dot-upfront" />
                  <span className="calc-legend-name">{t.calcLegendUpfront}:</span>
                  <strong className="calc-legend-val">{formatINR(result.upfront)}</strong>
                  <span className="calc-legend-pct">({result.breakdown.upfrontPercent.toFixed(0)}%)</span>
                </div>
                <div className="calc-legend-item">
                  <span className="calc-legend-dot dot-interest" />
                  <span className="calc-legend-name">{t.calcLegendInterest}:</span>
                  <strong className="calc-legend-val">{formatINR(result.interest)}</strong>
                  <span className="calc-legend-pct">({result.breakdown.interestPercent.toFixed(0)}%)</span>
                </div>
              </div>
            </div>

            {/* Note under results */}
            <div className="calc-note-box">
              <span className="calc-note-icon">ℹ️</span>
              <p className="calc-note-text">{t.calcEstimateNote}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
