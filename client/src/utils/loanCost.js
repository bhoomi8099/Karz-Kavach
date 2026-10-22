/**
 * Pure functions for calculating true loan costs and effective yearly cost.
 */

/**
 * Calculates loan costs, net disbursal, total repayment, and effective APR.
 *
 * @param {Object} params
 * @param {number|string} params.amount - Principal loan amount in ₹
 * @param {number|string} params.rate - Nominal interest rate
 * @param {'% per day'|'% per month'|'% per year'} params.rateUnit - Interest rate unit
 * @param {number|string} params.tenure - Duration of the loan
 * @param {'days'|'months'} params.tenureUnit - Duration unit
 * @param {number|string} params.feeValue - Processing fee
 * @param {'₹'|'% of loan'} params.feeType - Processing fee type
 * @param {number|string} [params.gstPercent=18] - GST % on processing fee (default 18)
 * @param {number|string} [params.otherCharges=0] - Other upfront charges in ₹ (default 0)
 * @returns {Object} Calculation result including status and all figures
 */
export function calculateLoanCost({
  amount,
  rate,
  rateUnit = '% per day',
  tenure,
  tenureUnit = 'days',
  feeValue,
  feeType = '% of loan',
  gstPercent = 18,
  otherCharges = 0,
}) {
  const numAmount = parseFloat(amount);
  const numRate = parseFloat(rate);
  const numTenure = parseFloat(tenure);
  const numFeeValue = parseFloat(feeValue) || 0;
  const numGstPercent = gstPercent === '' || isNaN(parseFloat(gstPercent)) ? 18 : parseFloat(gstPercent);
  const numOtherCharges = parseFloat(otherCharges) || 0;

  // Validation: empty or 0 amount, rate, or tenure, or negative values
  if (
    isNaN(numAmount) || numAmount <= 0 ||
    isNaN(numRate) || numRate <= 0 ||
    isNaN(numTenure) || numTenure <= 0 ||
    numFeeValue < 0 || numGstPercent < 0 || numOtherCharges < 0
  ) {
    return {
      status: 'empty',
      message: 'Enter the details above to see the cost',
    };
  }

  // 1. days = tenure unit is "months" ? months * 30 : days
  const days = tenureUnit === 'months' ? numTenure * 30 : numTenure;
  if (!isFinite(days) || days <= 0) {
    return {
      status: 'empty',
      message: 'Enter the details above to see the cost',
    };
  }

  // 2. ratePerDay = unit "% per day" ? rate/100 : unit "% per month" ? rate/100/30 : rate/100/365
  let ratePerDay;
  if (rateUnit === '% per day') {
    ratePerDay = numRate / 100;
  } else if (rateUnit === '% per month') {
    ratePerDay = numRate / 100 / 30;
  } else {
    // '% per year'
    ratePerDay = numRate / 100 / 365;
  }

  // 3. interest = amount * ratePerDay * days (simple interest, single repayment at the end)
  const interest = numAmount * ratePerDay * days;

  // 4. fee = fee type "₹" ? feeValue : amount * feeValue/100
  const fee = (feeType === '₹') ? numFeeValue : (numAmount * numFeeValue / 100);

  // 5. gst = fee * gstPercent/100
  const gst = fee * (numGstPercent / 100);

  // 6. upfront = fee + gst + otherCharges (deducted from amount before receiving)
  const upfront = fee + gst + numOtherCharges;

  // 7. received = amount - upfront (money that actually reaches borrower)
  const received = numAmount - upfront;

  // Edge case: if received <= 0 (charges are higher than the loan)
  if (received <= 0) {
    return {
      status: 'charges_exceed',
      message: 'Charges are higher than the loan amount. Please check the numbers.',
      amount: numAmount,
      upfront,
      received,
      fee,
      gst,
      otherCharges: numOtherCharges,
    };
  }

  // 8. totalRepay = amount + interest
  const totalRepay = numAmount + interest;

  // 9. extraPaid = totalRepay - received (= interest + upfront)
  const extraPaid = totalRepay - received;

  // 10. effectiveYearlyCost (%) = (extraPaid / received) * (365 / days) * 100
  let effectiveYearlyCost = (extraPaid / received) * (365 / days) * 100;
  if (!isFinite(effectiveYearlyCost) || isNaN(effectiveYearlyCost)) {
    effectiveYearlyCost = 0;
  }

  // Proportions for stacked bar breakdown
  // Total components sum: received + upfront + interest = totalRepay
  const totalBreakdownBase = received + upfront + interest;
  const receivedRatio = totalBreakdownBase > 0 ? (received / totalBreakdownBase) * 100 : 0;
  const upfrontRatio = totalBreakdownBase > 0 ? (upfront / totalBreakdownBase) * 100 : 0;
  const interestRatio = totalBreakdownBase > 0 ? (interest / totalBreakdownBase) * 100 : 0;

  return {
    status: 'ok',
    amount: numAmount,
    days,
    ratePerDay,
    interest: isFinite(interest) ? interest : 0,
    fee: isFinite(fee) ? fee : 0,
    gst: isFinite(gst) ? gst : 0,
    otherCharges: numOtherCharges,
    upfront: isFinite(upfront) ? upfront : 0,
    received: isFinite(received) ? received : 0,
    totalRepay: isFinite(totalRepay) ? totalRepay : 0,
    extraPaid: isFinite(extraPaid) ? extraPaid : 0,
    effectiveYearlyCost,
    breakdown: {
      receivedPercent: Math.max(0, Math.min(100, receivedRatio)),
      upfrontPercent: Math.max(0, Math.min(100, upfrontRatio)),
      interestPercent: Math.max(0, Math.min(100, interestRatio)),
    },
  };
}

/**
 * Format currency in Indian number format (en-IN).
 * e.g. 10300 -> ₹10,300
 */
export function formatINR(val) {
  if (val == null || isNaN(val) || !isFinite(val)) return '₹0';
  const rounded = Math.round(val);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Format percentage with 1 decimal place.
 * e.g. 115.07 -> "115.1%"
 */
export function formatPercent(val) {
  if (val == null || isNaN(val) || !isFinite(val)) return '0.0%';
  return val.toFixed(1) + '%';
}
