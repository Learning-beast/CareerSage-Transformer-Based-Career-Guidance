import { Plus, X } from 'lucide-react';
import { UserProfile } from '../types';
import { useState } from 'react';

interface GoalsStepProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export default function GoalsStep({ profile, updateProfile }: GoalsStepProps) {
  const [interestInput, setInterestInput] = useState('');

  const addInterest = () => {
    if (interestInput.trim()) {
      updateProfile({ interests: [...profile.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (index: number) => {
    updateProfile({ interests: profile.interests.filter((_, i) => i !== index) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Aspirations & Goals</h2>
        <p className="text-gray-600">Help us understand your career vision</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Interests & Aspirations</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Artificial Intelligence, Sustainability, Entrepreneurship"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={addInterest}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full"
              >
                <span className="text-sm font-medium">{interest}</span>
                <button
                  onClick={() => removeInterest(index)}
                  className="hover:bg-orange-100 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {profile.interests.length === 0 && (
            <p className="text-gray-500 text-sm italic mt-2">No interests added yet</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Short-term Goals (1-2 years)
          </label>
          <textarea
            value={profile.shortTermGoals}
            onChange={(e) => updateProfile({ shortTermGoals: e.target.value })}
            placeholder="What do you want to achieve in the next 1-2 years? (e.g., Learn new technologies, switch domains, get promoted)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            Long-term Goals (3-5 years)
          </label>
          <textarea
            value={profile.longTermGoals}
            onChange={(e) => updateProfile({ longTermGoals: e.target.value })}
            placeholder="What is your ultimate career vision? (e.g., Become a team lead, start a business, specialize in a domain)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
