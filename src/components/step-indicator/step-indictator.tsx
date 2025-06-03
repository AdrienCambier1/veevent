import React from "react";
import "./step-indicator.scss";

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    name?: string;
    value?: string | number;
    onClick?: () => void;
    disabled?: boolean;
  }[];
}

export default function StepIndicator({
  currentStep,
  steps = [],
}: StepIndicatorProps) {
  return (
    <div className="step-indicator">
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
              className={`${isCompleted && "completed"} `}
            >
              {step.value || stepNumber}
            </button>
            <p className={`${isCompleted && "completed"} `}>
              {step.name || `Étape ${stepNumber}`}
            </p>
            {index < steps.length - 1 && (
              <div className={`line ${isPreviousStep && "previous"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
