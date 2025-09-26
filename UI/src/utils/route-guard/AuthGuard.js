import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import { useSelector } from 'react-redux';
import enums from 'utils/enums';
import config from 'config.js';


// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const { user, isUserLogout } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search, hash } = location;
  const encodedRedirectUrl = encodeURIComponent(`${pathname}${search}${hash}`);
  const redirectUri = isUserLogout ? 'login' : `login?redirect=${encodedRedirectUrl}`;

  useEffect(() => {
    if (!user) {
      navigate(redirectUri, { replace: true });
    }
  }, [user]);

  if (!user) return <></>;

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;