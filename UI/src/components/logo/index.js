import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project import
import LogoMain from './LogoMain';
import LogoIcon from './LogoIcon';
import config from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ isIcon, sx, to }) => (
  <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
    {isIcon ? <LogoIcon /> : <LogoMain />}
  </ButtonBase>
);

LogoSection.propTypes = {
  isIcon: PropTypes.bool,
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
