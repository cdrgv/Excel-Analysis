// Purpose: call Groq LLM to produce natural-language insights from a compact dataset summary.

import Groq from "groq-sdk";


/**
 * Generate AI insights from a summarized dataset
 * We keep prompts deterministic and concise to reduce cost/latency.
 * @param {object} summary - compact stats per column (numeric & categorical)
 * @returns {Promise<string>} - human-readable insights
*/
export const getAIInsights = async (summary, xAxis, yAxis, chartType) => {

    // Initialize Groq client with API key from .env
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY, // must be set
    });

    let extraContext = "";
    if (xAxis && yAxis) {
        extraContext = `\nThe user is currently looking at a ${chartType || "graph"} with "${xAxis}" on the X-axis and "${yAxis}" on the Y-axis. Please specifically describe the relationship and trends between these two columns as they would appear in a ${chartType || "graph"}.`;
    }

    const prompt = `
You are a senior data analyst.
Analyze the following dataset summary and produce:
1) ${xAxis && yAxis ? `A detailed description of the relationship between "${xAxis}" and "${yAxis}" in the context of a ${chartType || "graph"}` : "3–6 key trends or patterns"}
2) any anomalies/outliers
3) 2–4 suggested chart types (and which columns to use)
${extraContext}
Be concise, bullet-pointed, and avoid jargon. If data looks insufficient, say so.

Dataset summary (JSON):
${JSON.stringify(summary, null, 2)}`.trim();

    // Groq model names evolve; the fast/free-friendly options typically include an 8B instruct model.
    // "llama-3.1-8b-instant" is a good balance for speed & cost.
    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
    });

    return completion.choices?.[0]?.message?.content?.trim() || "";
};