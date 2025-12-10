import { Section } from '../Section';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import type { ConcessionPass } from '../../types';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

interface PassComparisonResult {
  pass: ConcessionPass;
  cost: number;
  savings: number;
  isSavingMoney: boolean;
}

interface PassComparisonSectionProps {
  passOptions: ConcessionPass[];
  selectedPassId: string;
  onPassChange: (passId: string) => void;
  selectedPassComparison: PassComparisonResult;
}

export const PassComparisonSection = ({ passOptions, selectedPassId, onPassChange, selectedPassComparison }: PassComparisonSectionProps) => {

  return (
    <Section>
      <Paper>
        <ToggleButtonGroup
          value={selectedPassId}
          exclusive
          onChange={(_, value) => {
            if (value !== null) onPassChange(value);
          }}
          sx={{ display: 'flex', justifyContent: 'flex-start', borderBottom: '1px solid #e0e0e0' }}
        >
          {passOptions.map((pass) => (
            <ToggleButton key={pass.id} value={pass.id} sx={{ textTransform: 'none' }}>
              {pass.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', flexDirection: 'row', p: 4, pr: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '70%' }}>
            <Typography variant='body1' sx={{ mb: 0.75 }}>
              Monthly Cost
            </Typography>
            <Typography variant='h3' sx={{ fontWeight: 400, mb: 2.5 }}>
              ${selectedPassComparison.cost.toFixed(2)}
              {selectedPassId !== 'no-pass' ? ` (The pass costs $${selectedPassComparison.pass.monthlyPrice.toFixed(2)}/month.)` : ''}
            </Typography>
            <Typography variant='body1'>
              {selectedPassComparison.pass.description}
            </Typography>
          </Box>
          {selectedPassId !== 'no-pass' &&
            (
              <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: selectedPassComparison.isSavingMoney ? 'background.secondary' : 'background.error', border: '1px solid', borderColor: selectedPassComparison.isSavingMoney ? 'secondary.main' : 'red', borderRadius: '8px', p: 2, alignItems: 'flex-start', width: '15%', gap: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2, gap: 1 }}>
                  {selectedPassComparison.isSavingMoney ? <TrendingUpOutlinedIcon sx={{ color: 'secondary.main' }}/> : <TrendingDownOutlinedIcon sx={{ color: 'red' }}/>}
                  <Typography variant='body1' sx={{ color: selectedPassComparison.isSavingMoney ? 'secondary.main' : 'red' }}>{selectedPassComparison.isSavingMoney ? 'Savings' : 'Loss'}</Typography>
                </Box>
                <Typography variant='h3' sx={{ color: selectedPassComparison.isSavingMoney ? 'secondary.main' : 'red' }}>${Math.abs(selectedPassComparison.savings).toFixed(2)}</Typography>
              </Box>
            )
          }
        </Box>
      </Paper>
    </Section>
  )
};