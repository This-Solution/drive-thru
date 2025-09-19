import PropTypes from 'prop-types';

// material-ui
import { Grid, Stack, Tooltip, Typography } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| REPORT CARD ||============================== //

const ReportCard = ({ primary, additionalText, secondary, iconPrimary, color }) => {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary style={{ fontSize: '40px' }} /> : null;

  return (
    <MainCard>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <Stack spacing={1}>
            <Stack spacing={1} direction={'row'}>
              <Typography variant='h4'>{primary}</Typography>
              <Stack alignItems={'flex-end'} justifyContent={'center'}>
                {additionalText ?
                  <Tooltip title='Total Transactions'>
                    <Typography variant='body1'>{`( ${additionalText} )`}</Typography>
                  </Tooltip> : null}
              </Stack>
            </Stack>
            <Typography variant='body1' color='secondary'>
              {secondary}
            </Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Typography variant='h2' style={{ color }}>
            {primaryIcon}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
};

ReportCard.propTypes = {
  primary: PropTypes.string,
  secondary: PropTypes.string,
  iconPrimary: PropTypes.object,
  color: PropTypes.string
};

export default ReportCard;
