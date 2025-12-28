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

interface PassComparisonSectionMobileProps {
  passOptions: ConcessionPass[];
  selectedPassId: string;
  onPassChange: (passId: string) => void;
  selectedPassComparison: PassComparisonResult;
}

export const PassComparisonSectionMobile = ({ passOptions, selectedPassId, onPassChange, selectedPassComparison }: PassComparisonSectionMobileProps) => {

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

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant='body1' sx={{ mb: 0.75 }}>
              Monthly Cost: ${selectedPassComparison.cost.toFixed(2)}
            </Typography>
            <Typography variant='h3' textAlign='left' sx={{ fontWeight: 400, mb: 2.5 }}>
              {selectedPassId !== 'no-pass' ? ` (The pass costs $${selectedPassComparison.pass.monthlyPrice.toFixed(2)}/month.)` : ''}
            </Typography>
            <Typography variant='body1' textAlign='left'>
              {selectedPassComparison.pass.description}
            </Typography>
          </Box>
          <Box>
            {selectedPassId !== 'no-pass' &&
              (
                <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: selectedPassComparison.isSavingMoney ? 'background.secondary' : 'background.error', border: '1px solid', borderColor: selectedPassComparison.isSavingMoney ? 'secondary.main' : 'red', borderRadius: '8px', p: 2, justifyContent: 'center', gap: 0.5 }}>
                  {selectedPassComparison.isSavingMoney ? <TrendingUpOutlinedIcon sx={{ color: 'secondary.main' }} /> : <TrendingDownOutlinedIcon sx={{ color: 'red' }} />}
                  <Typography variant='body1' sx={{ color: selectedPassComparison.isSavingMoney ? 'secondary.main' : 'red' }}>{selectedPassComparison.isSavingMoney ? 'Savings' : 'Loss'}: ${Math.abs(selectedPassComparison.savings).toFixed(2)}</Typography>
                </Box>
              )
            }
          </Box>
        </Box>
      </Paper>
    </Section>
  )
};