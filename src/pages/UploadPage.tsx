
import { Box, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { InfoSection } from '../components/UploadPage/InfoSection';
import { UploadSection } from '../components/UploadPage/UploadSection';
import { extractJourneysFromPdf } from '../services/pdfParserService';
import { calculateFaresOnConcession } from '../services/fareCalculationService';
import { useJourneyContext } from '../contexts/JourneyContext';
import { useNavigate } from 'react-router-dom';

export default function UploadPage(): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setJourneys, setFares } = useJourneyContext();
  const navigate = useNavigate();

  const handleFileUpload = async (uploadedFile: File) => {
      setLoading(true);
      // setError(null);

    try {
      // Parse PDF and extract trips
      const response = await extractJourneysFromPdf(uploadedFile);

      if (response.length === 0) {
        //   setError('No trips found in PDF. Please ensure it is a valid SimplyGo statement.');
          setLoading(false);
        return;
      }
      setJourneys(response);
      const calculatedFares = await calculateFaresOnConcession(response);
      setFares(calculatedFares);
      navigate('/trip-review');

    } catch (err) {
      // setError(err instanceof Error ? err.message : 'Failed to parse PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else if (file) {
      alert('Please select your SimplyGo PDF');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      handleFileUpload(file);
    } else if (file) {
      alert('Please select your SimplyGo PDF');
    }
  };

  // Opens file dialog to select file to upload
  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', p: { xs: 2, md: 4 } }}>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box>
          <Typography variant='h2' sx={{ mb: 2.5 }}>
            Upload Your SimplyGo Statement
          </Typography>
          <Typography variant='body1'>
            We'll extract your trips, fares, and distances automatically and recommend you the best concession pass based on your travel patterns.
          </Typography>
        </Box>

        {/* Upload Area */}
        <UploadSection
          loading={loading}
          selectedFile={selectedFile}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileInputSelect}
          handleClick={handleClick}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleFileDrop}
          handleFileUpload={handleFileUpload}
        />
        <InfoSection />
      </Box>
    </Box>
  );
}
