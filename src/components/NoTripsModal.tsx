import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface NoTripsModalProps {
  isOpen: boolean;
}

export default function NoTripsModal({ isOpen }: NoTripsModalProps) {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-xl border border-slate-200 bg-white shadow-xl p-8 flex flex-col items-center text-center">
        <div className="mb-5 p-4 rounded-full bg-slate-100">
          <Upload className="w-8 h-8 text-slate-600" />
        </div>

        <h2 className="text-2xl font-semibold text-slate-900 mb-3">
          No trips found
        </h2>
        <p className="text-slate-600 text-sm mb-8">
          Upload your SimplyGo PDF statement to see your travel analysis and concession pass recommendations.
        </p>

        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => navigate('/upload')}
        >
          Upload a Statement
        </Button>
      </div>
    </div>
  );
}
