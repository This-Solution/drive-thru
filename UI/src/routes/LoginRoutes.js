import { lazy } from 'react';

// project import
import GuestGuard from 'utils/route-guard/GuestGuard';
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthLoginSsoSaml = Loadable(lazy(() => import('pages/auth/login-sso-saml')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <GuestGuard>
          <CommonLayout />
        </GuestGuard>
      ),
      children: [
        {
          path: '/',
          element: <AuthLogin />
        },
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'login/sso-saml',
          element: <AuthLoginSsoSaml />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password/:token',
          element: <AuthResetPassword />
        }
      ]
    }
  ]
};

export default LoginRoutes;
