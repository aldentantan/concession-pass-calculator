import { Section } from '../Section';
import { Box, Typography, Paper } from '@mui/material';
import type { ConcessionPass } from '../../types';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

interface PassComparisonResult {
  pass: ConcessionPass;
  cost: number;
  savings: number;
  isSavingMoney: boolean;
}

interface RecommendationSectionProps {
  totalFare: number;
  bestPass: PassComparisonResult;
  passOptions: PassComparisonResult[];
}

export const RecommendationSection = ({ totalFare, bestPass, passOptions }: RecommendationSectionProps) => {
  const passesExceptBest: PassComparisonResult[] = passOptions.filter(p => p.pass.id !== bestPass.pass.id).sort((a, b) => a.cost - b.cost);

  return (
    <Section>
      <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', backgroundColor: '#1e3c96', p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <WorkspacePremiumOutlinedIcon sx={{ fontSize: 36, backgroundColor: '#4b62a5', color: '#ffffff', borderRadius: 1 }} />
          <Typography variant='h3' sx={{ fontWeight: 400, color: '#ffffff' }}>Recommended Pass For You</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant='body2'>
                Best Option
              </Typography>
              <Typography variant='h2' sx={{ color: '#ffffff' }}>
                {bestPass.pass.label}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1.5, gap: 1, borderRadius: 1, backgroundColor: '#4b62a5' }}>
              <TrendingUpOutlinedIcon sx={{ color: 'secondary.main', fontSize: 24 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Typography variant='body2' sx={{ color: '#ffffff' }}>You Save:</Typography>
                <Typography variant='h3' sx={{ color: '#ffffff' }}>${Math.abs(bestPass.savings).toFixed(2)}/month</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#4b62a5', borderRadius: 1, p: 2, gap: 1, height: '100%', width: '45%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #99a1af', width: '100%', pb: 1 }}>
              <Typography variant='body2'>Current Spending</Typography>
              <Typography variant='body2' sx={{ color: '#ffffff' }}>${totalFare.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pt: 1 }}>
            <Typography variant='body2'>
              With {bestPass.pass.label}
            </Typography>
            <Typography variant='body2' sx={{ color: '#ffffff' }}>${bestPass.cost.toFixed(2)}</Typography>
            </Box>
            {passesExceptBest.map((passOption) => (
              <Box key={passOption.pass.id} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant='body2'>
                  With {passOption.pass.label}
                </Typography>
                <Typography variant='body2' sx={{ color: '#ffffff' }}>${passOption.cost.toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Section>
  );
}