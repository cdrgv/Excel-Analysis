// Purpose: parse uploaded Excel, build a compact summary, call Groq, return insights.

import fs from "fs";
import xlsx from "xlsx";
import { getAIInsights } from "../services/aiInsightsService.js";

/**
 * Heuristic helpers
 */
const isNumeric = (v) => {
    if (typeof v === "number" && Number.isFinite(v)) return true;
    const n = Number(String(v).toString().replace(/,/g, ""));
    return Number.isFinite(n);
};

const toNumber = (v) => {
    if (typeof v === "number") return v;
    const n = Number(String(v).toString().replace(/,/g, ""));
    return Number.isFinite(n) ? n : NaN;
};

/**
 * Build a compact summary of the dataset:
 * - For numeric columns: count, min, max, mean (fast stats)
 * - For categorical: count, top 5 values
 * We also sample rows if the sheet is huge to keep payload small.
 */
const summarizeExcelData = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return { columns: {}, rows: 0 };

    // Sample up to 1,000 rows to keep token use low when calling the LLM
    const SAMPLE_SIZE = 1000;
    const data = rows.slice(0, SAMPLE_SIZE);

    const headers = Object.keys(data[0] || {});
    const summary = { rows: rows.length, sampledRows: data.length, columns: {} };

    for (const header of headers) {
        const colValues = data
            .map((r) => r[header])
            .filter((v) => v !== null && v !== undefined && String(v).trim() !== "");

        if (colValues.length === 0) continue;

        // Decide numeric vs categorical by sampling a few values
        const sampleForType = colValues.slice(0, 25);
        const numericVotes = sampleForType.filter((v) => isNumeric(v)).length;
        const isMostlyNumeric = numericVotes / sampleForType.length >= 0.7;

        if (isMostlyNumeric) {
            const nums = colValues.map(toNumber).filter((n) => !Number.isNaN(n));
            if (nums.length === 0) continue;

            const count = nums.length;
            const min = Math.min(...nums);
            const max = Math.max(...nums);
            const mean = nums.reduce((a, b) => a + b, 0) / count;

            summary.columns[header] = {
                type: "numeric",
                count,
                min,
                max,
                mean: Number(mean.toFixed(4)),
                // simple outlier heuristic (z-score approx on sample)
                sampleStd:
                    nums.length > 1
                        ? Math.sqrt(
                            nums
                                .map((x) => (x - mean) ** 2)
                                .reduce((a, b) => a + b, 0) / (nums.length - 1)
                        )
                        : 0,
            };
        } else {
            // categorical
            const counts = new Map();
            for (const v of colValues) {
                const key = String(v).trim();
                counts.set(key, (counts.get(key) || 0) + 1);
            }
            const topValues = Array.from(counts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            summary.columns[header] = {
                type: "categorical",
                count: colValues.length,
                distinct: counts.size,
                topValues, // [ [value, freq], ... ]
            };
        }
    }

    return summary;
};

/**
 * POST /api/analyze-ai
 * Form-Data: file=<.xls/.xlsx>
 */
export const analyzeExcelWithAI = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    try {
        console.log("Starting AI analysis for file:", file.filename);
        // 1) Read Excel (first sheet)
        const workbook = xlsx.readFile(file.path, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        console.log("Excel parsed, rows:", jsonData.length);

        // 2) Summarize compactly
        const summary = summarizeExcelData(jsonData);
        console.log("Summary generated");

        // 3) Ask Groq for insights
        console.log("Calling Groq API...");
        const { xAxis, yAxis, chartType } = req.body;
        const insights = await getAIInsights(summary, xAxis, yAxis, chartType);
        console.log("Groq insights received");

        // 4) Return both (UI can render both)
        return res.json({ summary, insights });
    } catch (err) {
        console.error("AI analyze error:", err);
        return res.status(500).json({ error: "Failed to analyze Excel file" });
    } finally {
        // Cleanup temp upload
        try {
            if (file && file.path) {
                fs.unlink(file.path, () => { });
            }
        } catch { }
    }
};