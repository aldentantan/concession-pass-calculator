import { Section } from "../Section";
import { Box, Card, CardContent, Typography, IconButton, Menu, MenuItem, CircularProgress } from "@mui/material";
import { formatDate } from '../../utils/formatDate';
import { DeleteModal } from "./DeleteModal";
import { useState } from "react";
import type { Statement } from "../../types";

import MoreVertIcon from '@mui/icons-material/MoreVert';

interface StatementCardListProps {
  statements: Statement[];
  viewTripSummary: (statementId: string) => void;
  viewPdf: (statementId: string) => void;
  reanalyse: (statementId: string) => void;
  deleteRow: (statementId: string) => void;
  loadingSummary: boolean;
  loadingAnalysis: boolean;
  loadingStatementId?: string;
}

export const StatementCardList = ({ statements, viewTripSummary, viewPdf, reanalyse, deleteRow, loadingSummary, loadingAnalysis, loadingStatementId }: StatementCardListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatementId, setSelectedStatementId] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [statementIdToDelete, setStatementIdToDelete] = useState<string>('');
  const [statementFileNameToDelete, setStatementFileNameToDelete] = useState<string>('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, statementId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedStatementId(statementId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStatementId('');
  };

  const handleViewSummary = () => {
    viewTripSummary(selectedStatementId);
    handleMenuClose();
  };

  const handleViewPdf = () => {
    viewPdf(selectedStatementId);
    handleMenuClose();
  };

  const handleReanalyse = () => {
    reanalyse(selectedStatementId);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setStatementIdToDelete(selectedStatementId);
    setStatementFileNameToDelete(statements.find(s => s.id === Number(selectedStatementId))?.file_name || '');
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const onCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setStatementIdToDelete('');
    setStatementFileNameToDelete('');
  };

  const onDeleteStatement = () => {
    deleteRow(statementIdToDelete);
    onCloseDeleteModal();
  };

  if (statements.length === 0) {
    return (
      <Section>
        <Typography variant="h2" sx={{ mt: 5 }}>
          No statements uploaded yet.
        </Typography>
      </Section>
    );
  }

  return (
    <Section>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {statements.map((statement) => {
          const isLoading = (loadingSummary || loadingAnalysis) && loadingStatementId === String(statement.id);

          return (
            <Card key={statement.id} sx={{ boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {statement.statement_month} {statement.statement_year}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${statement.total_fare}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="body2" color="text.secondary">
                        Uploaded on {formatDate(statement.created_at)} · {statement.journey_count} journeys
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {statement.file_name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, String(statement.id))}
                        disabled={loadingSummary || loadingAnalysis}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewSummary}>View Trip Summary</MenuItem>
        <MenuItem onClick={handleViewPdf}>View SimplyGo PDF</MenuItem>
        <MenuItem onClick={handleReanalyse}>Re-analyze</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>Delete</MenuItem>
      </Menu>

      <DeleteModal
        open={deleteModalOpen}
        onClose={onCloseDeleteModal}
        onDelete={onDeleteStatement}
        fileName={statementFileNameToDelete}
      />
    </Section>
  );
};