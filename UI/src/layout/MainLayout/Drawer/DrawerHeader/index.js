import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();

  return (
    <>
      <DrawerHeaderStyled theme={theme} open={open}>
        <Logo isIcon={!open} sx={{ width: open ? 'auto' : 35, height: 35 }} />
      </DrawerHeaderStyled>
      <Divider />
    </>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
