import { Section } from "../Section";
import { Box, Table, TableCell, TableHead, TableContainer, TableRow, TableBody, Paper, IconButton, Tooltip, Typography, CircularProgress } from "@mui/material";
import { formatDate } from '../../utils/formatDate';
import { DeleteModal } from "./DeleteModal";
import { useState } from "react";
import type { Statement } from "../../types";

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';

interface StatementTableSectionProps {
  statements: Statement[];
  viewTripSummary: (statementId: string) => void;
  viewPdf: (statementId: string) => void;
  reanalyse: (statementId: string) => void;
  deleteRow: (statementId: string) => void;
  loadingSummary: boolean;
  loadingAnalysis: boolean;
  loadingStatementId?: string;
}

export const StatementTableSection = ({ statements, viewTripSummary, viewPdf, reanalyse, deleteRow, loadingSummary, loadingAnalysis, loadingStatementId }: StatementTableSectionProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [statementIdToDelete, setStatementIdToDelete] = useState<string>('');
  const [statementFileNameToDelete, setStatementFileNameToDelete] = useState<string>('');

  const onOpenDeleteModal = (statementId: string) => {
    setStatementIdToDelete(statementId);
    setStatementFileNameToDelete(statements.find(s => s.id === Number(statementId))?.file_name || '');
    setDeleteModalOpen(true);
  }

  const onCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setStatementIdToDelete('');
    setStatementFileNameToDelete('');
  }

  const onDeleteStatement = () => {
    deleteRow(statementIdToDelete);
    onCloseDeleteModal();
  }

  if (statements.length == 0) {
    return (
      <Section>
        <Typography variant="h2" sx={{ mt: 5 }}>
          No statements uploaded yet.
        </Typography>
      </Section>
    )
  }

  return (
    <Section>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Month/Year</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Date Uploaded</TableCell>
              <TableCell>Total Fares Paid</TableCell>
              <TableCell>Journeys</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statements.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.statement_month} {row.statement_year}</TableCell>
                <TableCell>{row.file_name}</TableCell>
                <TableCell>{formatDate(row.created_at)}</TableCell>
                <TableCell>${row.total_fare}</TableCell>
                <TableCell>{row.journey_count}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="View Trip Summary" placement="top">
                      {loadingSummary && loadingStatementId === String(row.id) ? (
                        <CircularProgress size={24} />
                      ) : (
                        <IconButton onClick={() => viewTripSummary(String(row.id))} disabled={loadingSummary}><ListRoundedIcon /></IconButton>
                      )}
                    </Tooltip>
                    <Tooltip title="View SimplyGo PDF" placement="top">
                      <IconButton onClick={() => viewPdf(String(row.id))} disabled={loadingSummary}><OpenInNewIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Retrigger Calculation for Statement" placement="top">
                      {loadingAnalysis && loadingStatementId === String(row.id) ? (
                        <CircularProgress size={24} />
                      ) : (
                        <IconButton onClick={() => reanalyse(String(row.id))} disabled={loadingSummary}><AutorenewIcon /></IconButton>
                      )}
                    </Tooltip>
                    <Tooltip title="Delete Statement" placement="top">
                      <IconButton color="error" onClick={() => onOpenDeleteModal(String(row.id))} disabled={loadingSummary}><DeleteRoundedIcon /></IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteModal onClose={() => setDeleteModalOpen(false)} open={deleteModalOpen} onDelete={onDeleteStatement} fileName={statementFileNameToDelete} />
    </Section>
  )
}