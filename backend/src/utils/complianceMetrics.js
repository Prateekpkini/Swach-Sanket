// utils/complianceMetrics.js

/**
 * Calculates compliance metrics from entry data and operational inputs
 * @param {Object} params - Parameters for metric calculation
 * @returns {Object} Calculated metrics
 */
export function calculateComplianceMetrics({
  totals,
  day,
}) {
  // Calculate segregation rates
  const segregationHouseholdsRate = totals.totalHouseholds > 0
    ? Math.min(day.households / totals.totalHouseholds, 1)
    : 0;

  const segregationShopsRate = totals.totalShops > 0
    ? Math.min(day.commercialShops / totals.totalShops, 1)
    : 0;

  // Calculate efficiency rates
  const wetMgmtEfficiency = day.wetWasteCollected > 0
    ? Math.min(day.wetWasteManaged / day.wetWasteCollected, 1)
    : 0;

  const sanitaryDisposalEfficiency = day.sanitaryWasteCollected > 0
    ? Math.min(day.sanitaryWasteScientificallyDisposed / day.sanitaryWasteCollected, 1)
    : 0;

  // Calculate dry storage ratio
  const dryStorageRatio = day.dryWasteCollected > 0
    ? Math.min(day.dryWasteStored / day.dryWasteCollected, 1)
    : 0;

  // Calculate per-household waste generation
  const totalWaste = day.wetWasteCollected + day.dryWasteCollected + day.sanitaryWasteCollected;
  const perHouseholdWasteKg = day.households > 0
    ? totalWaste / day.households
    : 0;

  // Calculate compliance score (weighted average)
  const weights = {
    segregationHouseholds: 0.25,
    segregationShops: 0.15,
    wetMgmtEfficiency: 0.25,
    sanitaryDisposalEfficiency: 0.20,
    dryStorageRatio: 0.15, // Lower is better, so invert
  };

  const score = Math.round(
    (segregationHouseholdsRate * weights.segregationHouseholds * 100) +
    (segregationShopsRate * weights.segregationShops * 100) +
    (wetMgmtEfficiency * weights.wetMgmtEfficiency * 100) +
    (sanitaryDisposalEfficiency * weights.sanitaryDisposalEfficiency * 100) +
    ((1 - Math.min(dryStorageRatio, 0.2) / 0.2) * weights.dryStorageRatio * 100) // Invert dry storage (0-0.2 is good)
  );

  // Determine band
  let band;
  if (score >= 90) band = "Excellent";
  else if (score >= 80) band = "Good";
  else if (score >= 70) band = "Fair";
  else if (score >= 60) band = "Needs Improvement";
  else band = "Poor";

  return {
    segregationHouseholdsRate: Math.max(0, Math.min(1, segregationHouseholdsRate)),
    segregationShopsRate: Math.max(0, Math.min(1, segregationShopsRate)),
    wetMgmtEfficiency: Math.max(0, Math.min(1, wetMgmtEfficiency)),
    sanitaryDisposalEfficiency: Math.max(0, Math.min(1, sanitaryDisposalEfficiency)),
    dryStorageRatio: Math.max(0, Math.min(1, dryStorageRatio)),
    perHouseholdWasteKg: Math.max(0, perHouseholdWasteKg),
    score: Math.max(0, Math.min(100, score)),
    band,
  };
}

/**
 * Calculates week-to-date averages from multiple day entries
 * @param {Array} entries - Array of day entry objects with metrics
 * @returns {Object} Week-to-date averages
 */
export function calculateWeekToDateAverages(entries) {
  if (!entries || entries.length === 0) {
    return null;
  }

  const sums = {
    segregationHouseholdsRate: 0,
    segregationShopsRate: 0,
    wetMgmtEfficiency: 0,
    sanitaryDisposalEfficiency: 0,
    dryStorageRatio: 0,
    perHouseholdWasteKg: 0,
    score: 0,
    households: 0,
    commercialShops: 0,
    wetWasteCollected: 0,
    wetWasteManaged: 0,
    sanitaryWasteCollected: 0,
    sanitaryWasteScientificallyDisposed: 0,
    dryWasteCollected: 0,
    dryWasteStored: 0,
  };

  entries.forEach(entry => {
    sums.segregationHouseholdsRate += entry.metrics.segregationHouseholdsRate;
    sums.segregationShopsRate += entry.metrics.segregationShopsRate;
    sums.wetMgmtEfficiency += entry.metrics.wetMgmtEfficiency;
    sums.sanitaryDisposalEfficiency += entry.metrics.sanitaryDisposalEfficiency;
    sums.dryStorageRatio += entry.metrics.dryStorageRatio;
    sums.perHouseholdWasteKg += entry.metrics.perHouseholdWasteKg;
    sums.score += entry.metrics.score;
    sums.households += entry.day.households;
    sums.commercialShops += entry.day.commercialShops;
    sums.wetWasteCollected += entry.day.wetWasteCollected;
    sums.wetWasteManaged += entry.day.wetWasteManaged;
    sums.sanitaryWasteCollected += entry.day.sanitaryWasteCollected;
    sums.sanitaryWasteScientificallyDisposed += entry.day.sanitaryWasteScientificallyDisposed;
    sums.dryWasteCollected += entry.day.dryWasteCollected;
    sums.dryWasteStored += entry.day.dryWasteStored;
  });

  const count = entries.length;
  return {
    weekStartDate: entries[0].date,
    daysCount: count,
    avgSegregationHouseholdsRate: sums.segregationHouseholdsRate / count,
    avgSegregationShopsRate: sums.segregationShopsRate / count,
    avgWetMgmtEfficiency: sums.wetMgmtEfficiency / count,
    avgSanitaryDisposalEfficiency: sums.sanitaryDisposalEfficiency / count,
    avgDryStorageRatio: sums.dryStorageRatio / count,
    avgPerHouseholdWasteKg: sums.perHouseholdWasteKg / count,
    avgScore: sums.score / count,
    avgHouseholds: sums.households / count,
    avgCommercialShops: sums.commercialShops / count,
    avgWetWasteCollected: sums.wetWasteCollected / count,
    avgWetWasteManaged: sums.wetWasteManaged / count,
    avgSanitaryWasteCollected: sums.sanitaryWasteCollected / count,
    avgSanitaryWasteScientificallyDisposed: sums.sanitaryWasteScientificallyDisposed / count,
    avgDryWasteCollected: sums.dryWasteCollected / count,
    avgDryWasteStored: sums.dryWasteStored / count,
  };
}

