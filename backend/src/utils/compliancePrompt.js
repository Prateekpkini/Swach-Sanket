// utils/compliancePrompt.js

/**
 * Builds the compliance narrative prompt from structured input data.
 *
 * This function formats the LLM prompt template with actual values from the
 * compliance report data. The prompt instructs the LLM to generate structured
 * narratives for three different administrative roles without performing
 * any calculations (all metrics are pre-computed).
 *
 * @param {Object} input - Structured input containing meta, date, metrics, and optional inputs
 * @returns {string} Formatted prompt string ready for LLM processing
 */
export function buildCompliancePrompt(input) {
  const { meta, date, metrics, inputs } = input;

  // Format metrics for display (keep as 0-1 scale, not percentages)
  const formatMetric = (value) => value.toFixed(2);

  // Build week-to-date comparison section if available
  let weekToDateSection = "";
  let weekToDateInstructions = "";
  if (inputs?.weekToDate) {
    const wtd = inputs.weekToDate;
    weekToDateSection = `
Week-to-Date Performance (from ${wtd.weekStartDate} to ${date}, ${wtd.daysCount} days):
- Average Household Segregation Rate: ${formatMetric(wtd.avgSegregationHouseholdsRate)} (Today: ${formatMetric(metrics.segregationHouseholdsRate)})
- Average Commercial Segregation Rate: ${formatMetric(wtd.avgSegregationShopsRate)} (Today: ${formatMetric(metrics.segregationShopsRate)})
- Average Wet Waste Management Efficiency: ${formatMetric(wtd.avgWetMgmtEfficiency)} (Today: ${formatMetric(metrics.wetMgmtEfficiency)})
- Average Sanitary Disposal Efficiency: ${formatMetric(wtd.avgSanitaryDisposalEfficiency)} (Today: ${formatMetric(metrics.sanitaryDisposalEfficiency)})
- Average Dry Storage Ratio: ${formatMetric(wtd.avgDryStorageRatio)} (Today: ${formatMetric(metrics.dryStorageRatio)})
- Average Per-Household Waste Generation: ${wtd.avgPerHouseholdWasteKg.toFixed(2)} kg (Today: ${metrics.perHouseholdWasteKg.toFixed(2)} kg)
- Average Compliance Score: ${wtd.avgScore.toFixed(1)} (Today: ${metrics.score})
- Average Daily Households Segregated: ${wtd.avgHouseholds.toFixed(0)} (Today: ${inputs.day.households})
- Average Daily Shops Segregated: ${wtd.avgCommercialShops.toFixed(0)} (Today: ${inputs.day.commercialShops})
- Average Daily Wet Waste Collected: ${wtd.avgWetWasteCollected.toFixed(2)} kg (Today: ${inputs.day.wetWasteCollected.toFixed(2)} kg)
- Average Daily Wet Waste Managed: ${wtd.avgWetWasteManaged.toFixed(2)} kg (Today: ${inputs.day.wetWasteManaged.toFixed(2)} kg)
- Average Daily Sanitary Waste Collected: ${wtd.avgSanitaryWasteCollected.toFixed(2)} kg (Today: ${inputs.day.sanitaryWasteCollected.toFixed(2)} kg)
- Average Daily Sanitary Waste Disposed: ${wtd.avgSanitaryWasteScientificallyDisposed.toFixed(2)} kg (Today: ${inputs.day.sanitaryWasteScientificallyDisposed.toFixed(2)} kg)
- Average Daily Dry Waste Collected: ${wtd.avgDryWasteCollected.toFixed(2)} kg (Today: ${inputs.day.dryWasteCollected.toFixed(2)} kg)
- Average Daily Dry Waste Stored: ${wtd.avgDryWasteStored.toFixed(2)} kg (Today: ${inputs.day.dryWasteStored.toFixed(2)} kg)

IMPORTANT: Compare today's performance against week-to-date averages. Identify trends, improvements, or declines.`;
    weekToDateInstructions = `
   - Compare today's metrics against week-to-date averages and identify trends
   - Highlight improvements or declines in key indicators
   - Identify patterns: Is performance improving, declining, or stable?
   - Discuss important trends that can be noticed across the week-to-date period`;
  } else {
    weekToDateInstructions = `
   - Note: This appears to be the first report for this week, so historical comparison data is not available
   - Focus on today's performance metrics and identify any immediate concerns or strengths`;
  }

  // Build the prompt following the exact template structure
  const prompt = `You are an SWM (Solid Waste Management) Compliance Narrator. 

You are generating a comprehensive daily compliance report for a Gram Panchayat based on pre-computed data.

Do not perform or repeat any mathematical calculations — assume all percentages and scores provided are correct.

Context:
- Taluk: ${meta.taluk}
- Panchayat: ${meta.panchayat}
- Vehicle Registration No: ${meta.vehicleRegNo}
- Report Date: ${date}

Today's Metrics (already computed):
- Household Segregation Rate: ${formatMetric(metrics.segregationHouseholdsRate)} (0–1 scale)
- Commercial Segregation Rate: ${formatMetric(metrics.segregationShopsRate)}
- Wet Waste Management Efficiency: ${formatMetric(metrics.wetMgmtEfficiency)}
- Sanitary Disposal Efficiency: ${formatMetric(metrics.sanitaryDisposalEfficiency)}
- Dry Waste Storage Ratio: ${formatMetric(metrics.dryStorageRatio)}
- Per-Household Waste Generation (kg): ${metrics.perHouseholdWasteKg.toFixed(2)}
- Compliance Score: ${metrics.score} (Band: ${metrics.band})${weekToDateSection}

DATA VALIDITY CHECK:
Before generating the report, carefully analyze the data for potential irregularities. Check for:

1. *Completeness Errors (Missing Data)*: Are there unexpected zeros, nulls, or missing values? For example:
   - Total households/shops is 0 when operations are expected
   - Waste collected is 0 when households are reported as segregating
   - Managed waste is 0 when collected waste exists

2. *Consistency Errors (Conflicting Data)*: Are there logical contradictions? For example:
   - Segregated households exceed total households
   - Managed waste exceeds collected waste (should be ≤ collected)
   - Disposed sanitary waste exceeds collected sanitary waste
   - Stored dry waste exceeds collected dry waste

3. *Accuracy Errors (Incorrect Values)*: Are values realistic for SWM operations? For example:
   - Per-household waste generation is abnormally high (>10 kg) or low (<0.5 kg) without context
   - Segregation rates are exactly 0% or 100% when partial compliance is expected
   - Waste quantities show sudden extreme spikes or drops without explanation

4. *Validity Errors (Format/Domain Violations)*: Do values violate expected constraints? For example:
   - Negative values for waste quantities
   - Segregation rates outside 0-1 range
   - Non-integer values for household/shop counts

5. *Duplication Errors*: Are there signs of duplicate entries? (This is harder to detect from single-day data, but note if patterns suggest it)

6. *Timeliness Errors*: Is the data current and relevant? (Usually not applicable for daily reports, but note if data seems stale)

If you detect any data irregularities, include them in the "dataIrregularities" field as warnings (not accusations). Use the following error types:
- "Completeness Errors" (common name: "Missing Data")
- "Consistency Errors" (common name: "Conflicting/Contradictory Data")
- "Accuracy Errors" (common name: "Incorrect Values")
- "Validity Errors" (common name: "Format/Domain Constraint Violations")
- "Duplication Errors" (common name: "Redundant Records")
- "Timeliness Errors" (common name: "Stale/Outdated Data")

For each irregularity, describe it in the context of SWM operations and specify which data quality metric is affected.

Tasks:
1. *gpAccountHolderSummary*: Write 2–3 sentences describing the day's operational performance.
   Focus on segregation compliance, efficiency, and any immediate action needed.
   ${inputs?.weekToDate ? "Compare today's performance with week-to-date averages if available." : "Since this is the first report of the week, focus on today's performance."}
   Example tone: "Wet waste management efficiency remained above 95%. Recommend scheduling pickup for stored dry waste exceeding 10%."

2. *supervisorySummary*: Write a comprehensive paragraph (max 150 words) summarizing performance from a supervisory viewpoint.${weekToDateInstructions}
   - Mention if any key indicator (segregation < 75%, efficiency < 90%) needs intervention

3. *zpMrfSummary*: Write a brief 2–3 sentence summary for district or MRF monitoring.
   Emphasize collection-to-dispatch alignment, backlog risks, resource needs${inputs?.weekToDate ? ", and overall week-to-date trends" : ""}.

4. *recommendations*: Provide 3–5 concise bullet points with actionable operational or process improvements.
   ${inputs?.weekToDate ? "Base recommendations on both today's performance and week-to-date trends." : "Base recommendations on today's performance."}

5. *risks*: List up to 3 potential issues if performance continues at the current level.
   ${inputs?.weekToDate ? "Consider both immediate risks and risks based on week-to-date trends." : "Focus on immediate risks based on today's performance."}
   Return an empty array if all metrics are stable.

6. *notes*: Optional short note with contextual or situational information (weather, festival, etc.) if relevant.

7. *dataIrregularities*: List any data quality issues detected. Each irregularity should include:
   - errorType: One of the error types listed above
   - commonName: The common name for that error type
   - description: A warning description in SWM context (e.g., "Warning: Collected wet waste is 0 kg while 450 households are reported as segregating, which may indicate missing data entry")
   - dataQualityMetricAffected: The affected metric (Completeness, Consistency, Accuracy, Validity, Uniqueness, or Timeliness)
   Return an empty array if no irregularities are detected.

Rules:
- Do not restate raw data or repeat numbers unnecessarily.
- Keep text clear, factual, and professional.
- Do not include percentages or values unless it improves clarity.
- Avoid unnecessary adjectives or filler language.
${inputs?.weekToDate ? "- When comparing with week-to-date, highlight significant differences (>10% change) and trends." : ""}
- Present data irregularities as warnings, not accusations. Use phrases like "may indicate", "suggests possible", "warrants verification".
- Always return valid JSON following this schema:

{
  "gpAccountHolderSummary": "string",
  "supervisorySummary": "string",
  "zpMrfSummary": "string",
  "recommendations": ["string"],
  "risks": ["string"],
  "notes": "string (optional)",
  "dataIrregularities": [
    {
      "errorType": "Completeness Errors" | "Consistency Errors" | "Accuracy Errors" | "Validity Errors" | "Duplication Errors" | "Timeliness Errors",
      "commonName": "string",
      "description": "string",
      "dataQualityMetricAffected": "Completeness" | "Consistency" | "Accuracy" | "Validity" | "Uniqueness" | "Timeliness"
    }
  ]
}

Generate only this JSON and nothing else.`;

  // Optionally append input data for context (if provided)
  if (inputs) {
    const contextSection = `
Reference Data (for context only - do not recalculate):
- Total Households: ${inputs.totals.totalHouseholds}
- Total Shops: ${inputs.totals.totalShops}
- Segregated Households Today: ${inputs.day.households}
- Segregated Shops Today: ${inputs.day.commercialShops}
- Wet Waste Collected: ${inputs.day.wetWasteCollected.toFixed(2)} kg
- Wet Waste Managed: ${inputs.day.wetWasteManaged.toFixed(2)} kg
- Sanitary Waste Collected: ${inputs.day.sanitaryWasteCollected.toFixed(2)} kg
- Sanitary Waste Disposed: ${inputs.day.sanitaryWasteScientificallyDisposed.toFixed(2)} kg
- Dry Waste Collected: ${inputs.day.dryWasteCollected.toFixed(2)} kg
- Dry Waste Stored: ${inputs.day.dryWasteStored.toFixed(2)} kg`;

    return prompt + contextSection;
  }

  return prompt;
}

