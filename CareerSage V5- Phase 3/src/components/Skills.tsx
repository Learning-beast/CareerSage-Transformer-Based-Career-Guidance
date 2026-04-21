import React, { useState } from 'react'
import { useForm } from '../context/FormContext'

export default function SkillsForm({ onPrev, onNext }: { onPrev: () => void, onNext: () => void }) {
  const { state, setSkills } = useForm()
  const [input, setInput] = useState('')
  const [skills, setLocalSkills] = useState<string[]>(state.skills || [])

  const addSkill = () => {
    const s = input.trim()
    if (!s) return
    if (skills.includes(s)) {
      setInput('')
      return
    }
    const newSkills = [...skills, s]
    setLocalSkills(newSkills)
    setInput('')
  }

  const removeSkill = (s: string) => {
    const newSkills = skills.filter(x => x !== s)
    setLocalSkills(newSkills)
  }

  const goNext = () => {
    setSkills(skills)
    onNext()
  }

  return (
    <div className="form-step">
      <div className="field">
        <label>Add a skill (press Add)</label>
        <div style={{display:'flex',gap:8}}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., Python" />
          <button type="button" onClick={addSkill}>Add</button>
        </div>
      </div>

      <div className="field">
        <label>Skills added</label>
        <ul className="list">
          {skills.map(s => <li key={s} className="small">{s} <button className="secondary" style={{marginLeft:8}} onClick={() => removeSkill(s)}>remove</button></li>)}
        </ul>
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button className="secondary" onClick={onPrev}>Previous</button>
        <button onClick={goNext}>Next</button>
      </div>
    </div>
  )
}
