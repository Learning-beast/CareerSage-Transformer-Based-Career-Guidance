import React, { useState, useEffect } from "react"
import { useForm } from "../context/FormContext"
import type { PersonalInfo } from "../types"

type PersonalInfoProps = {
  onNext: (profile: PersonalInfo) => void
}

export default function PersonalInfoForm({ onNext }: PersonalInfoProps) {
  const { state, setPersonal } = useForm()
  const [local, setLocal] = useState<PersonalInfo>(state.personal)

  useEffect(() => {
    setLocal(state.personal)
  }, [state.personal])

  const goNext = () => {
    if (!local.firstName || !local.email) {
      alert("Please provide at least first name and email.")
      return
    }

    setPersonal(local) // update global context
    onNext(local) // pass profile to App.tsx
  }

  return (
    <div className="form-step space-y-4">
      <div className="field">
        <label>
          First Name
        </label>
        <input
          value={local.firstName}
          onChange={(e) => setLocal({ ...local, firstName: e.target.value })}
        />
      </div>

      <div className="field">
        <label>
          Last Name
        </label>
        <input
          value={local.lastName}
          onChange={(e) => setLocal({ ...local, lastName: e.target.value })}
        />
      </div>

      <div className="field">
        <label>
          Email
        </label>
        <input
          type="email"
          value={local.email}
          onChange={(e) => setLocal({ ...local, email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="field">
          <label>
            Education
          </label>
          <input
            value={local.education}
            onChange={(e) => setLocal({ ...local, education: e.target.value })}
          />
        </div>
        <div className="field">
          <label>
            Years of Experience
          </label>
          <input
            type="number"
            value={local.experienceYears || 0}
            onChange={(e) =>
              setLocal({
                ...local,
                experienceYears: Number(e.target.value)
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={goNext}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
