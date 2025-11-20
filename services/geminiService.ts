import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, VisualType } from "../types";

// Shim process for browser environment to satisfy TS and Runtime
declare const process: {
  env: {
    API_KEY: string;
  };
};

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeScript = async (scriptText: string): Promise<AnalysisResult> => {
  
  const prompt = `
    You are an expert Information Designer and Art Director. 
    Your task is to analyze the provided video script and transform it into a set of stunning, data-rich visual cards.

    **Process**:
    1. **Segment**: Break the script into logical scenes.
    2. **Visualize**: Choose the best chart type for the data.
    3. **Design**: 
       - Select a **visualSymbol** that best represents the topic (e.g., use 'money' for finance, 'users' for growth).
       - Select a **colorTheme** based on the emotion/topic (e.g., 'emerald' for money/success, 'rose' for alerts/errors, 'indigo' for tech/general).

    **Available Options**:
    - Types: 'BAR_CHART', 'PIE_CHART', 'LINE_CHART', 'STAT_CARD', 'PROCESS_FLOW', 'KEY_POINTS'.
    - Symbols: 'trend_up', 'trend_down', 'users', 'money', 'target', 'time', 'list', 'check', 'global', 'product', 'chart', 'idea'.
    - Themes: 'indigo' (Tech/Trust), 'emerald' (Money/Growth), 'rose' (Urgent/Decline), 'amber' (Warning/Highlight), 'cyan' (Future/Clean).

    **Data Extraction**: 
    - Extract precise numbers for charts. 
    - For 'PROCESS_FLOW', steps are labels. 
    - For 'KEY_POINTS', bullet points are labels.

    The script is:
    "${scriptText}"
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the visualization board" },
          summary: { type: Type.STRING, description: "A one-sentence summary of the script" },
          cards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                scriptSegment: { type: Type.STRING },
                type: { 
                  type: Type.STRING, 
                  enum: [
                    VisualType.BAR_CHART, 
                    VisualType.PIE_CHART, 
                    VisualType.LINE_CHART, 
                    VisualType.STAT_CARD, 
                    VisualType.PROCESS_FLOW, 
                    VisualType.KEY_POINTS
                  ] 
                },
                visualSymbol: {
                  type: Type.STRING,
                  description: "Icon name from allowed list",
                  enum: ['trend_up', 'trend_down', 'users', 'money', 'target', 'time', 'list', 'check', 'global', 'product', 'chart', 'idea']
                },
                colorTheme: {
                  type: Type.STRING,
                  description: "Color theme name",
                  enum: ['indigo', 'emerald', 'rose', 'amber', 'cyan']
                },
                data: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                }
              },
              required: ["id", "title", "description", "type", "data", "scriptSegment", "visualSymbol", "colorTheme"]
            }
          }
        },
        required: ["title", "summary", "cards"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response received from Gemini");
  }

  try {
    const result = JSON.parse(response.text) as AnalysisResult;
    return result;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse analysis results");
  }
};
