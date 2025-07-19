'use client';
import { CircularProgress, Box } from '@mui/material';

const AuthSpinner = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        zIndex: 99999,
      }}
    >
      <CircularProgress 
        size={60}
        thickness={4}
        sx={{
          color: '#1976d2',
        }}
      />
    </Box>
  );
};

export default AuthSpinner;
