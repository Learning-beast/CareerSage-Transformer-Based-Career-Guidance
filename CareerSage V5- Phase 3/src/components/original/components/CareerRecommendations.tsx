import { TrendingUp, Sparkles, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { CareerRecommendation, SkillGap } from '../types';

interface CareerRecommendationsProps {
  recommendations: CareerRecommendation[];
  skillGaps: Record<string, SkillGap[]>;
  userSkills: string[];
}

export default function CareerRecommendations({
  recommendations,
  skillGaps,
  userSkills,
}: CareerRecommendationsProps) {
  const getSkillStatus = (skill: string) => {
    const normalizedSkill = skill.toLowerCase().trim();
    return userSkills.some((s) => s.toLowerCase().trim() === normalizedSkill);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">AI-Powered Analysis Complete</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Career Recommendations</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Based on your profile, we've identified the best career paths for you along with
          personalized learning resources to bridge skill gaps
        </p>
      </div>

      <div className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-gray-900">{recommendation.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    {recommendation.relevanceScore}% Match
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{recommendation.description}</p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Why this suits you:</p>
              <p className="text-sm text-blue-800">{recommendation.reason}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Required Skills Assessment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recommendation.requiredSkills.map((skill, idx) => {
                  const hasSkill = getSkillStatus(skill);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        hasSkill
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {hasSkill ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {skillGaps[recommendation.title] && skillGaps[recommendation.title].length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3">
                  Recommended Learning Resources
                </h4>
                <div className="space-y-3">
                  {skillGaps[recommendation.title].map((gap, gapIdx) => (
                    <div key={gapIdx} className="bg-white rounded p-3">
                      <p className="font-medium text-gray-900 mb-2">
                        {gap.skillName}
                        <span className="text-sm text-gray-600 ml-2">
                          (Current: {gap.currentLevel} → Target: {gap.requiredLevel})
                        </span>
                      </p>
                      <div className="space-y-1.5">
                        {gap.resources.map((resource, resIdx) => (
                          <a
                            key={resIdx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 text-sm p-2 hover:bg-gray-50 rounded transition-colors"
                          >
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                              {resource.platform}
                            </span>
                            <span className="text-blue-600 hover:text-blue-800 hover:underline flex-1">
                              {resource.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
