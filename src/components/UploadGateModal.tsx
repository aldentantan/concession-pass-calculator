import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const features = [
  'Unlimited PDF uploads',
  'Save and compare multiple months',
  'Track spending trends over time',
];

interface UploadGateModalProps {
  isOpen: boolean;
}

export default function UploadGateModal({ isOpen }: UploadGateModalProps) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-slate-200 bg-white shadow-xl p-8 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          You've used your free analysis
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Create a free account to upload more statements and track your transport usage over time.
        </p>

        <ul className="w-full mb-8 space-y-3 text-left">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-slate-700 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex-col w-full space-y-4">
          <Button variant="default" size="sm" className="px-3 text-sm w-full" onClick={() => navigate('/signup')}>
            Sign Up - It's free!
          </Button>
          <Button variant="ghost" size="sm" className="px-3 text-sm w-50" onClick={() => navigate('/login')}>
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
