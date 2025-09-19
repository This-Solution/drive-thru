// material-ui
import { Container, Link, Stack, Typography, useMediaQuery } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth='xl'>
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'center'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 1 : 3} textAlign={matchDownSM ? 'center' : 'inherit'}>
          <Typography variant='subtitle2' color='primary' component={Link} href='/terms' target='_blank' underline='hover'>
            Terms &amp; Conditions
          </Typography>
          <Typography variant='subtitle2' color='primary' component={Link} href='/privacy' target='_blank' underline='hover'>
            Privacy Policy
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
