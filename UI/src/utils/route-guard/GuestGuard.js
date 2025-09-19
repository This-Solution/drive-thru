import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project import
import config from 'config.js';
import { useSelector } from 'react-redux';
import enums from 'utils/enums';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { flavour } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === enums.userRole.SuperAdmin) {
        if (flavour) {
          navigate(config.defaultPath, { replace: true });
        }
      } else if (user.role === enums.userRole.EdmExport) {
        navigate('/maintenance/access-denied', { replace: true });
      } else {
        navigate(config.defaultPath, { replace: true });
      }
    }
  }, [user, flavour, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
