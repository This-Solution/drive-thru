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
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.roleId === enums.userRole.SuperAdmin) {
        navigate('/admin/sites', { replace: true });
      } else {
        navigate(config.defaultPath, { replace: true });
      }
    }
  }, [user, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
