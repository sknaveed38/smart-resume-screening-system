import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload limits high enough for resume uploads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Helper for lazy Gemini initialization to avoid crash if variable is not loaded immediately
  const getGeminiClient = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      throw new Error(
        "GEMINI_API_KEY is not configured in environment variables. Please click 'Settings' > 'Secrets' panel in the AI Studio interface and add your GEMINI_API_KEY."
      );
    }
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Define structured JSON schema for Gemini response
  const educationSchema = {
    type: Type.OBJECT,
    properties: {
      institution: { type: Type.STRING },
      degree: { type: Type.STRING },
      graduationYear: { type: Type.STRING }
    },
    required: ["institution", "degree", "graduationYear"]
  };

  const experienceSchema = {
    type: Type.OBJECT,
    properties: {
      company: { type: Type.STRING },
      role: { type: Type.STRING },
      duration: { type: Type.STRING },
      description: { type: Type.STRING }
    },
    required: ["company", "role", "duration", "description"]
  };

  const keywordMatchSchema = {
    type: Type.OBJECT,
    properties: {
      keyword: { type: Type.STRING },
      matched: { type: Type.BOOLEAN }
    },
    required: ["keyword", "matched"]
  };

  const radarMetricsSchema = {
    type: Type.OBJECT,
    properties: {
      technicalAlignment: { type: Type.INTEGER, description: "A score from 0 to 100 on how well technical hard skills align with requirements" },
      experienceDepth: { type: Type.INTEGER, description: "A score from 0 to 100 based on core professional experience duration and achievements" },
      domainKnowledge: { type: Type.INTEGER, description: "A score from 0 to 100 on domain relevance (e.g. fintech, SaaS, analytical NLP)" },
      softSkills: { type: Type.INTEGER, description: "A score from 0 to 100 on teamwork, write-up clarity, communication, or mentorship" },
      growthPotential: { type: Type.INTEGER, description: "A score from 0 to 100 on initiative, progressive promotions, and versatility" }
    },
    required: ["technicalAlignment", "experienceDepth", "domainKnowledge", "softSkills", "growthPotential"]
  };

  const screeningResultSchema = {
    type: Type.OBJECT,
    properties: {
      candidateName: { type: Type.STRING },
      email: { type: Type.STRING },
      phone: { type: Type.STRING },
      skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      education: { type: Type.ARRAY, items: educationSchema },
      experience: { type: Type.ARRAY, items: experienceSchema },
      overallScore: { type: Type.INTEGER, description: "Weighted screening score from 0 to 100 representing overall suitability for the JD" },
      fitLevel: { type: Type.STRING, enum: ["Very High", "High", "Medium", "Low"] },
      matchExplanation: { type: Type.STRING, description: "Brief executive explanation summarizing candidate's overall fit" },
      radarMetrics: radarMetricsSchema,
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      keywordMatch: { type: Type.ARRAY, items: keywordMatchSchema },
      customQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 highly customized and critical interview questions to probe technical gaps, resume weaknesses, or details" }
    },
    required: [
      "candidateName", "email", "phone", "skills", "education", "experience",
      "overallScore", "fitLevel", "matchExplanation", "radarMetrics",
      "strengths", "weaknesses", "keywordMatch", "customQuestions"
    ]
  };

  // API endpoints FIRST
  app.post("/api/screen-resume", async (req, res) => {
    try {
      const {
        resumeText,
        resumeBase64,
        resumeMimeType,
        jobTitle,
        jobDescription,
        requiredSkills
      } = req.body;

      if (!jobTitle || !jobDescription) {
        return res.status(400).json({ error: "Job description is required to perform resume screening" });
      }

      if (!resumeText && (!resumeBase64 || !resumeMimeType)) {
        return res.status(400).json({ error: "Please enter resume text or upload a valid resume file" });
      }

      const ai = getGeminiClient();

      // Build payload parts list
      interface PartItem {
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        }
      }

      const parts: PartItem[] = [];

      if (resumeText) {
        parts.push({ text: `Candidate Resume Text Extracted:\n${resumeText}` });
      }

      if (resumeBase64 && resumeMimeType) {
        parts.push({
          inlineData: {
            mimeType: resumeMimeType,
            data: resumeBase64
          }
        });
      }

      // Append screening prompt
      const promptText = `
Role & Requirements:
- Job Title: ${jobTitle}
- Required Key Keywords/Skills: ${JSON.stringify(requiredSkills || [])}
- Full Job Description Details:
${jobDescription}

Instructions:
1. Conduct an extremely thorough resume evaluation. Ensure scoring is realistic: do not give perfect scores (e.g. >90) to obviously unqualified or entry-level resumes.
2. For each required/requested skill keyword in input, check if the candidate has exact or close synonyms mentioned in their resume, and map into 'keywordMatch'.
3. Formulate exactly 5 customized interview questions. Make these queries highly unique to this specific candidate. Avoid generic templates (e.g. "What is your greatest strength?"). Instead, ask about gaps (e.g., "While you have excellent React experience, you lack direct experience with PostgreSQL required by this position. Can you speak of. . .").
4. Complete all fields returned by the structured response parameters. Ensure to return names, emails, and phone numbers if available on the resume, or sensible fallback like "Not listed" if missing.
`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: {
          role: "user",
          parts: parts as any
        },
        config: {
          systemInstruction: "You are an expert recruitment intelligence system. Analyse candidates and output exact structural JSON as requested, with high accuracy, detail, and unbiased scoring metrics.",
          responseMimeType: "application/json",
          responseSchema: screeningResultSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Unable to receive structured response from AI model.");
      }

      const cleanedText = responseText.trim();
      const screeningResult = JSON.parse(cleanedText);

      return res.json({ result: screeningResult });
    } catch (error: any) {
      console.error("Screening failure: ", error);
      return res.status(500).json({ error: error.message || "Internal screening processing exception" });
    }
  });

  // Vite development vs production server static fallback handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Resume Screener server listening on http://localhost:${PORT}`);
  });
}

startServer();
