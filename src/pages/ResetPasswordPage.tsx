import { useState } from "react";
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, TextField, Box, InputAdornment, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (): Promise<void> => {
    setLoading(true);
    await supabase.auth.updateUser({ password: confirmPassword });
    alert("Your password has been successfully reset. You can now log in with your new password.");
    signOut();
    navigate('/');
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%', gap: 2 }}>
        <Typography variant='h1'>Concession Pass Calculator</Typography>
        <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, p: 4 }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Typography variant='h1'>Reset Your Password</Typography>
          </Box>

          <Typography variant="h3">Password</Typography>
          <TextField
            placeholder='********'
            fullWidth
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password && confirmPassword && (password === confirmPassword)) {
                handleResetPassword();
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
              if (e.key === 'Enter' && password && confirmPassword && (password === confirmPassword)) {
                handleResetPassword();
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
            onClick={handleResetPassword}
            sx={{ width: '100%' }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            disabled={!password || !confirmPassword || (password !== confirmPassword) || loading}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}