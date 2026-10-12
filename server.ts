import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client lazily or safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "Saniaj Furniture Calculator" });
});

// AI Material & Calculation Suggestion Endpoint
app.post("/api/gemini/suggest", async (req, res) => {
  try {
    const { furnitureType, dimensions, projectDescription, customNote } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
        success: true,
        isFallback: true,
        suggestion: {
          recommendedPlywoodThickness: "18mm BWR Grade for main structure, 6mm for back panel",
          recommendedLaminateThickness: "1.0mm SF for exterior, 0.8mm Liner for interior",
          estimatedPlywoodSheets: Math.max(1, Math.ceil((dimensions?.width || 4) * (dimensions?.height || 7) / 32)),
          estimatedLaminateSheets: Math.max(1, Math.ceil((dimensions?.width || 4) * (dimensions?.height || 7) / 32 * 1.5)),
          hardwareList: [
            { name: "Auto Soft Close Hinges", quantity: 6, unit: "pairs" },
            { name: "Telescopic Drawer Channels 18\"", quantity: 2, unit: "sets" },
            { name: "PVC Edge Banding Tape 22mm", quantity: 50, unit: "meters" },
            { name: "Fevicol SH Adhesive", quantity: 2, unit: "kg" },
            { name: "Handles 6 inch", quantity: 4, unit: "pcs" },
          ],
          tips: "Ensure 8% to 10% wastage margin for corner cuttings and grain alignment."
        }
      });
    }

    const prompt = `You are an expert master carpenter and furniture material estimator for Indian and international woodworking standard projects.
Analyze the following furniture requirement and return a JSON object with estimation and hardware recommendations:
Furniture Type: ${furnitureType}
Dimensions: Height=${dimensions?.height} ${dimensions?.unit || 'ft'}, Width=${dimensions?.width} ${dimensions?.unit || 'ft'}, Depth=${dimensions?.depth || 2} ${dimensions?.unit || 'ft'}
Description: ${projectDescription || 'Standard finish'}
Notes: ${customNote || 'None'}

Return ONLY raw JSON with these exact keys:
{
  "recommendedPlywoodThickness": "string describing body and back panel thickness",
  "recommendedLaminateThickness": "string describing outer and inner laminate",
  "estimatedPlywoodSheets": number (integer estimate of 8x4 sheets),
  "estimatedLaminateSheets": number (integer estimate of 8x4 sheets),
  "hardwareList": [
    {"name": "string", "quantity": number, "unit": "string"}
  ],
  "tips": "string containing expert advice on cutting, adhesive, or edge banding"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText);

    res.json({
      success: true,
      suggestion: parsed
    });
  } catch (error: any) {
    console.error("Gemini Suggest Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI suggestion"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Saniaj Furniture Calculator server running on http://localhost:${PORT}`);
  });
}

startServer();
