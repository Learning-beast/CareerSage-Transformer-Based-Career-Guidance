import React, { useState } from 'react'
import { useForm } from '../context/FormContext'

export default function InterestsForm({ onPrev, onNext }: { onPrev: () => void, onNext: () => void }) {
  const { state, setInterests } = useForm()
  const [input, setInput] = useState('')
  const [items, setItems] = useState<string[]>(state.interests || [])

  const add = () => {
    const v = input.trim()
    if (!v) return
    if (items.includes(v)) { setInput(''); return }
    setItems(i => [...i, v])
    setInput('')
  }
  const remove = (v: string) => setItems(i => i.filter(x => x !== v))
  const goNext = () => {
    setInterests(items)
    onNext()
  }

  return (
    <div className="form-step">
      <div className="field">
        <label>Add an interest</label>
        <div style={{display:'flex', gap:8}}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., Machine Learning" />
          <button onClick={add}>Add</button>
        </div>
      </div>

      <div className="field">
        <label>Interests</label>
        <ul className="list">
          {items.map(i => <li key={i} className="small">{i} <button className="secondary" style={{marginLeft:8}} onClick={() => remove(i)}>remove</button></li>)}
        </ul>
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button className="secondary" onClick={onPrev}>Previous</button>
        <button onClick={goNext}>Next</button>
      </div>
    </div>
  )
}
