import { SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/Section";
import { Box, Typography, Button, Table, TableCell, TableHead, TableContainer, TableRow, TableBody, Paper, IconButton, Tooltip } from "@mui/material";
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import { useEffect, useState } from "react";
import { fetchStatements, viewStatementTripSummary, deleteStatement } from "../services/statementsService";
import { formatDate } from '../utils/formatDate'
import { useNavigate } from "react-router-dom";
import { useJourneyContext } from "../contexts/JourneyContext";

import type { Statement } from "../types";

export default function StatementsPage() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const { setJourneys, setFares } = useJourneyContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStatements() {
      console.log("Fetching statements...");
      const res = await fetchStatements();
      setStatements(res);
      console.log("Statements loaded:", res);
    }
    loadStatements();
  }, []);

  const viewTripSummary = async (statementId: string) => {
    const { journeys, fares } = await viewStatementTripSummary(statementId);
    setJourneys(journeys);
    setFares(fares);
    navigate('/trip-summary')
  }

  const deleteRow = async (statementId: string) => {
    console.log("Deleting statement with ID:", statementId);
    await deleteStatement(statementId);
    const res = await fetchStatements();
    setStatements(res);
  };

  return (
    <Box>
      <SectionHeader title="My Transport Statements" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Typography variant="body1">
          View and manage your uploaded SimplyGo statements
        </Typography>
        <Button sx={{ pt: 1, pb: 1, pl: 2, pr: 2 }} startIcon={<FileUploadRoundedIcon />}>
          Upload New
        </Button>
      </Box>
      <Section>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
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
                  <TableCell>{row.statement_month}</TableCell>
                  <TableCell>{row.file_name}</TableCell>
                  <TableCell>{formatDate(row.created_at)}</TableCell>
                  <TableCell>${row.total_fare}</TableCell>
                  <TableCell>{row.journey_count}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="View Trip Summary" placement="top">
                        <IconButton onClick={() => viewTripSummary(String(row.id))}><ListRoundedIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="View SimplyGo PDF" placement="top">
                        <IconButton><OpenInNewIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Retrigger Calculation for Statement" placement="top">
                        <IconButton><AutorenewIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Statement" placement="top">
                        <IconButton color="error" onClick={() => deleteRow(String(row.id))}><DeleteRoundedIcon /></IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>
    </Box>
  )
}