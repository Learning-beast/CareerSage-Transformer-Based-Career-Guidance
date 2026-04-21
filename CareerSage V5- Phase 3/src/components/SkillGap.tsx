import React, { useState } from "react"
import type { SkillGapResult } from "../services/gemini"
import { getSkillGapAnalysis } from "../services/gemini"
import type { CareerRec } from "../services/gemini"

type SkillGapProps = {
  userSkills: string[]
  careerRecommendations: CareerRec[]
  userProfile: any
  onBack: () => void
  onShowJobs: (
    skillGapResults: SkillGapResult[],
    careerRecommendations: CareerRec[]
  ) => void
}

export default function SkillGap({
  userSkills,
  careerRecommendations,
  userProfile,
  onBack,
  onShowJobs
}: SkillGapProps) {
  const [results, setResults] = useState<SkillGapResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    try {
      setLoading(true)
      setError(null)
      const res = await getSkillGapAnalysis(userSkills, careerRecommendations)
      setResults(res)
    } catch (err: any) {
      console.error("❌ Skill gap error:", err)
      setError("Failed to analyze skills. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleFindJobs() {
    if (results.length === 0) {
      alert("Please run the skill gap analysis first.")
      return
    }
    onShowJobs(results, careerRecommendations)
  }

  return (
    <div className="p-6">
      {/* Header + Back button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          📊 Skill Gap Analysis
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ⬅ Back to Career Recommendations
        </button>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Run Skill Gap Analysis"}
      </button>

      {/* Error Handling */}
      {error && (
        <div className="text-red-600 mt-4 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-8">
          {results.map((r, i) => (
            <div
              key={i}
              className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {r.career_title}
              </h3>
              <p className="text-gray-600 mb-3">{r.description}</p>

              <p className="font-semibold text-green-700 mb-1">
                ✅ Skills you already have:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-3">
                {r.skills_already_possessed.length > 0
                  ? r.skills_already_possessed.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))
                  : "None"}
              </ul>

              <p className="font-semibold text-red-700 mb-1">
                ❌ Skills you need to learn:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                {r.skills_missing.length > 0
                  ? r.skills_missing.map((s, idx) => <li key={idx}>{s}</li>)
                  : "None"}
              </ul>
            </div>
          ))}

          {/* Phase 4 Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleFindJobs}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              🔍 Find Jobs & Internships
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
