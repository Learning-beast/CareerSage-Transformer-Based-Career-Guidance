// =======================
//  IMPORTS & SETUP
// =======================
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


//auth route import added 👇
import authRoutes from "./routes/auth.routes.js";

//test route import added 👇
import testRoutes from "./routes/test.routes.js";

import protectedRoutes from "./routes/protected.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import careerRoutes from "./routes/career.routes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the current directory
dotenv.config({ path: path.join(__dirname, ".env") });

// Manual fallback if dotenv fails
if (!process.env.GEMINI_API_KEY) {
  try {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
      console.log("⚠️ Loaded .env manually");
    }
  } catch (e) {
    console.error("❌ Failed to manually load .env", e);
  }
}

console.log("📂 Current Directory:", process.cwd());
console.log("📄 .env Path:", path.join(__dirname, ".env"));
console.log("🔑 GEMINI_API_KEY =", process.env.GEMINI_API_KEY ? "Loaded (Starts with " + process.env.GEMINI_API_KEY.substring(0, 5) + ")" : "undefined");

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { GoogleGenerativeAI } from "@google/generative-ai";

// MongoDB
import connectDB from "./config/db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());



// =======================
//  CONNECT MONGODB (SAFE)
// =======================
connectDB();

// =======================
//  GEMINI INITIALIZATION
// =======================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//auth route mount added 👇
app.use("/api/auth", authRoutes);

//test route mount added 👇
app.use("/api", testRoutes);

app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/career", careerRoutes);

// =======================
//  HELPER FUNCTIONS
// =======================
async function safeGenerateContent(model, prompt, retries = 3, delayMs = 4000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (err) {
      const status = err?.status;
      if ((status === 429 || status === 503) && attempt < retries) {
        const wait =
          parseFloat(err?.errorDetails?.[2]?.retryDelay?.replace("s", "")) *
            1000 || delayMs;
        console.warn(
          `⚠️ Gemini overloaded (status ${status}). Retrying in ${
            wait / 1000
          }s... [Attempt ${attempt}/${retries}]`
        );
        await new Promise((r) => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
  }
}

// ✅ Improved JSON extractor (handles markdown, stray text, commas, etc.)
function extractJSONFromResponse(result) {
  try {
    let text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result?.responses?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "{}";

    // Remove markdown formatting or code fences
    text = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

    // Find first valid JSON block ({...} or [...])
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!match) {
      console.warn("⚠️ No valid JSON detected in model response.");
      return {};
    }

    const possibleJson = match[1]
      .replace(/,\s*([\]}])/g, "$1") // remove trailing commas
      .replace(/[\u0000-\u001F]+/g, ""); // strip hidden control chars

    try {
      return JSON.parse(possibleJson);
    } catch (err) {
      console.warn("⚠️ JSON.parse failed; returning fallback empty object.");
      return {};
    }
  } catch (err) {
    console.error("❌ JSON extraction failed completely:", err);
    return {};
  }
}

// =======================
//  HEALTH CHECK (for testing)
// =======================
app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "Backend working" });
});

// =======================
//  PHASE 2 — AI Career Recommendations
// =======================
app.post("/api/recommend", async (req, res) => {
  try {
    const { userProfile } = req.body;
    console.log("🟢 /api/recommend invoked with userProfile:", userProfile);

    if (!userProfile) {
      return res.status(400).json({ error: "Missing userProfile" });
    }

    const prompt = `
You are an assistant that suggests 3–5 career paths for a user.
User profile:
${JSON.stringify(userProfile, null, 2)}

Return a JSON object with key "recommendations" containing an array of:
{
  "career_title": "...",
  "description": "...",
  "reason": "...",
  "required_skills": ["skill1","skill2","..."]
}
Only return valid JSON.
`;

    console.log("🧠 Sending prompt to Gemini...");
    const result = await safeGenerateContent(model, prompt);
    console.log("✅ Gemini raw result received.");

    const parsed = extractJSONFromResponse(result);
    console.log("📦 Parsed recommendations:", parsed);

    return res.json(parsed);
  } catch (err) {
    console.error("/api/recommend error:", err);
    return res.status(500).json({ error: "Recommendation failed" });
  }
});

// =======================
//  PHASE 3 — Skill Gap Analysis & Resource Mapping
// =======================
app.post("/api/skillgap", async (req, res) => {
  try {
    const { userSkills = [], careerRecommendations = [] } = req.body;

    const normalizedUserSkills = new Set(
      userSkills.map((s) => s.trim().toLowerCase())
    );

    const resourcesPath = path.join(process.cwd(),"resources.json");
    if (!fs.existsSync(resourcesPath)) {
      console.warn("resources.json not found at", resourcesPath);
      return res
        .status(500)
        .json({ error: "Resource dataset missing on server." });
    }

    const resourcesRaw = fs.readFileSync(resourcesPath, "utf8");
    const resourcesJson = JSON.parse(resourcesRaw);
    const resourcesBySkill = resourcesJson.skills || {};

    const computeSkillGap = (requiredSkills = []) => {
      const normalizedRequired = requiredSkills.map((s) => s.trim());
      const already = [];
      const missing = [];
      for (const r of normalizedRequired) {
        if (normalizedUserSkills.has(r.toLowerCase())) already.push(r);
        else missing.push(r);
      }
      return { already, missing };
    };

    const output = [];

    for (const career of careerRecommendations) {
      const required = career.required_skills || career.requiredSkills || [];
      const { already, missing } = computeSkillGap(required);

      const missingWithCandidates = [];
      for (const skill of missing) {
        let candidates =
          resourcesBySkill[skill] ||
          resourcesBySkill[skill.trim().toLowerCase()] ||
          [];

        if (!Array.isArray(candidates) || candidates.length === 0) {
          const lowerSkill = skill.trim().toLowerCase();
          const matchedKeys = Object.keys(resourcesBySkill).filter(
            (k) =>
              k.toLowerCase().includes(lowerSkill) ||
              lowerSkill.includes(k.toLowerCase())
          );
          candidates = matchedKeys.flatMap((k) => resourcesBySkill[k]);
        }

        missingWithCandidates.push({
          skill,
          candidates: Array.isArray(candidates) ? candidates : [],
        });
      }

      output.push({
        career_title: career.career_title || career.title || "Unknown",
        description: career.description || "",
        skills_already_possessed: already,
        skills_missing: missing,
        recommended_resources: missingWithCandidates,
      });
    }

    const promptPayload = output.map((item) => ({
      career_title: item.career_title,
      skills_missing: item.skills_missing,
      candidates: item.recommended_resources.map((mr) => ({
        skill: mr.skill,
        candidates: mr.candidates.slice(0, 6),
      })),
    }));

    if (
      promptPayload.length === 0 ||
      promptPayload.every((p) => p.skills_missing.length === 0)
    ) {
      console.warn("⚠️ [SkillGap] No missing skills found; skipping Gemini call.");
      return res.json(output);
    }

    console.log(
      "🧠 [SkillGap] Sending prompt to Gemini with",
      promptPayload.length,
      "career entries..."
    );

    let genResult;
    try {
      genResult = await safeGenerateContent(model, `
You are an assistant that, given a list of missing skills and a list of candidate free Indian learning resources
(from SWAYAM, NPTEL, DIKSHA), chooses up to 3 best resources per missing skill. Be concise and return only JSON.

Input (array):
${JSON.stringify(promptPayload, null, 2)}

For each career entry, return:
{
  "career_title": "...",
  "skill_match": [
    {
      "skill": "SQL",
      "selected_resources": [
         {"name": "...", "platform": "...", "link": "...", "level": "...", "duration": "...", "notes":"..."}
      ]
    }
  ]
}

Only return valid JSON (an array). Do not include commentary.
`);
      console.log("✅ [SkillGap] Gemini response received.");
    } catch (apiErr) {
      console.error("❌ [SkillGap] Gemini API call failed:", apiErr);
      return res.status(500).json({ error: "Gemini API call failed" });
    }

    const geminiParsed = extractJSONFromResponse(genResult);
    console.log("📦 [SkillGap] Parsed Gemini response.");

    const finalResponse = output.map((orig) => {
      const matched = (Array.isArray(geminiParsed) ? geminiParsed : []).find(
        (g) =>
          (g.career_title || "").toLowerCase() ===
          (orig.career_title || "").toLowerCase()
      );

      if (!matched || !Array.isArray(matched.skill_match)) {
        const fallbackSkillMatch = orig.recommended_resources.map((r) => ({
          skill: r.skill,
          selected_resources: (r.candidates || []).slice(0, 2),
        }));
        return {
          career_title: orig.career_title,
          description: orig.description,
          skills_already_possessed: orig.skills_already_possessed,
          skills_missing: orig.skills_missing,
          skill_match: fallbackSkillMatch,
        };
      }

      return {
        career_title: orig.career_title,
        description: orig.description,
        skills_already_possessed: orig.skills_already_possessed,
        skills_missing: orig.skills_missing,
        skill_match: matched.skill_match,
      };
    });

    return res.json(finalResponse);
  } catch (err) {
    console.error("/api/skillgap error:", err);
    return res.status(500).json({ error: "Skill gap analysis failed" });
  }
});

// =======================
//  PHASE 4 – JOBS & INTERNSHIPS
// =======================
app.post("/api/jobs", async (req, res) => {
  try {
    const { userProfile, careerRecommendations, skillGapResults } = req.body;

    if (!userProfile || !careerRecommendations || !skillGapResults) {
      return res.status(400).json({
        error:
          "Missing required inputs (userProfile, careerRecommendations, skillGapResults)",
      });
    }

    const prompt = `
You are an AI career assistant helping a student or professional find relevant jobs and internships.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Career Recommendations (from previous AI step):
${JSON.stringify(careerRecommendations, null, 2)}

Skill Gap Results:
${JSON.stringify(skillGapResults, null, 2)}

LOOK UP THE INTERNET for internship and job availability for these particular job roles.
Prefer looking up posts on LinkedIn, Naukri, AICTE, and Internshala.

Return a neat JSON array with each entry formatted as:
{
  "career_title": "...",
  "job_listings": [
    {
      "job_title": "...",
      "company_name": "...",
      "salary_range": "...",
      "skill_match_score": "90%",
      "apply_link": "https://..."
    }
  ]
}

Generate plausible and well-formatted examples (the links do not need to be valid).
Return ONLY valid JSON.
`;

    console.log("🧠 [Jobs] Sending combined prompt to Gemini...");
    const result = await safeGenerateContent(model, prompt);
    const parsed = extractJSONFromResponse(result);
    console.log("✅ [Jobs] Parsed result ready.");

    return res.json(parsed);
  } catch (err) {
    console.error("/api/jobs error:", err);
    res.status(500).json({ error: "Job recommendation failed" });
  }
});


// =======================
//  START SERVER
// =======================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
