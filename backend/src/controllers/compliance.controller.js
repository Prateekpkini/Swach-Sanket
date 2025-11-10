// controllers/compliance.controller.js
import { compliancePromptInputSchema, complianceFromEntrySchema } from "../types/compliance.js";
import { buildCompliancePrompt } from "../utils/compliancePrompt.js";
import { generateComplianceReport } from "../utils/llm.js";
import { calculateComplianceMetrics } from "../utils/complianceMetrics.js";
import { Entry } from "../models/Entry.js";

/**
 * POST /api/compliance/generate
 * 
 * Generates a compliance report based on provided data
 * 
 * Body: {
 *   meta: { taluk, panchayat, vehicleRegNo },
 *   date: "YYYY-MM-DD",
 *   metrics: { ... },
 *   inputs: { ... } (optional)
 * }
 */
export const generateReport = async (req, res, next) => {
  try {
    // Validate input using Zod schema
    const validatedInput = compliancePromptInputSchema.parse(req.body);

    // Build the prompt
    const prompt = buildCompliancePrompt(validatedInput);

    // Generate the report using LLM
    const report = await generateComplianceReport(prompt);

    // Return the generated report
    res.json({
      success: true,
      report,
      meta: {
        taluk: validatedInput.meta.taluk,
        panchayat: validatedInput.meta.panchayat,
        vehicleRegNo: validatedInput.meta.vehicleRegNo,
        date: validatedInput.date,
      },
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    // Handle LLM errors
    if (error.message.includes("GEMINI_API_KEY")) {
      return res.status(500).json({
        success: false,
        message: "LLM service not configured. Please set GEMINI_API_KEY in environment variables.",
      });
    }

    // Handle other errors
    console.error("Compliance report generation error:", error);
    next(error);
  }
};

/**
 * POST /api/compliance/generate-from-entry
 * 
 * Generates a compliance report from entry data (material weights) + operational metadata
 * This endpoint calculates metrics automatically from the provided data
 * 
 * Body: {
 *   meta: { taluk, panchayat, vehicleRegNo },
 *   date: "YYYY-MM-DD",
 *   entryId?: "entry_id", // Optional: fetch entry from DB
 *   entryData?: { "Material Name": weight }, // Optional: provide entry data directly
 *   totals: { totalHouseholds, totalShops },
 *   day: { households, commercialShops, wetWasteCollected, ... },
 *   weekToDate?: { ... } // Optional
 * }
 */
export const generateReportFromEntry = async (req, res, next) => {
  try {
    // Validate input
    const validatedInput = complianceFromEntrySchema.parse(req.body);
    const { meta, date, entryId, entryData, totals, day, weekToDate } = validatedInput;

    // Get entry data - either from DB or from request
    let materialData = entryData || {};
    
    if (entryId && !entryData) {
      // Fetch entry from database
      const entry = await Entry.findById(entryId).lean();
      if (!entry) {
        return res.status(404).json({
          success: false,
          message: "Entry not found",
        });
      }
      materialData = entry.data || {};
    }

    // Calculate dry waste collected from entry data (sum of all material weights)
    const dryWasteCollected = Object.values(materialData).reduce(
      (sum, weight) => sum + (Number(weight) || 0),
      0
    );

    // Use provided dryWasteStored or calculate from entry data
    const dryWasteStored = day.dryWasteStored !== undefined 
      ? day.dryWasteStored 
      : dryWasteCollected * 0.1; // Default to 10% if not provided

    // Prepare day data with calculated dry waste
    const dayData = {
      ...day,
      dryWasteCollected,
      dryWasteStored,
    };

    // Calculate metrics
    const metrics = calculateComplianceMetrics({
      totals,
      day: dayData,
    });

    // Build the input for compliance prompt
    const complianceInput = {
      meta,
      date,
      metrics,
      inputs: {
        totals,
        day: dayData,
        weekToDate,
      },
    };

    // Build prompt and generate report
    const prompt = buildCompliancePrompt(complianceInput);
    const report = await generateComplianceReport(prompt);

    // Return the generated report
    res.json({
      success: true,
      report,
      meta: {
        taluk: meta.taluk,
        panchayat: meta.panchayat,
        vehicleRegNo: meta.vehicleRegNo,
        date,
      },
      calculatedMetrics: metrics,
      entryData: {
        dryWasteCollected,
        dryWasteStored,
        materialCount: Object.keys(materialData).length,
        totalMaterialsWeight: dryWasteCollected,
      },
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    // Handle LLM errors
    if (error.message.includes("GEMINI_API_KEY")) {
      return res.status(500).json({
        success: false,
        message: "LLM service not configured. Please set GEMINI_API_KEY in environment variables.",
      });
    }

    // Handle other errors
    console.error("Compliance report generation error:", error);
    next(error);
  }
};

