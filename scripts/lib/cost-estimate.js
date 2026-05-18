'use strict';

/**
 * Shared cost estimation for ecc hooks.
 *
 * Approximate per-1M-token blended rates (conservative defaults).
 */

const RATE_TABLE = {
  fast: { in: 0.8, out: 4.0 },
  standard: { in: 3.0, out: 15.0 },
  deep: { in: 15.0, out: 75.0 }
};

/**
 * Estimate USD cost from token counts.
 * @param {string} model - Model name (may contain "fast", "standard", or "deep")
 * @param {number} inputTokens
 * @param {number} outputTokens
 * @returns {number} Estimated cost in USD (rounded to 6 decimal places)
 */
function estimateCost(model, inputTokens, outputTokens) {
  const normalized = String(model || '').toLowerCase();
  let rates = RATE_TABLE.standard;
  if (normalized.includes('fast')) rates = RATE_TABLE.fast;
  if (normalized.includes('deep')) rates = RATE_TABLE.deep;

  const cost = (inputTokens / 1_000_000) * rates.in + (outputTokens / 1_000_000) * rates.out;
  return Math.round(cost * 1e6) / 1e6;
}

module.exports = { estimateCost, RATE_TABLE };
