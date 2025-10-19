import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Paper, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';

interface PdfUploadProps {
  onFileSelect?: (file: File) => void;
}

export default function PdfUpload({ onFileSelect }: PdfUploadProps): React.JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null): void => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      // Call the callback if provided
      if (onFileSelect) {
        onFileSelect(file);
      }
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', p: { xs: 2, md: 4 } }}>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#03045E' }}>
            Upload SimplyGo Statement
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#0077B6', mt: 1 }}>
            Upload your SimplyGo public transport fare statement PDF
          </Typography>
        </Box>

        {/* Upload Area */}
        <Paper
          sx={{
            mt: 2,
            borderRadius: 2,
            boxShadow: 3,
            p: { xs: 2, md: 4 },
            bgcolor: '#ffffff',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '350px',
              border: '3px dashed',
              borderColor: isDragging ? '#0077B6' : '#90E0EF',
              borderRadius: 2,
              bgcolor: isDragging ? 'rgba(0,119,182,0.05)' : 'rgba(202,240,248,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#0077B6',
                bgcolor: 'rgba(0,119,182,0.05)'
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />

            {!selectedFile ? (
              <>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#CAF0F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: '#0077B6' }} />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#03045E', mb: 1 }}>
                  Drop your PDF here
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#0077B6', textAlign: 'center' }}>
                  or click to browse files
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#90E0EF', mt: 2 }}>
                  Supported format: PDF only
                </Typography>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#CAF0F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 40, color: '#0077B6' }} />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#03045E', mb: 1 }}>
                  {selectedFile.name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#0077B6', mb: 1 }}>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#90E0EF', mt: 2 }}>
                  Click to upload a different file
                </Typography>
              </>
            )}
          </Box>
        </Paper>

        {/* Info Footer */}
        {selectedFile && (
          <Box sx={{ mt: 3, textAlign: 'center', color: '#03045E', fontSize: 13 }}>
            <Typography>File ready to process. Analysis features coming soon!</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
