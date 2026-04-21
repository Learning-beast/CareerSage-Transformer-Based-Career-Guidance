export type PersonalInfo = {
  firstName: string
  lastName: string
  email: string
  education?: string
  experienceYears?: number
}

export type FormState = {
  personal: PersonalInfo
  skills: string[]
  interests: string[]
}
