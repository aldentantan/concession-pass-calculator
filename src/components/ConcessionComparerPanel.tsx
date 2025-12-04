import { useState } from 'react';
import { Box, Grid, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { ConcessionPass } from '../types';

interface ConcessionComparerPanel {
    totalFare: number;
    fares: {
        totalFareExcludingBus: number;
        totalFareExcludingMrt: number;
    };
}

const ConcessionComparerPanel = ({ totalFare, fares }: ConcessionComparerPanel) => {
    const PASS_OPTIONS: ConcessionPass[] = [
        {
            id: 'no-pass',
            label: 'No Pass',
            monthlyPrice: 0,
            description: 'Your current fares without any concession pass.',
        },
        {
            id: 'undergrad-bus',
            label: 'Undergrad Bus',
            monthlyPrice: 55.50,
            description: 'Unlimited rides on bus for undergrad students.',
        },
        {
            id: 'undergrad-mrt',
            label: 'Undergrad MRT',
            monthlyPrice: 48,
            description: 'Unlimited rides on MRT for undergrad students.',
        },
        {
            id: 'undergrad-hybrid',
            label: 'Undergrad Hybrid',
            monthlyPrice: 81,
            description: 'Unlimited rides on bus/MRT for undergrad students.',
        },
    ];

    const { totalFareExcludingBus, totalFareExcludingMrt } = fares;
    const [selectedPassId, setSelectedPassId] = useState<string>('no-pass');

    const selectedPass = PASS_OPTIONS.find((p) => p.id === selectedPassId)!;
    const currentSpend = totalFare;

    const passCost =
        selectedPass.id === 'no-pass'
            ? currentSpend
            : selectedPass.id === 'undergrad-bus'
                ? totalFareExcludingBus + selectedPass.monthlyPrice
                : selectedPass.id === 'undergrad-mrt'
                    ? totalFareExcludingMrt + selectedPass.monthlyPrice
                    : selectedPass.monthlyPrice;
    const savings =
        selectedPass.id === 'no-pass' ? 0 : currentSpend - passCost;

    const isSavingMoney = savings > 0;

    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, bgcolor: '#E0F7FA' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#03045E', mb: 1 }}>
                    Concession Pass Impact
                </Typography>
                <Typography variant="body2" sx={{ color: '#03045E', mb: 2 }}>
                    See how different concession passes would change your fares for this period.
                </Typography>

                {/* Pass Selector */}
                <ToggleButtonGroup
                    value={selectedPassId}
                    exclusive
                    onChange={(_, value) => {
                        if (value !== null) setSelectedPassId(value);
                    }}
                    sx={{ mb: 2, flexWrap: 'wrap' }}
                >
                    {PASS_OPTIONS.map((pass) => (
                        <ToggleButton key={pass.id} value={pass.id} sx={{ textTransform: 'none' }}>
                            {pass.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {/* Impact Summary */}
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <Paper sx={{ p: 2, bgcolor: '#CAF0F8', height: '100%' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: '#03045E', mb: 0.5 }}
                            >
                                Current spend (no pass)
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0077B6' }}>
                                ${currentSpend.toFixed(2)}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={4}>
                        <Paper sx={{ p: 2, bgcolor: '#CAF0F8', height: '100%' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: '#03045E', mb: 0.5 }}
                            >
                                {selectedPass.label} Concession
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0077B6' }}>
                                ${passCost.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#03045E' }}>
                                {selectedPass.description}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={4}>
                        <Paper sx={{ p: 2, bgcolor: '#CAF0F8', height: '100%' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, color: '#03045E', mb: 0.5 }}
                            >
                                Estimated savings
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: isSavingMoney ? '#008000' : '#9E2A2B',
                                }}
                            >
                                {isSavingMoney ? `+$${savings.toFixed(2)}` : `$${savings.toFixed(2)}`}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#03045E' }}>
                                {selectedPass.id === 'no-pass'
                                    ? 'Select a pass above to see potential savings.'
                                    : isSavingMoney
                                        ? 'You would have saved this amount with this pass.'
                                        : 'This pass would not save you money for this period.'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ConcessionComparerPanel;