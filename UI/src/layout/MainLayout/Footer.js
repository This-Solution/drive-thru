import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Stack, Typography } from '@mui/material';

const webAppVersion = process.env.REACT_APP_VERSION;

const Footer = () => (
  <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ p: '12px 16px 0px', mt: 'auto' }}>
    <Stack spacing={1} direction='row' justifyContent='space-between' alignItems='center'>
      <Typography variant='caption'>&copy; All rights reserved</Typography>
      <Typography variant='caption'>CMS {webAppVersion}</Typography>
    </Stack>
    <Stack spacing={1.5} direction='row' justifyContent='space-between' alignItems='center'>
      <Link component={RouterLink} to='#' target='_blank' variant='caption' color='textPrimary'>
        About us
      </Link>
      <Link component={RouterLink} to='#' target='_blank' variant='caption' color='textPrimary'>
        Privacy
      </Link>
      <Link component={RouterLink} to='#' target='_blank' variant='caption' color='textPrimary'>
        Terms
      </Link>
    </Stack>
  </Stack>
);

export default Footer;
