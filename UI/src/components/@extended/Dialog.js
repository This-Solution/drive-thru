import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material';

// project import
import { CloseOutlined } from '@ant-design/icons';
import LoadingButton from 'components/@extended/LoadingButton';

const CjDialog = ({ isDialogOpen, onCancel, title, Content, confirmHandle, color = 'error', isLoading }) => {
  const theme = useTheme();

  return (
    <Dialog open={isDialogOpen} maxWidth='xs' fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
        {isDialogOpen ? (
          <IconButton
            aria-label='close'
            onClick={onCancel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseOutlined twoToneColor={theme.palette.error.main} />
          </IconButton>
        ) : null}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        <Typography>{Content}</Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button variant='outlined' onClick={onCancel}>
          No
        </Button>
        <LoadingButton variant='contained' color={color} onClick={confirmHandle} autoFocus loading={isLoading}>
          Yes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

CjDialog.propTypes = {
  isDialogOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  Content: PropTypes.string
};

export default CjDialog;
