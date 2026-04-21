import { Plus, Trash2 } from 'lucide-react';
import { UserProfile, Education, WorkExperience } from '../types';

interface EducationWorkStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export default function EducationWorkStep({ profile, updateProfile }: EducationWorkStepProps) {
  const addEducation = () => {
    updateProfile({
      education: [...profile.education, { degree: '', institution: '', year: '', field: '' }],
    });
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const newEducation = [...profile.education];
    newEducation[index] = { ...newEducation[index], ...updates };
    updateProfile({ education: newEducation });
  };

  const removeEducation = (index: number) => {
    updateProfile({ education: profile.education.filter((_, i) => i !== index) });
  };

  const addWorkExperience = () => {
    updateProfile({
      workExperience: [
        ...profile.workExperience,
        { title: '', company: '', duration: '', description: '' },
      ],
    });
  };

  const updateWorkExperience = (index: number, updates: Partial<WorkExperience>) => {
    const newWork = [...profile.workExperience];
    newWork[index] = { ...newWork[index], ...updates };
    updateProfile({ workExperience: newWork });
  };

  const removeWorkExperience = (index: number) => {
    updateProfile({ workExperience: profile.workExperience.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education & Experience</h2>
        <p className="text-gray-600">Tell us about your educational background and work history</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Education</h3>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-700">Education {index + 1}</h4>
                  {profile.education.length > 1 && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, { degree: e.target.value })}
                    placeholder="Degree (e.g., B.Tech, MBA)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(index, { field: e.target.value })}
                    placeholder="Field of Study"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, { institution: e.target.value })}
                    placeholder="Institution"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, { year: e.target.value })}
                    placeholder="Year (e.g., 2020)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
            <button
              onClick={addWorkExperience}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {profile.workExperience.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                No work experience added yet. Click "Add Experience" to get started.
              </p>
            )}
            {profile.workExperience.map((work, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-700">Experience {index + 1}</h4>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={work.title}
                    onChange={(e) => updateWorkExperience(index, { title: e.target.value })}
                    placeholder="Job Title"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={work.company}
                    onChange={(e) => updateWorkExperience(index, { company: e.target.value })}
                    placeholder="Company"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  value={work.duration}
                  onChange={(e) => updateWorkExperience(index, { duration: e.target.value })}
                  placeholder="Duration (e.g., 2 years, Jan 2020 - Dec 2022)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <textarea
                  value={work.description}
                  onChange={(e) => updateWorkExperience(index, { description: e.target.value })}
                  placeholder="Brief description of your role and achievements"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
