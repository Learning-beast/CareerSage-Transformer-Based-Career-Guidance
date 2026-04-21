import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  index < currentStep
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : index === currentStep
                    ? 'bg-white border-emerald-600 text-emerald-600'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
                  index <= currentStep ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all ${
                  index < currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
