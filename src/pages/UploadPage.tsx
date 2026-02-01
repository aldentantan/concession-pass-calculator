
import { AlertCircle, Calculator, FileText, Shield, TrendingUp, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useTripContext } from '../contexts/TripContext';
import { uploadAndProcessPdf } from '../services/pdfUploadService';

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setDayGroups, setFares } = useTripContext();
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else if (file) {
      setError('Only PDF files are allowed. Please select your SimplyGo PDF.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else if (file) {
      setError('Only PDF files are allowed. Please select your SimplyGo PDF.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const { journeys: dayGroups, fares } = await uploadAndProcessPdf(selectedFile);
      setDayGroups(dayGroups);
      setFares(fares);
      navigate('/trip-summary');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">Upload Your SimplyGo Statement</h2>
          <p className="text-lg text-slate-600">
            Get personalized pass recommendations based on your actual travel patterns
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">Upload Failed</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload Card */}
        <Card className="p-10 mb-12 bg-slate-50 border-slate-200">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-16 text-center cursor-pointer
              transition-all duration-200
              ${isDragOver
                ? 'border-slate-400 bg-white'
                : 'border-slate-300 bg-white/50 hover:bg-white hover:border-slate-400'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-5">
              <div className={`
                p-5 rounded-full transition-colors
                ${isDragOver ? 'bg-slate-200' : 'bg-slate-100'}
              `}>
                <Upload className="w-10 h-10 text-slate-600" />
              </div>

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-lg text-slate-900">
                    <FileText className="w-6 h-6" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg text-slate-900">
                    Drop your SimplyGo PDF here or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    PDF only, max 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              size="lg"
              className="px-10"
            >
              {loading ? 'Analyzing...' : 'Upload and Analyze'}
            </Button>
          </div>
        </Card>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={<FileText className="w-5 h-5 text-slate-600" />}
            title="What is SimplyGo?"
            description="SimplyGo is Singapore's contactless payment system for public transport. Your monthly statement contains all trip details we need."
          />

          <InfoCard
            icon={<Shield className="w-5 h-5 text-slate-600" />}
            title="Privacy First"
            description="Your SimplyGo data is stored securely and only used in this website for calculation purposes."
          />

          <InfoCard
            icon={<TrendingUp className="w-5 h-5 text-slate-600" />}
            title="Personalized Analysis"
            description="Recommendations based on your actual usage, not generic estimates or assumptions."
          />

          <InfoCard
            icon={<Calculator className="w-5 h-5 text-slate-600" />}
            title="Clear Savings Calculation"
            description="See exactly how much you'd save (or spend) with each concession pass option."
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h3 className="text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}
