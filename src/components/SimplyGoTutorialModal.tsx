import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import tutStep1 from '../assets/tut-step1.jpg';
import tutStep2 from '../assets/tut-step2.jpg';
import tutStep3 from '../assets/tut-step3.jpg';
import tutStep4 from '../assets/tut-step4.jpg';
import { Button } from './ui/button';

interface TutorialStep {
  title: string;
  description: string;
  imageSrc?: string;
}

const STEPS: TutorialStep[] = [
  {
    title: 'Step 1 — Download the SimplyGo app',
    description: 'Download the SimplyGo app from the App Store/Google Play Store and open the app.',
    imageSrc: tutStep1,
  },
  {
    title: 'Step 2 — Add card',
    description: 'Click the "Add" button and key in the details of the card you use for public transport. If the card already exists in the app, tap on the card.',
    imageSrc: tutStep2,
  },
  {
    title: 'Step 3 — Select "View All"',
    description: 'Click on the "View All" button to view all public transport transactions with the selected card.',
    imageSrc: tutStep3,
  },
  {
    title: 'Step 4 — Download the SimplyGo PDF',
    description: 'Click on the xx 2026 Transit Statement and download the PDF of the month you wish to analyse. Upload this PDF onto this website.',
    imageSrc: tutStep4,
  }
];

interface SimplyGoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimplyGoTutorialModal({ isOpen, onClose }: SimplyGoTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleBackdropClick} />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md mx-4 h-160 rounded-xl border border-slate-200 bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900 leading-snug pr-4">
            {step.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close tutorial"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Scrollable middle content */}
        <div className="flex-1 overflow-hidden">
          {/* Screenshot area */}
          <div className="px-6 pt-5">
            <img
              src={step.imageSrc}
              alt={step.title}
              className="w-full rounded-lg object-contain max-h-96"
            />
          </div>

          {/* Description */}
          <p className="px-6 pt-4 pb-2 text-sm text-slate-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Step indicator + navigation */}
        <div className="flex items-center justify-between px-4 py-4 mt-1 border-t border-slate-100">
          {/* Back arrow */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={isFirst}
            className="flex items-center gap-1 hover:bg-transparent focus:ring-0 focus:ring-offset-0"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Step counter */}
          <span className="text-xs text-slate-400">
            Step {currentStep + 1} of {STEPS.length}
          </span>

          {/* Next / Done */}
          <Button
            variant={'ghost'}
            size="sm"
            onClick={() => setCurrentStep((s) => s + 1)}
            className={`flex items-center gap-1 focus:ring-0 focus:ring-offset-0 hover:bg-transparent`}
            aria-label={isLast ? 'Done' : 'Next step'}
            disabled={isLast}
          >
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          </Button>
        </div>
      </div>
    </div>
  );
}
