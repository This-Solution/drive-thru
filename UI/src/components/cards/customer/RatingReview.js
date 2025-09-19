import PropTypes from 'prop-types';
import { Grid, Rating, Stack, Typography, Avatar } from '@mui/material';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { MailOutlineOutlined, PhoneOutlined, Warning } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import dateHelper from 'utils/dateHelper';

// ==============================|| Feedback ||============================== //

const RatingReview = ({ feedback }) => {
  const { imagePath, avatar, name, rating, comments, orderId, createdDate, siteName, phone, email, isCallback } = feedback;
  const imagePaths = imagePath ? imagePath.split(',') : [];
  const getInitials = (name) =>
    name
      ? name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
      : '';
  return (
    <Grid item xs={12}>
      <Stack direction='row' spacing={1}>
        <Avatar color={Warning} alt={name} type='filled' size='sm' src={avatar ? avatar : ''}>
          {' '}
          {!avatar && getInitials(name)}
        </Avatar>
        <Stack spacing={2}>
          <Stack>
            <Stack direction={'row'} spacing={1}>
              <Typography variant='subtitle1' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {name}
              </Typography>
              {isCallback >= 1 && (
                <>
                  <Stack spacing={0.5} alignItems='left' direction={'row'}>
                    <MailOutlineOutlined color='secondary' fontSize='small' />
                    <Typography color='secondary'>{email}</Typography>
                  </Stack>
                  <Stack spacing={0.5} alignItems='left' direction={'row'}>
                    <PhoneOutlined color='secondary' fontSize='small' />
                    <Typography color='secondary'>{phone}</Typography>
                  </Stack>
                </>
              )}
            </Stack>
            <Typography variant='subtitle2'>{siteName}</Typography>
            <Typography variant='caption' color='textSecondary'>
              Reviewed on {dateHelper.getFormatDate(createdDate)}
            </Typography>
            {orderId ? (
              <Rating
                size='small'
                name='simple-controlled'
                value={rating}
                icon={<StarFilled style={{ fontSize: 'inherit' }} />}
                emptyIcon={<StarOutlined style={{ fontSize: 'inherit' }} />}
                precision={0.1}
                readOnly
              />
            ) : null}
          </Stack>
          <Typography variant='h6'>{comments}</Typography>
          {orderId ? (
            <Link to={`/detail/${orderId}`} target='_blank'>
              View Order
            </Link>
          ) : null}
          {imagePaths.length > 0 && (
            <Stack direction='row' spacing={2}>
              {imagePaths.map((image, index) => (
                <a key={index} href={image.trim()} target='_blank' rel='noopener noreferrer'>
                  <Avatar
                    color='secondary'
                    variant='square'
                    alt={name}
                    type='filled'
                    size='md'
                    sx={{ width: 70, height: 70 }}
                    src={image.trim()}
                  />
                </a>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Grid>
  );
};

RatingReview.propTypes = {
  avatar: PropTypes.string,
  date: PropTypes.string,
  name: PropTypes.string,
  rating: PropTypes.number,
  comments: PropTypes.string,
  imagePath: PropTypes.string
};

export default RatingReview;
