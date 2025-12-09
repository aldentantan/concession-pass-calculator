import { Section } from '../Section';
import { Paper, Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useState } from 'react';
import type { ConcessionPass } from '../../types';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

interface PassComparisonSectionProps {
  totalFare: number;
  calculatedFares: {
    totalFareExcludingBus: number;
    totalFareExcludingMrt: number;
  };
}

export const PassComparisonSection = ({ totalFare, calculatedFares }: PassComparisonSectionProps) => {
  const PASS_OPTIONS: ConcessionPass[] = [
    {
      id: 'no-pass',
      label: 'No Pass',
      monthlyPrice: 0,
      description: 'Your current fares, excluding concession pass price (if you had purchased one).',
    },
    {
      id: 'undergrad-bus',
      label: 'Undergrad Bus',
      monthlyPrice: 55.50,
      description: 'Unlimited bus travel. Best if you primarily use buses for your commute.',
    },
    {
      id: 'undergrad-mrt',
      label: 'Undergrad MRT',
      monthlyPrice: 48,
      description: 'Unlimited MRT/LRT travel. Best if you primarily use MRT/LRT for your commute.',
    },
    {
      id: 'undergrad-hybrid',
      label: 'Undergrad Hybrid',
      monthlyPrice: 81,
      description: 'Unlimited bus and MRT/LRT travel. Best value for mixed-mode commuters.',
    },
  ];

  const [selectedPassId, setSelectedPassId] = useState<string>('no-pass');
  const selectedPass = PASS_OPTIONS.find((p) => p.id === selectedPassId)!;

  const { totalFareExcludingBus, totalFareExcludingMrt } = calculatedFares;
  const passCost =
        selectedPass.id === 'no-pass'
            ? totalFare
            : selectedPass.id === 'undergrad-bus'
                ? totalFareExcludingBus + selectedPass.monthlyPrice
                : selectedPass.id === 'undergrad-mrt'
                    ? totalFareExcludingMrt + selectedPass.monthlyPrice
                    : selectedPass.monthlyPrice;
  const savings = selectedPass.id === 'no-pass' ? 0 : totalFare - passCost;
  const isSavingMoney = savings > 0;

  return (
    <Section>
      <Paper>
        <ToggleButtonGroup
          value={selectedPassId}
          exclusive
          onChange={(_, value) => {
            if (value !== null) setSelectedPassId(value);
          }}
          sx={{ display: 'flex', justifyContent: 'flex-start', borderBottom: '1px solid #e0e0e0' }}
        >
          {PASS_OPTIONS.map((pass) => (
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
              ${passCost.toFixed(2)}
            </Typography>
            <Typography variant='body1'>
              {selectedPass.description}
            </Typography>
          </Box>
          {selectedPassId !== 'no-pass' &&
            (
              <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: isSavingMoney ? 'background.secondary' : 'background.error', border: '1px solid', borderColor: isSavingMoney ? 'secondary.main' : 'red', borderRadius: '8px', p: 2, alignItems: 'flex-start', width: '15%', gap: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2, gap: 1 }}>
                  {isSavingMoney ? <TrendingUpOutlinedIcon sx={{ color: 'secondary.main' }}/> : <TrendingDownOutlinedIcon sx={{ color: 'red' }}/>}
                  <Typography variant='body1' sx={{ color: isSavingMoney ? 'secondary.main' : 'red' }}>{isSavingMoney ? 'Savings' : 'Loss'}</Typography>
                </Box>
                <Typography variant='h3' sx={{ color: isSavingMoney ? 'secondary.main' : 'red' }}>${savings.toFixed(2)}</Typography>
              </Box>
            )
          }

        </Box>


      </Paper>
    </Section>
  )
};