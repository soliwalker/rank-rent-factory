
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessPlan, Language, LogEntry } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to create logs
const createLog = (message: string, type: LogEntry['type'] = 'info'): LogEntry => ({
  timestamp: new Date().toLocaleTimeString(),
  message,
  type
});

const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    location: { type: Type.STRING },
    niche: { type: Type.STRING },
    language: { type: Type.STRING, enum: ["en", "it", "es", "fr", "de"] },
    executiveSummary: { type: Type.STRING, description: "A punchy, direct-response style paragraph summarizing why this is a money-making opportunity." },
    gmbAnalysis: {
      type: Type.OBJECT,
      properties: {
        primaryCategory: { type: Type.STRING },
        secondaryCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["primaryCategory", "secondaryCategories"],
    },
    geoGridStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["Neighborhood", "Suburb", "District"] },
          targetValue: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["name", "type", "targetValue"],
      },
    },
    competitorAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          weakness: { type: Type.STRING, description: "The primary complaint found in 1-star reviews." },
          contentGap: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords/Services they are failing to target." },
        },
        required: ["name", "weakness", "contentGap"],
      },
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          avgMonthlySearches: { type: Type.NUMBER },
          competition: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          cpcLow: { type: Type.NUMBER },
          cpcHigh: { type: Type.NUMBER },
        },
        required: ["keyword", "avgMonthlySearches", "competition", "cpcLow", "cpcHigh"],
      },
    },
    domainStrategy: {
      type: Type.OBJECT,
      properties: {
        selectedDomain: { type: Type.STRING },
        domainType: { type: Type.STRING },
        alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        rationale: { type: Type.STRING },
      },
      required: ["selectedDomain", "domainType", "alternatives", "rationale"],
    },
    leadFunnel: {
      type: Type.OBJECT,
      properties: {
        strategy: { type: Type.STRING },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              rationale: { type: Type.STRING },
            },
            required: ["question", "options", "rationale"],
          },
        },
      },
      required: ["strategy", "questions"],
    },
    websiteStructure: {
      type: Type.OBJECT,
      properties: {
        strategy: { type: Type.STRING },
        serviceSilos: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pageTitle: { type: Type.STRING },
              urlSlug: { type: Type.STRING },
              targetKeyword: { type: Type.STRING },
              contentFocus: { type: Type.STRING },
            },
            required: ["pageTitle", "urlSlug", "targetKeyword", "contentFocus"],
          },
        },
      },
      required: ["strategy", "serviceSilos"],
    },
    googleAdsPlan: {
      type: Type.OBJECT,
      properties: {
        adGroups: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              targetKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
        },
        exampleAd: {
          type: Type.OBJECT,
          properties: {
            headline1: { type: Type.STRING },
            headline2: { type: Type.STRING },
            description: { type: Type.STRING },
          },
        },
      },
      required: ["adGroups", "exampleAd"],
    },
    profitProjection: {
      type: Type.OBJECT,
      properties: {
        estimatedAdSpend: { type: Type.NUMBER },
        targetSalePricePerLead: { type: Type.NUMBER },
        totalPotentialRevenue: { type: Type.NUMBER },
        netProfit: { type: Type.NUMBER },
        leadsCount: { type: Type.NUMBER },
      },
      required: ["estimatedAdSpend", "targetSalePricePerLead", "totalPotentialRevenue", "netProfit", "leadsCount"],
    },
    astroStack: {
      type: Type.OBJECT,
      properties: {
        framework: { type: Type.STRING },
        styling: { type: Type.STRING },
        deployment: { type: Type.STRING },
        cms: { type: Type.STRING },
        templateRepo: { type: Type.STRING },
        rationale: { type: Type.STRING },
      },
      required: ["framework", "styling", "deployment", "cms", "templateRepo", "rationale"],
    },
    siteAssets: {
      type: Type.ARRAY,
      description: "The complete source code for the Astro project.",
      items: {
        type: Type.OBJECT,
        properties: {
          path: { type: Type.STRING, description: "e.g. src/pages/index.astro" },
          content: { type: Type.STRING },
          language: { type: Type.STRING, enum: ["typescript", "markdown", "json", "html", "css"] },
          description: { type: Type.STRING }
        },
        required: ["path", "content", "language", "description"]
      }
    }
  },
  required: [
    "location",
    "niche",
    "language",
    "executiveSummary",
    "gmbAnalysis",
    "geoGridStrategy",
    "competitorAnalysis",
    "keywords",
    "domainStrategy",
    "leadFunnel",
    "websiteStructure",
    "googleAdsPlan",
    "profitProjection",
    "astroStack",
    "siteAssets"
  ],
};

// STAGE 1: Live Reconnaissance (Using Google Maps Tool)
const performLiveRecon = async (location: string, niche: string, onLog: (log: LogEntry) => void): Promise<string> => {
  onLog(createLog(`Initializing Map Recon for: ${niche} in ${location}`, 'info'));
  
  const prompt = `
    I am researching the local market for "${niche}" in "${location}".
    
    Please use Google Maps to find the following REAL data:
    1. List the Top 3 existing competitors for ${niche} in ${location}. Include their names and their star ratings if available.
    2. List 6 specific neighborhoods, suburbs, or districts within or immediately surrounding ${location} that appear to be residential or commercial hubs.
    
    Just list the facts.
  `;

  try {
    onLog(createLog('Querying Google Maps API...', 'info'));
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    onLog(createLog('Map Data Received. Extracted Neighbors & Competitors.', 'success'));
    return response.text || "Could not fetch live data.";
  } catch (e) {
    onLog(createLog('Recon API Failed. Falling back to simulation.', 'warning'));
    console.error("Recon Error:", e);
    return "Simulated data fallback due to API error.";
  }
};

// STAGE 2: Blueprint Synthesis (JSON Generation)
export const generateBusinessPlan = async (
  location: string, 
  niche: string, 
  language: Language,
  onLog: (log: LogEntry) => void
): Promise<BusinessPlan> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // 1. Execute Live Recon
  const reconData = await performLiveRecon(location, niche, onLog);
  
  onLog(createLog(`Analyzing Competitor Weaknesses from data...`, 'info'));
  onLog(createLog(`Calculating "Money" Keywords for ${language} market...`, 'info'));

  // 2. Generate Plan using Recon Data
  const systemPrompt = `
    You are the Chief Technology Officer of 'Jack Industries', an elite PPL Agency.
    Your task is to generate a complete deployment bundle for a Rank & Rent website.
    
    TARGET LANGUAGE: ${language.toUpperCase()}
    (ALL site content, labels, button text, and ad copy MUST be in ${language.toUpperCase()})

    INPUT DATA (REAL-TIME INTELLIGENCE):
    ${reconData}
    
    DESIGN SYSTEM ("The ProntoPro Clone"):
    - Clean, white background, trust-heavy design.
    - Hero section: "Find the best [Niche] in [Location]".
    - Action-oriented: "Request Quote" (Richiedi Preventivo / Solicitar Presupuesto).
    - Tailwind Colors: Emerald-600 (Primary), Slate-900 (Text).

    FILES TO GENERATE (In 'siteAssets'):
    
    1. **src/data/siteData.ts**:
       - Export const SITE_DATA.
       - Include: title, description, phone, email, city, niche.
       - Include: "locations" array containing the GeoGrid points found in Input Data.
    
    2. **src/data/questions.ts**:
       - Export const QUESTIONS array.
       - The multi-step funnel questions based on the Niche.
       - Fields: id, question, type (radio/text), options[].
    
    3. **src/layouts/Layout.astro**:
       - A beautiful, SEO-optimized layout.
       - Include a sticky Header with "Call Now" button.
       - Include a clean Footer.

    4. **src/pages/index.astro**:
       - The High-Converting Homepage.
       - Hero Section with Form.
       - "How it works" section.
       - "Service Areas" grid (mapping through locations).
       - Testimonials (Fake/Placeholder but realistic).
       - IMPORTANT: Import LeadForm from '../components/LeadForm'. Use client:load directive (e.g., <LeadForm client:load />).

    5. **src/components/LeadForm.tsx**:
       - A React component (interactive).
       - Multi-step wizard.
       - Progress bar.
       - Smooth transitions.
       - On submit, console.log the lead (ready for backend integration).

    6. **package.json**:
       - MUST include dependencies: "astro", "react", "react-dom", "@astrojs/react", "@astrojs/tailwind", "tailwindcss".
       - Ensure correct versions for Astro v4+.

    7. **tailwind.config.mjs**:
       - Standard config.

    8. **astro.config.mjs**:
       - CRITICAL: This file is required to render React components.
       - Code must import { defineConfig } from 'astro/config';
       - Import react from '@astrojs/react';
       - Import tailwind from '@astrojs/tailwind';
       - export default defineConfig({ integrations: [react(), tailwind()] });

    Tone: Ruthless efficiency. High conversion.
    Return ONLY JSON.
  `;

  const userPrompt = `Target Location: ${location}
  Target Niche: ${niche}
  Language: ${language}
  
  Generate the Deployment Bundle.`;

  onLog(createLog('Synthesizing Master Blueprint...', 'info'));
  onLog(createLog('Generating Astro/React "ProntoPro" Clone Template...', 'info'));
  onLog(createLog('Writing Localized Content in ' + language.toUpperCase() + '...', 'info'));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }, { text: userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    onLog(createLog('Blueprint Generation Complete.', 'success'));
    return JSON.parse(text) as BusinessPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    onLog(createLog('CRITICAL FAILURE in Synthesis Engine.', 'error'));
    throw error;
  }
};
