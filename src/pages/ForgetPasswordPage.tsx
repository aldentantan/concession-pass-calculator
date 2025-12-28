import { useState } from "react";
import { supabase } from '../supabase';
import { Link } from 'react-router';
import { Paper, Typography, Button, TextField, Box, InputAdornment, CircularProgress } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async (): Promise<void> => {
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    alert('If an account with that email exists in our database, a password reset link will be sent to your email shortly.');
    setLoading(false)
  };

  // Show login form
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '45%' }, gap: 2 }}>
        <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, p: 4 }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Typography variant='h1'>Forget Password</Typography>
          </Box>
          <Typography variant="h3">Email Address</Typography>
          <TextField
            placeholder='johndoe@gmail.com'
            fullWidth
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            slotProps={{
              input: {
                startAdornment:
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#b3bac2' }} />
                  </InputAdornment>,
              }
            }}
          />

          <Button
            onClick={handleForgetPassword}
            sx={{ width: '100%' }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            disabled={!email || loading}
          >
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </Paper>
        <Typography>Already have an account? <Link to="/" style={{ color: '#14b7a5' }}>Sign In</Link></Typography>
      </Box>
    </Box>
  );
}