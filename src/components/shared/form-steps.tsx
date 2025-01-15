"use client";

import { cn } from "@/lib/utils";

interface FormStepsProps {
  steps: { title: string;}[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function FormSteps({ steps, currentStep, onStepClick }: FormStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, index) => (
          <li key={step.title} className="md:flex-1">
            <button
              onClick={() => onStepClick?.(index)}
              disabled={index > currentStep}
              className={cn(
                "group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                index <= currentStep
                  ? "border-primary hover:border-primary/70"
                  : "border-muted-foreground/20 hover:border-muted-foreground/30",
                !onStepClick && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Step {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
