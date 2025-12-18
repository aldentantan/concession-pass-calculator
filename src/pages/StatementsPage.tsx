import { SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/Section";
import { Box, Typography, Button, Table, TableCell, TableHead, TableContainer, TableRow, TableBody, Paper, IconButton, Tooltip } from "@mui/material";
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';

function createData(month: string, dateUploaded: string, totalFares: number, journeys: number) {
  return { month, dateUploaded, totalFares, journeys };
}

const mockData = [
  createData('January 2024', '2024-02-01', 45.50, 30),
  createData('February 2024', '2024-03-01', 38.00, 25),
  createData('March 2024', '2024-04-01', 50.75, 32),
]

export default function StatementsPage() {
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
                <TableCell>Date Uploaded</TableCell>
                <TableCell>Total Fares</TableCell>
                <TableCell>Journeys</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.dateUploaded}</TableCell>
                  <TableCell>${row.totalFares.toFixed(2)}</TableCell>
                  <TableCell>{row.journeys}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="View SimplyGo PDF" placement="top">
                        <IconButton><OpenInNewIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="View Trip Summary" placement="top">
                        <IconButton ><ListRoundedIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Retrigger Calculation for Statement" placement="top">
                        <IconButton><AutorenewIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Statement" placement="top">
                        <IconButton color="error"><DeleteRoundedIcon /></IconButton>
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