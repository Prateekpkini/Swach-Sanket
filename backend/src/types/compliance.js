// types/compliance.js
import { z } from "zod";

/**
 * Schema for compliance prompt input validation
 */
export const compliancePromptInputSchema = z.object({
  meta: z.object({
    taluk: z.string().min(1),
    panchayat: z.string().min(1),
    vehicleRegNo: z.string().min(1),
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  metrics: z.object({
    segregationHouseholdsRate: z.number().min(0).max(1),
    segregationShopsRate: z.number().min(0).max(1),
    wetMgmtEfficiency: z.number().min(0).max(1),
    sanitaryDisposalEfficiency: z.number().min(0).max(1),
    dryStorageRatio: z.number().min(0).max(1),
    perHouseholdWasteKg: z.number().nonnegative(),
    score: z.number().min(0).max(100),
    band: z.string(),
  }),
  inputs: z.object({
    totals: z.object({
      totalHouseholds: z.number().int().nonnegative(),
      totalShops: z.number().int().nonnegative(),
    }),
    day: z.object({
      households: z.number().int().nonnegative(),
      commercialShops: z.number().int().nonnegative(),
      wetWasteCollected: z.number().nonnegative(),
      wetWasteManaged: z.number().nonnegative(),
      sanitaryWasteCollected: z.number().nonnegative(),
      sanitaryWasteScientificallyDisposed: z.number().nonnegative(),
      dryWasteCollected: z.number().nonnegative(),
      dryWasteStored: z.number().nonnegative(),
    }),
    weekToDate: z.object({
      weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      daysCount: z.number().int().positive(),
      avgSegregationHouseholdsRate: z.number().min(0).max(1),
      avgSegregationShopsRate: z.number().min(0).max(1),
      avgWetMgmtEfficiency: z.number().min(0).max(1),
      avgSanitaryDisposalEfficiency: z.number().min(0).max(1),
      avgDryStorageRatio: z.number().min(0).max(1),
      avgPerHouseholdWasteKg: z.number().nonnegative(),
      avgScore: z.number().min(0).max(100),
      avgHouseholds: z.number().nonnegative(),
      avgCommercialShops: z.number().nonnegative(),
      avgWetWasteCollected: z.number().nonnegative(),
      avgWetWasteManaged: z.number().nonnegative(),
      avgSanitaryWasteCollected: z.number().nonnegative(),
      avgSanitaryWasteScientificallyDisposed: z.number().nonnegative(),
      avgDryWasteCollected: z.number().nonnegative(),
      avgDryWasteStored: z.number().nonnegative(),
    }).optional(),
  }).optional(),
});

/**
 * Schema for generating compliance report from entry data
 * This accepts entry data along with operational metadata
 */
export const complianceFromEntrySchema = z.object({
  meta: z.object({
    taluk: z.string().min(1),
    panchayat: z.string().min(1),
    vehicleRegNo: z.string().min(1),
  }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entryId: z.string().optional(), // Optional: if provided, will fetch entry from DB
  entryData: z.record(z.string(), z.number().nonnegative()).optional(), // Material weights from entry
  totals: z.object({
    totalHouseholds: z.number().int().nonnegative(),
    totalShops: z.number().int().nonnegative(),
  }),
  day: z.object({
    households: z.number().int().nonnegative(),
    commercialShops: z.number().int().nonnegative(),
    wetWasteCollected: z.number().nonnegative(),
    wetWasteManaged: z.number().nonnegative(),
    sanitaryWasteCollected: z.number().nonnegative(),
    sanitaryWasteScientificallyDisposed: z.number().nonnegative(),
    dryWasteStored: z.number().nonnegative().optional(), // Optional: can be calculated from entry data
  }),
  weekToDate: z.object({
    weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    daysCount: z.number().int().positive(),
    avgSegregationHouseholdsRate: z.number().min(0).max(1),
    avgSegregationShopsRate: z.number().min(0).max(1),
    avgWetMgmtEfficiency: z.number().min(0).max(1),
    avgSanitaryDisposalEfficiency: z.number().min(0).max(1),
    avgDryStorageRatio: z.number().min(0).max(1),
    avgPerHouseholdWasteKg: z.number().nonnegative(),
    avgScore: z.number().min(0).max(100),
    avgHouseholds: z.number().nonnegative(),
    avgCommercialShops: z.number().nonnegative(),
    avgWetWasteCollected: z.number().nonnegative(),
    avgWetWasteManaged: z.number().nonnegative(),
    avgSanitaryWasteCollected: z.number().nonnegative(),
    avgSanitaryWasteScientificallyDisposed: z.number().nonnegative(),
    avgDryWasteCollected: z.number().nonnegative(),
    avgDryWasteStored: z.number().nonnegative(),
  }).optional(),
});
