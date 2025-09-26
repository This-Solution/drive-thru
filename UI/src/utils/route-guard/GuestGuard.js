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
  let defaultPath;
  useEffect(() => {
    if (user) {
      if (user.roleId === enums.userRole.SuperAdmin) {
        defaultPath = '/admin/sites';
      } else {
        defaultPath = config.defaultPath;
      }
      navigate(defaultPath, { replace: true });
    }
  }, [user, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;