// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  AccountTreeOutlined,
  ArticleOutlined,
  AutoAwesomeMotionOutlined,
  Groups2,
  NotificationsActiveOutlined,
  PersonOutline,
  PhonelinkSetupOutlined,
  SoupKitchenOutlined,
  SyncAltOutlined,
  TabletMacOutlined
} from '@mui/icons-material';
import enums from 'utils/enums';

// icons
const icons = {
  PersonOutline,
  AccountTreeOutlined,
  ArticleOutlined,
  SyncAltOutlined,
  PhonelinkSetupOutlined,
  NotificationsActiveOutlined,
  Groups2,
  TabletMacOutlined,
  SoupKitchenOutlined,
  AutoAwesomeMotionOutlined
};

// ==============================|| MENU ITEMS - MAIN ||============================== //
const admin = {
  id: 'admin',
  type: 'group',
  title: <FormattedMessage id='admin' />,
  roleTags: [enums.userRole.CJAdmin, enums.userRole.SuperAdmin, enums.userRole.User, enums.userRole.SiteManager],
  children: [
    {
      id: 'systemUserList',
      title: <FormattedMessage id='systemUserList' />,
      subTitle: 'Manage Users',
      type: 'item',
      url: 'admin/users',
      icon: icons.PersonOutline,
      roleTags: [enums.userRole.SuperAdmin, enums.userRole.CJAdmin],
      isShowFilter: true,
      showTitle: true,
    },
    {
      id: 'TenantList',
      title: <FormattedMessage id='TenantList' />,
      subTitle: 'Manage Tenant',
      type: 'item',
      url: 'admin/tenants',
      roleTags: [enums.userRole.SuperAdmin, enums.userRole.CJAdmin, enums.userRole.User, enums.userRole.SiteManager],
      icon: icons.AccountTreeOutlined,
      isShowFilter: true,
      showTitle: false,
    },
    {
      id: 'sitelist',
      title: <FormattedMessage id='sitelist' />,
      subTitle: 'Manage Sites',
      type: 'item',
      url: 'admin/sites',
      roleTags: [enums.userRole.SuperAdmin, enums.userRole.CJAdmin, enums.userRole.User, enums.userRole.SiteManager],
      icon: icons.AccountTreeOutlined,
      isShowFilter: true,
      showTitle: false,
    },
    {
      id: 'cameralist',
      title: <FormattedMessage id='cameralist' />,
      subTitle: 'Manage Cameras',
      type: 'item',
      url: 'admin/camera',
      roleTags: [enums.userRole.SuperAdmin, enums.userRole.CJAdmin, enums.userRole.User, enums.userRole.SiteManager],
      icon: icons.AccountTreeOutlined,
      isShowFilter: true,
      showTitle: false,
    },
    {
      id: 'searchOrderList',
      title: <FormattedMessage id='searchOrderList' />,
      subTitle: 'Manage Orders',
      type: 'item',
      url: 'admin/searchOrders',
      roleTags: [enums.userRole.SuperAdmin, enums.userRole.CJAdmin, enums.userRole.User, enums.userRole.SiteManager],
      icon: icons.AccountTreeOutlined,
      isShowFilter: true,
      showTitle: false,
    },
  ]
};

export default admin;
