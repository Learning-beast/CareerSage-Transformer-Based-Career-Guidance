import React, { createContext, useContext, useState } from 'react'
import type { FormState, PersonalInfo } from '../types'

const defaultState: FormState = {
  personal: { firstName:'', lastName:'', email:'', education:'', experienceYears:0 },
  skills: [],
  interests: []
}

type ContextType = {
  state: FormState
  setPersonal: (p: PersonalInfo) => void
  setSkills: (s: string[]) => void
  setInterests: (i: string[]) => void
  reset: () => void
}

const FormContext = createContext<ContextType | undefined>(undefined)

export const useForm = () => {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useForm must be used inside FormProvider')
  return ctx
}

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>(defaultState)

  const setPersonal = (p: PersonalInfo) => setState(s => ({ ...s, personal: p }))
  const setSkills = (sks: string[]) => setState(s => ({ ...s, skills: sks }))
  const setInterests = (i: string[]) => setState(s => ({ ...s, interests: i }))

  const reset = () => setState(defaultState)

  return (
    <FormContext.Provider value={{ state, setPersonal, setSkills, setInterests, reset }}>
      {children}
    </FormContext.Provider>
  )
}
