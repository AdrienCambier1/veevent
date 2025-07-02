"use client";

interface ProgressStep {
  name: string;
  value: number;
  completed: boolean;
  current: boolean;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressSteps({ steps, className = "" }: ProgressStepsProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between w-5/6 mx-auto">
        {steps.map((step, index) => (
          <div key={step.value} className={`flex items-center ${index === steps.length - 1 ? '' : 'flex-1'}`}>
            {/* Indicateur d'étape */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed
                    ? "bg-primary-600 text-white"
                    : step.current
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.completed ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.value
                )}
              </div>
              <span
                className={`text-xs mt-1 ${
                  step.completed
                    ? "text-primary-600 font-medium"
                    : step.current
                    ? "text-primary-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
            
            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div
                className={`w-full flex-1 h-0.5 mx-2 ${
                  step.completed ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 