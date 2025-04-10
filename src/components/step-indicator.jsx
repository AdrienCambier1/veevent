import React from "react";

export default function StepIndicator({ currentStep, steps = [] }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isPreviousStep = currentStep > stepNumber;
        const isCompleted = isActive || isPreviousStep;

        return (
          <React.Fragment key={index}>
            <button
              type="button"
              onClick={step.onClick}
              disabled={step.disabled}
              className={`${
                isCompleted
                  ? "text-white bg-[var(--primary-blue)] blue-shadow"
                  : "text-[var(--primary-blue)] box-border border border-[var(--secondary-border-col)]"
              } h-8 w-8 rounded-full font-bold`}
            >
              {step.value || stepNumber}
            </button>

            {index < steps.length - 1 && (
              <div
                className={`w-12 h-[1px] ${
                  isPreviousStep
                    ? "bg-[var(--primary-blue)]"
                    : "bg-[var(--secondary-border-col)]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
