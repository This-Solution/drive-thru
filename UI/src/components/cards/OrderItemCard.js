import { Chip, Stack, Typography } from '@mui/material';

const OrderItemCard = ({ dish }) => {
  return (

    <Stack direction="row" justifyContent={'space-between'} alignItems={'center'} spacing={2}
      sx={{
        cursor: 'pointer',
        backgroundColor: '#fafafa',
        padding: 2,
        borderRadius: 2,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Stack>
        <Typography variant='body1'>{dish.name}</Typography>
        <Typography variant='body2'>${dish.price}</Typography>
      </Stack>
      <Stack>
        <Chip
          label={<Typography sx={{ fontSize: 10, lineHeight: 1 }}>{dish.quantity}</Typography>}
          sx={{
            backgroundColor: '#b4d8f0',
            borderRadius: '20px',
            height: 'auto',
            px: 1.5,
            py: 0.5
          }}
        />
      </Stack>
    </Stack>
  );
};

export default OrderItemCard;
