import React from 'react'
import { useForm } from '../context/FormContext'

export default function Review({ onPrev, onGenerate }: { onPrev: () => void, onGenerate: () => void }) {
  const { state, reset } = useForm()

  return (
    <div className="form-step">
      <h3>Review & Confirm</h3>
      <div className="review-item">
        <strong>Personal</strong>
        <div className="small">{state.personal.firstName} {state.personal.lastName} — {state.personal.email}</div>
        <div className="small">Education: {state.personal.education} | Experience: {state.personal.experienceYears} years</div>
      </div>

      <div className="review-item">
        <strong>Skills</strong>
        <ul className="list">
          {state.skills.length ? state.skills.map(s => <li key={s}>{s}</li>) : <li className="small">No skills added</li>}
        </ul>
      </div>

      <div className="review-item">
        <strong>Interests</strong>
        <ul className="list">
          {state.interests.length ? state.interests.map(i => <li key={i}>{i}</li>) : <li className="small">No interests added</li>}
        </ul>
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button className="secondary" onClick={onPrev}>Previous</button>
        <button onClick={() => { reset(); alert('Form confirmed — later you can wire this to the backend or Gemini Pro API'); }}>Confirm & Submit</button>
        <button onClick={onGenerate} style={{marginLeft:8}}>Get Career Recommendations</button>
      </div>
    </div>
  )
}
