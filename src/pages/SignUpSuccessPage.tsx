import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

export default function SignUpSuccessPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mt: 2 }}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: { xs: 2, md: 4 }, px: {xs: 2, md: 8 }, width: {xs: '100%', md: '50%'}, gap: 3 }}>
        <Box sx={{ p: 2, borderRadius: 16, backgroundColor: '#00af43', boxShadow: 2 }}>
          <CheckCircleOutlineRoundedIcon sx={{ fontSize: 64, color: '#ffffff' }} />
        </Box>

        <Typography variant='h3' fontWeight='400'>Sign up Successful!</Typography>
        <Typography>We've sent a confirmation email to your email address.</Typography>
        <Typography>Please click the link in the email to verify your account before logging in.</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, mt: 2, backgroundColor: '#eef5fe', p: 2, borderRadius: 2, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <MailOutlinedIcon sx={{ fontSize: 24, color: 'primary.main', verticalAlign: 'middle', mr: 1 }} />
            <Typography variant='body1' color='primary.main'>Didn't receive the email?</Typography>
          </Box>
          <Typography variant='body1' textAlign='left'>Please check your spam or junk folder and wait up to 5 minutes for the email to be sent.</Typography>
        </Box>

        <Button fullWidth onClick={() => navigate('/')}>
          Back to Login
        </Button>

      </Paper>
    </Box>
  );
}