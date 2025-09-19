import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticsDataCard = ({ color = 'primary', title, subTitle, count, percentage, isLoss, children, caption }) => (
  <MainCard content={false}>
    <Box sx={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant='h5' color='textSecondary'>
          {title}
        </Typography>
        <Stack sx={{ pt: 1 }} direction='row' alignItems='center'>
          <Typography variant='h4' color='inherit'>
            {count}
          </Typography>
          {percentage && (
            <Chip
              variant='combined'
              color={color}
              icon={
                <>
                  {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                  {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                </>
              }
              label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 1 }}
              size='small'
            />
          )}
          {subTitle && <Chip variant='combined' color={color} label={subTitle} sx={{ ml: 1.25, pl: 1 }} size='small' />}
          {caption && <Chip variant='combined' color={color} label={caption} sx={{ ml: 1.25, pl: 1 }} size='small' />}
        </Stack>
      </Stack>
    </Box>
    {children}
  </MainCard>
);

AnalyticsDataCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.any,
  percentage: PropTypes.any,
  isLoss: PropTypes.bool,
  color: PropTypes.string,
  children: PropTypes.node
};

export default AnalyticsDataCard;
