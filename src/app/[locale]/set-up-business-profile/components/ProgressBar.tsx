import { FC } from "react";

const ProgressBar: FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <>
      {currentStep > 0 && (
        <div className="py-4">
          <div className="w-full">
            <div className="md:flex hidden items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressBar;
