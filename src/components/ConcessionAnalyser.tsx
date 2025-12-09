import { Alert, Box, CircularProgress, Step, StepLabel, Stepper } from '@mui/material';
import React, { useState } from 'react';
import { extractJourneysFromPdf } from '../utils/pdfParser';
import { calculateFaresOnConcession } from '../services/fareCalculationService';
// import PassRecommendation from './PassRecommendation';
import PdfUpload from './PdfUpload';
import TripReview from './TripReview';

import type { Journey, ConcessionFareResponse } from '../types';

export default function ConcessionAnalyzer(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fares, setFares] = useState<ConcessionFareResponse>({
    totalFareExcludingBus: 0,
    totalFareExcludingMrt: 0,
  });

  const steps = ['Upload PDF', 'Review Trips', 'Get Recommendation'];

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setLoading(true);
    setError(null);

    try {
      // Parse PDF and extract trips
      const response = await extractJourneysFromPdf(uploadedFile);

      if (response.length === 0) {
        setError('No trips found in PDF. Please ensure it is a valid SimplyGo statement.');
        setLoading(false);
        return;
      }
      setJourneys(response);
      const calculatedFares = await calculateFaresOnConcession(response);
      setFares(calculatedFares);

      setActiveStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && activeStep === 0 && <PdfUpload handleFileUpload={handleFileUpload} />}
      {!loading && activeStep === 1 && (
        <TripReview
          journeys={journeys}
          calculatedFares={fares}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
        {/* {!loading && activeStep === 2 && (
          <PassRecommendation
            journeys={journeys}
            onBack={handleBack}
          />
        )} */}
    </Box>
  );
}