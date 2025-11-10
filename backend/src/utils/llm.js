// utils/llm.js

/**
 * LLM service utility for generating compliance reports
 * Uses Google Gemini API
 */

/**
 * Generates a compliance report using Gemini API
 * @param {string} prompt - The formatted prompt for the LLM
 * @returns {Promise<Object>} Parsed JSON response from LLM
 */
export async function generateComplianceReport(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please set it in your .env file.");
  }

  try {
    // Combine system instruction with user prompt
    const fullPrompt = `You are a compliance report generator. Always return valid JSON only, no additional text or markdown formatting.

${prompt}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content received from Gemini API");
    }

    // Parse JSON response
    let parsed;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", content);
      throw new Error(`Failed to parse Gemini response as JSON: ${parseError.message}`);
    }

    return parsed;
  } catch (error) {
    if (error.message.includes("GEMINI_API_KEY")) {
      throw error;
    }
    console.error("LLM generation error:", error);
    throw new Error(`Failed to generate compliance report: ${error.message}`);
  }
}
