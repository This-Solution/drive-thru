import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';
import MainLayout from 'layout/MainLayout';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const AccessDenied = Loadable(lazy(() => import('pages/maintenance/accessDenied.js')));

// render main pages
const SystemUserList = Loadable(lazy(() => import('pages/admin/systemUserList.js')));
const SiteList = Loadable(lazy(() => import('pages/site/siteList.js')));
const TenantList = Loadable(lazy(() => import('pages/tenant/tenantList.js')));
const CameraList = Loadable(lazy(() => import('pages/camera/cameraList.js')));
const SiteDetail = Loadable(lazy(() => import('pages/site/siteDetail.js')));
const OrderManage = Loadable(lazy(() => import('pages/Orders/orderManage.js')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'admin',
          children: [
            {
              path: 'users',
              element: <SystemUserList />
            },
            {
              path: 'sites',
              element: <SiteList />
            },
            {
              path: 'tenants',
              element: <TenantList />
            },
            {
              path: 'camera',
              element: <CameraList />
            }
          ]
        },
        {
          path: 'order-trace',
          children: [
            {
              path: 'cars',
              element: <OrderManage />
            }
          ]
        },
        {
          path: '/maintenance',
          element: <CommonLayout />,
          children: [
            {
              path: 'access-denied',
              element: <AccessDenied />
            },
            {
              path: '404',
              element: <MaintenanceError />
            },
            {
              path: '500',
              element: <MaintenanceError500 />
            },
            {
              path: 'under-construction',
              element: <MaintenanceUnderConstruction />
            }
          ]
        },
        {
          path: 'site/info/:siteId',
          element: <SiteDetail />
        },
      ]
    }
  ]
};

export default MainRoutes;
