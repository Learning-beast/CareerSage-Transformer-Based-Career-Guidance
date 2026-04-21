import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getJobRecommendations,
  JobRecommendation
} from "../services/gemini"
import type { CareerRec, SkillGapResult } from "../services/gemini"
import { apiPost } from "../services/api"

type JobResultsProps = {
  userProfile: any
  careerRecommendations: CareerRec[]
  skillGapResults: SkillGapResult[]
  onBack: () => void
}

export default function JobResults({
  userProfile,
  careerRecommendations,
  skillGapResults,
  onBack
}: JobResultsProps) {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionSaved, setSessionSaved] = useState(false)

  // =========================
  // Fetch Jobs
  // =========================
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        setError(null)

        const result = await getJobRecommendations(
          userProfile,
          careerRecommendations,
          skillGapResults
        )

        setJobs(result)
      } catch (err: any) {
        console.error("❌ Error fetching jobs:", err)
        setError("Failed to fetch job recommendations. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (careerRecommendations.length > 0 && skillGapResults.length > 0) {
      fetchJobs()
    }
  }, [userProfile, careerRecommendations, skillGapResults])

  // =========================
  // Save Session (ONLY ONCE)
  // =========================
  useEffect(() => {
    async function saveSession() {
      try {
        await apiPost("/api/career/session", {
          userProfile,
          recommendations: careerRecommendations,
          skillGapResults,
          jobResults: jobs
        })

        setSessionSaved(true)
      } catch (err) {
        console.error("❌ Failed to save session:", err)
      }
    }

    if (jobs.length > 0 && !sessionSaved) {
      saveSession()
    }
  }, [jobs, sessionSaved, userProfile, careerRecommendations, skillGapResults])

  // =========================
  // UI STATES
  // =========================
  if (loading)
    return (
      <div className="text-center p-8 text-gray-600">
        🔍 Fetching real-time job & internship matches...
      </div>
    )

  if (error)
    return (
      <div className="text-red-600 text-center p-6 bg-red-50 rounded-lg">
        {error}
      </div>
    )

  if (jobs.length === 0)
    return (
      <div className="text-center text-gray-500 p-8">
        No job recommendations yet.
        <div className="mt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ⬅ Back to Skill Gap Analysis
          </button>
        </div>
      </div>
    )

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-700">
          🎯 AI-Powered Job & Internship Matches
        </h2>

        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ⬅ Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      {sessionSaved && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg">
          ✅ Session saved successfully! Progress updated.
        </div>
      )}

      {jobs.map((career, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-2xl shadow-sm bg-white p-5"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {career.career_title}
          </h3>

          {career.job_listings?.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {career.job_listings.map((job, jIdx) => (
                <div
                  key={jIdx}
                  className="border border-gray-100 p-4 rounded-xl hover:shadow-md transition"
                >
                  <p className="text-lg font-semibold text-gray-700">
                    {job.job_title}
                  </p>
                  <p className="text-gray-600">{job.company_name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    💰 <strong>{job.salary_range || "N/A"}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    📊 Skill Match:{" "}
                    <strong>{job.skill_match_score || "—"}</strong>
                  </p>
                  <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    🔗 Apply Here
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No listings found for this role.</p>
          )}
        </div>
      ))}
    </div>
  )
}