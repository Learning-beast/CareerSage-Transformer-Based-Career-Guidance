import { Plus, X } from 'lucide-react';
import { UserProfile } from '../types';
import { useState } from 'react';

interface SkillsStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export default function SkillsStep({ profile, updateProfile }: SkillsStepProps) {
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');

  const addTechnicalSkill = () => {
    if (techInput.trim()) {
      updateProfile({ technicalSkills: [...profile.technicalSkills, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechnicalSkill = (index: number) => {
    updateProfile({ technicalSkills: profile.technicalSkills.filter((_, i) => i !== index) });
  };

  const addSoftSkill = () => {
    if (softInput.trim()) {
      updateProfile({ softSkills: [...profile.softSkills, softInput.trim()] });
      setSoftInput('');
    }
  };

  const removeSoftSkill = (index: number) => {
    updateProfile({ softSkills: profile.softSkills.filter((_, i) => i !== index) });
  };

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills Assessment</h2>
        <p className="text-gray-600">What skills do you currently possess?</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Skills</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTechnicalSkill)}
              placeholder="e.g., Python, React, Data Analysis"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={addTechnicalSkill}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.technicalSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full"
              >
                <span className="text-sm font-medium">{skill}</span>
                <button
                  onClick={() => removeTechnicalSkill(index)}
                  className="hover:bg-blue-100 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {profile.technicalSkills.length === 0 && (
            <p className="text-gray-500 text-sm italic mt-2">No technical skills added yet</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Soft Skills</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addSoftSkill)}
              placeholder="e.g., Communication, Leadership, Problem Solving"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={addSoftSkill}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.softSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full"
              >
                <span className="text-sm font-medium">{skill}</span>
                <button
                  onClick={() => removeSoftSkill(index)}
                  className="hover:bg-purple-100 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {profile.softSkills.length === 0 && (
            <p className="text-gray-500 text-sm italic mt-2">No soft skills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
