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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    })
    if (error) {
      alert(error.message);
    } else {
      alert("A confirmation email will be sent to you shortly, click on the link to complete your sign up.");
    }
  };

  // Show verification state
  if (loading) {
    return (
      <div>
        <h1>Authentication</h1>
        <p>Confirming your sign up...</p>
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

  // If user is logged in, return to log in page
  if (session) {
    navigate('/');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '45%' }, gap: 2 }}>
        <Typography variant='h2'>Sign Up To Find Your Ideal Concession Pass</Typography>
        <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, p: 4 }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Typography variant='h1'>Sign Up</Typography>
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
              if (e.key === 'Enter' && email && password && confirmPassword) {
                handleSignUp();
              }
            }}
            onCut={(e) => { e.preventDefault() }}
            onCopy={(e) => { e.preventDefault() }}
            onPaste={(e) => { e.preventDefault() }}
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

          <Typography variant="h3">Confirm Password</Typography>
          <TextField
            placeholder='********'
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && email && password && confirmPassword) {
                handleSignUp();
              }
            }}
            onCut={(e) => { e.preventDefault() }}
            onCopy={(e) => { e.preventDefault() }}
            onPaste={(e) => { e.preventDefault() }}
            slotProps={{
              input: {
                startAdornment:
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#b3bac2' }} />
                  </InputAdornment>,
                endAdornment:
                  <InputAdornment position="end">
                    {showConfirmPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{ color: '#b3bac2', cursor: 'pointer' }}
                        onClick={() => setShowConfirmPassword(false)}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{ color: '#b3bac2', cursor: 'pointer' }}
                        onClick={() => setShowConfirmPassword(true)}
                      />
                    )}
                  </InputAdornment>
              }
            }}
          />

          {confirmPassword !== "" && password !== confirmPassword && (
            <Typography variant="subtitle2" color="error">
              Passwords do not match.
            </Typography>
          )}

          <Button
            onClick={handleSignUp}
            sx={{ width: '100%' }}
            disabled={!email || !password || !confirmPassword || (password !== confirmPassword)}
          >
            Sign Up
          </Button>
        </Paper>
        <Typography>Already have an account? <Link to="/" style={{ color: '#14b7a5' }}>Sign In</Link></Typography>
      </Box>
    </Box>
  );
}