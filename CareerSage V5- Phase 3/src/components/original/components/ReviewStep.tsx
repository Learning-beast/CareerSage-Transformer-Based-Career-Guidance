import { UserProfile } from '../types';
import { Briefcase, GraduationCap, Target, Lightbulb, Mail, User } from 'lucide-react';

interface ReviewStepProps {
  profile: UserProfile;
}

export default function ReviewStep({ profile }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h2>
        <p className="text-gray-600">Please verify all information before generating recommendations</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {profile.name || 'Not provided'}</p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{profile.email || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Education</h3>
          </div>
          {profile.education.length > 0 ? (
            <div className="space-y-3">
              {profile.education.map((edu, index) => (
                <div key={index} className="text-sm bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900">{edu.degree} in {edu.field}</p>
                  <p className="text-gray-600">{edu.institution} - {edu.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No education added</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Work Experience</h3>
          </div>
          {profile.workExperience.length > 0 ? (
            <div className="space-y-3">
              {profile.workExperience.map((work, index) => (
                <div key={index} className="text-sm bg-gray-50 p-3 rounded">
                  <p className="font-medium text-gray-900">{work.title} at {work.company}</p>
                  <p className="text-gray-600">{work.duration}</p>
                  {work.description && (
                    <p className="text-gray-700 mt-1">{work.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No work experience added</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Skills</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills:</p>
              <div className="flex flex-wrap gap-2">
                {profile.technicalSkills.length > 0 ? (
                  profile.technicalSkills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 italic">None added</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Soft Skills:</p>
              <div className="flex flex-wrap gap-2">
                {profile.softSkills.length > 0 ? (
                  profile.softSkills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 italic">None added</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Goals & Interests</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-gray-700 mb-1">Interests:</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">None added</span>
                )}
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Short-term Goals:</p>
              <p className="text-gray-600">{profile.shortTermGoals || 'Not provided'}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Long-term Goals:</p>
              <p className="text-gray-600">{profile.longTermGoals || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
