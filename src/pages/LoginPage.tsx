import { useState } from "react";
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, TextField, Box, InputAdornment } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const { session, loading, isRecoverySession } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  if (session && isRecoverySession) {
    navigate('/reset-password');
  }

  if (session && !isRecoverySession) {
    navigate('/upload');
  }

  // Show verification state
  if (loading) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>Confirming your sign in...</p>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth success (briefly before session loads)
  if (loading && session) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>✓ Authentication successful!</p>
        <p>Loading your account...</p>
      </div>
    );
  }

  // Show login form
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '45%' }, gap: 2 }}>
        <Typography variant='h2'>Sign In To Find Your Ideal Concession Pass</Typography>
        <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, p: 4 }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Typography variant='h1'>Sign In</Typography>
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

          <Typography variant="h3">Password</Typography>
          <TextField
            placeholder='********'
            fullWidth
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              console.log(e)
              if (e.key === 'Enter' && email && password) {
                handleSignIn();
              }
            }}
            slotProps={{
              input: {
                startAdornment:
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#b3bac2' }} />
                  </InputAdornment>,
                endAdornment:
                  <InputAdornment position="end">
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{ color: '#b3bac2', cursor: 'pointer' }}
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{ color: '#b3bac2', cursor: 'pointer' }}
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </InputAdornment>
              }
            }}
          />
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
            <Link to="/forget-password" style={{ color: '#14b7a5' }}>Forgot Password?</Link>
          </Box>
          <Button
            onClick={handleSignIn}
            sx={{ width: '100%' }}
            disabled={!email || !password}
          >
            Sign In
          </Button>
        </Paper>
        <Typography>Don't have an account? <Link to="/signup" style={{ color: '#14b7a5' }}>Sign Up</Link></Typography>
      </Box>
    </Box>
  );
}