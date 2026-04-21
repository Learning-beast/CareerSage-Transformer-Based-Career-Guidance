import React, { useEffect, useState } from 'react'
import type { CareerRec } from '../services/gemini'
import { getCareerRecommendations } from '../services/gemini'
import { useForm } from '../context/FormContext'

interface CareerRecommendationsProps {
  onBack: () => void
  onNext?: (skills: string[], recs: CareerRec[]) => void // optional, for next phase navigation
}

export default function CareerRecommendations({ onBack, onNext }: CareerRecommendationsProps) {
  const { state } = useForm()
  const [loading, setLoading] = useState(false)
  const [recs, setRecs] = useState<CareerRec[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      if (loading) return
      setLoading(true)
      setError(null)
      try {
        const results = await getCareerRecommendations(state)
        setRecs(results)
      } catch (e: any) {
        setError(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, []) // run once on mount

  return (
    <div style={{ marginTop: 12 }}>
      <h2>Career Recommendations</h2>
      {loading && <div className="small">Loading recommendations from Gemini...</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {recs && (
        <div>
          {recs.map((r, idx) => (
            <div key={idx} className="review-item">
              <strong>{r.career_title}</strong>
              <div className="small">{r.description}</div>
              <div className="small" style={{ marginTop: 6 }}>
                <em>Why this fits:</em> {r.reason}
              </div>
              {typeof r.confidence === 'number' && (
                <div className="small">
                  Confidence: {Math.round(r.confidence * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="secondary" onClick={onBack} disabled={loading}>
          Back
        </button>

        {/* ✅ Only show "Next" if onNext prop exists */}
        {onNext && recs && (
          <button
            onClick={() => onNext(state.skills, recs)}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            Next → Skill Gap Analysis
          </button>
        )}
      </div>
    </div>
  )
}
