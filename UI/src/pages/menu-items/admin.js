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
      id: 'sitelist',
      title: <FormattedMessage id='sitelist' />,
      subTitle: 'Manage Sites',
      type: 'item',
      url: 'admin/sites',
      roleTags: [enums.userRole.SuperAdmin, enums.userRole.CJAdmin, enums.userRole.User, enums.userRole.SiteManager],
      icon: icons.AccountTreeOutlined,
      isShowFilter: true,
      showTitle: true,
    },
  ]
};

export default admin;
