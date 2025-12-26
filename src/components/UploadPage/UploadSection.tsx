import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Section } from '../Section';

interface UploadSectionProps {
  loading: boolean;
  selectedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (file: File) => void;
}

export const UploadSection = ({
  loading,
  selectedFile,
  fileInputRef,
  handleFileSelect,
  handleClick,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileUpload }: UploadSectionProps) => {
  return (
    <Section>
      <Paper sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 1,
        p: 4,
        gap: 2
      }}>
        <Box
          onClick={loading ? undefined : handleClick}
          onDragOver={loading ? undefined : handleDragOver}
          onDragLeave={loading ? undefined : handleDragLeave}
          onDrop={loading ? undefined : handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: selectedFile ? 'secondary.main' : '#d1d5dc',
            borderRadius: '8px',
            width: '100%',
            p: 4,
            pt: { xs: 2, md: 6 },
            pb: { xs: 2, md: 6 },
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: selectedFile ? 'background.secondary' : 'transparent',
            '&:hover': {
              borderColor: 'secondary.main',
              bgcolor: 'rgba(0,119,182,0.05)'
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {!selectedFile ? (
            <>
              <FileUploadRoundedIcon sx={{ fontSize: 80, color: '#99a1af', mb: 2 }} />
              <Typography variant='body1' sx={{ fontWeight: 500, mb: 1 }}>
                Drop your SimplyGo PDF here or click to browse
              </Typography>
              <Typography variant='body2'>
                PDF only, max 10MB
              </Typography>
            </>
          ) : (
            <>
              <DescriptionOutlinedIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 1 }} />
              <Typography variant='h3' sx={{ fontWeight: 400, mb: 2 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant='body2' sx={{ mb: 1 }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </>
          )}

        </Box>
        <Button
          disabled={loading || !selectedFile}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          onClick={() => selectedFile && handleFileUpload(selectedFile)}
          sx={{
            width: '100%'
          }}>
          {loading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Paper>
    </Section>
  )
}
