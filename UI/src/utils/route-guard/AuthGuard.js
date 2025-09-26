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

  // useEffect(() => {
  //   if (!user) {
  //     navigate(redirectUri, { replace: true });
  //   } else {
  //     const isSiteAdminOrManager = user.role === enums.userRole.User || user.role === enums.userRole.SiteManager;
  //     if (isSiteAdminOrManager && isAdminRoute(pathname)) {
  //       navigate('/maintenance/access-denied');
  //     }
  //   }
  // });

  useEffect(() => {
    if (!user) {
      navigate(redirectUri, { replace: true });
    } else {
      if (user.roleId === enums.userRole.SuperAdmin) {
        navigate('/admin/sites', { replace: true });
      } else if (user.roleId === enums.userRole.Admin) {
        navigate(redirectUri, { replace: true });
      }
      // else {
      //   console.log("auth called")
      //   navigate('/maintenance/access-denied');
      // }
    }
  }, [user, pathname, navigate, redirectUri]);

  if (!user) return <></>;

  // const isSuperAdminRoute = (path) => {
  //   const superAdminRoutes = ['/dashboard/reports'];
  //   return superAdminRoutes.includes(path);
  // };

  // const isAdminRoute = (path) => {
  //   if (user.role === enums.userRole.Admin || (user.role === enums.userRole.SiteManager && ['/admin/sites', '/site/info'].includes(path))) {
  //     return false;
  //   }
  //   const adminRoutes = [
  //     '/admin',
  //     '/admin/users',
  //     '/admin/rules',
  //     '/order-trace/cars',
  //     '/addEditRule/save',
  //     '/admin/notification',
  //     '/admin/sites',
  //     '/admin/devices',
  //     '/admin/employees',
  //     '/site/info',
  //     '/order-trace/price-setup',
  //   ];
  //   return adminRoutes.includes(path);
  // };

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
