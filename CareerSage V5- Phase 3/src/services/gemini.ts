/**
 * src/services/gemini.ts
 *
 * Client-side helper: talks to your local backend proxy,
 * which handles Google Gemini API requests.
 */

// ========================================================
// TYPES
// ========================================================
type FormPayload = {
  personal: {
    firstName: string
    lastName: string
    email: string
    education?: string
    experienceYears?: number
  }
  skills: string[]
  interests: string[]
}

export type CareerRec = {
  career_title: string
  description: string
  reason: string
  confidence?: number
  required_skills?: string[]
}

export type SkillResource = {
  name: string
  platform: string
  link: string
  level?: string
  duration?: string
  notes?: string
}

export type SkillMatch = {
  skill: string
  selected_resources: SkillResource[]
}

export type SkillGapResult = {
  career_title: string
  description: string
  skills_already_possessed: string[]
  skills_missing: string[]
  skill_match: SkillMatch[]
}

// ========================================================
// PHASE 2 – CAREER RECOMMENDATIONS
// ========================================================
export async function getCareerRecommendations(
  form: FormPayload
): Promise<CareerRec[]> {
  const url = "http://localhost:3001/api/recommend"

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userProfile: form })
  })

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "<no body>")
    throw new Error(`Backend error: ${resp.status} ${resp.statusText} - ${txt}`)
  }

  const data = await resp.json()
  const recsArray = Array.isArray(data.recommendations)
    ? data.recommendations
    : []

  return recsArray.slice(0, 3).map((r: any) => ({
    career_title: r.career_title || r.title || "Unknown",
    description: r.description || "",
    reason: r.reason || "",
    confidence: typeof r.confidence === "number" ? r.confidence : undefined,
    required_skills: Array.isArray(r.required_skills)
      ? r.required_skills
      : []
  }))
}

// ========================================================
// PHASE 3 – SKILL GAP ANALYSIS
// ========================================================
export async function getSkillGapAnalysis(
  userSkills: string[],
  careerRecommendations: CareerRec[]
): Promise<SkillGapResult[]> {
  const url = "http://localhost:3001/api/skillgap"

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userSkills, careerRecommendations })
  })

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "<no body>")
    throw new Error(
      `Skill Gap API error: ${resp.status} ${resp.statusText} - ${txt}`
    )
  }

  const data = await resp.json()
  return Array.isArray(data) ? (data as SkillGapResult[]) : []
}

// ========================================================
// PHASE 4 – JOB & INTERNSHIP RECOMMENDATIONS
// ========================================================
export type JobListing = {
  job_title: string
  company_name: string
  salary_range: string
  skill_match_score: string
  apply_link: string
}

export type JobRecommendation = {
  career_title: string
  job_listings: JobListing[]
}

/**
 * getJobRecommendations
 *
 * Calls backend /api/jobs
 * Input: user profile + previous AI results (careers + skill gaps)
 * Output: plausible-looking jobs/internships
 */
export async function getJobRecommendations(
  userProfile: FormPayload,
  careerRecommendations: CareerRec[],
  skillGapResults: SkillGapResult[]
): Promise<JobRecommendation[]> {
  const url = "http://localhost:3001/api/jobs"

  const body = {
    userProfile,
    careerRecommendations,
    skillGapResults
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "<no body>")
    throw new Error(
      `Job API error: ${resp.status} ${resp.statusText} - ${txt}`
    )
  }

  const data = await resp.json()
  const arr = Array.isArray(data) ? data : []
  return arr as JobRecommendation[]
}
