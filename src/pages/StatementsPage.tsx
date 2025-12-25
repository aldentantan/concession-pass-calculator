import { SectionHeader } from "../components/SectionHeader";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { fetchStatements, viewStatementTripSummary, createSignedLink, deleteStatement, reanalyseStatement } from "../services/statementsService";
import { useNavigate } from "react-router-dom";
import { useJourneyContext } from "../contexts/JourneyContext";
import { StatementTableSection } from "../components/StatementsPage/StatementTableSection";
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import type { Statement } from "../types";
import { uploadAndProcessPdf } from "../services/pdfUploadService";

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [loadingStatementId, setLoadingStatementId] = useState<string>();
  const [uploadingNew, setUploadingNew] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setJourneys, setFares } = useJourneyContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStatements() {
      const res = await fetchStatements();
      setStatements(res);
      setLoadingPage(false);
    }
    loadStatements();
  }, []);

  const viewTripSummary = async (statementId: string) => {
    setLoadingSummary(true);
    setLoadingStatementId(statementId);
    const { journeys, fares } = await viewStatementTripSummary(statementId);
    setJourneys(journeys);
    setFares(fares);
    navigate('/trip-summary');
    setLoadingSummary(false);
    setLoadingStatementId(undefined);
  }

  const viewPdf = async (statementId: string) => {
    const response = await createSignedLink(statementId);
    const statementSignedLink = response.signedLink;
    window.open(statementSignedLink, '_blank');
  }

  const reanalyse = async (statementId: string) => {
    setLoadingAnalysis(true);
    setLoadingStatementId(statementId);
    const { journeys, fares } = await reanalyseStatement(statementId);
    setJourneys(journeys);
    setFares(fares);
    navigate('/trip-summary');
    setLoadingAnalysis(false);
    setLoadingStatementId(undefined);
  }

  const deleteRow = async (statementId: string) => {
    console.log("Deleting statement with ID:", statementId);
    await deleteStatement(statementId);
    const res = await fetchStatements();
    setStatements(res);
  };

  const handleUploadNewClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed. Please select your SimplyGo PDF.');
      return;
    }

    setUploadingNew(true);
    try {
      const { journeys, fares } = await uploadAndProcessPdf(file);
      setJourneys(journeys);
      setFares(fares);
      navigate('/trip-summary');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to parse PDF');
    } finally {
      setUploadingNew(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loadingPage) return <CircularProgress />;

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <SectionHeader title="My Transport Statements" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Typography variant="body1">
          View and manage your uploaded SimplyGo statements
        </Typography>
        <Button
          sx={{ pt: 1, pb: 1, pl: 2, pr: 2 }}
          startIcon={uploadingNew ? <CircularProgress size={20} color="inherit" /> : <FileUploadRoundedIcon />}
          onClick={handleUploadNewClick}
          disabled={uploadingNew}
        >
          {uploadingNew ? 'Uploading...' : 'Upload New'}
        </Button>
      </Box>
      <StatementTableSection statements={statements} viewTripSummary={viewTripSummary} viewPdf={viewPdf} reanalyse={reanalyse} deleteRow={deleteRow} loadingSummary={loadingSummary} loadingAnalysis={loadingAnalysis} loadingStatementId={loadingStatementId}/>
    </Box>
  )
}