// material-ui

import { Box } from '@mui/material';
import orderkeybg from 'assets/images/logos/drivethrubg.jpg';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  return (
    <Box position="absolute" overflow="hidden" height="100%" width="100%" zIndex={-1}>
      <Box
        component="img"
        src={orderkeybg}
        alt="Background"
        width="100%"
        sx={{ objectFit: 'contain' }}
      />
    </Box>
  );
};

export default AuthBackground;
