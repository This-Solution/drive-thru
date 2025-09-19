// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { AutoAwesomeMotionOutlined, BurstModeOutlined, CategoryOutlined, DoDisturbOutlined, EditNoteOutlined, FastfoodOutlined, FoodBank, Filter, PriceChange } from '@mui/icons-material';
import enums from 'utils/enums';

// icons
const icons = {
  FoodBank,
  CategoryOutlined,
  BurstModeOutlined,
  DoDisturbOutlined,
  EditNoteOutlined,
  Filter,
  AutoAwesomeMotionOutlined,
  PriceChange,
  FastfoodOutlined,
};

// ==============================|| MENU ITEMS - MAIN ||============================== //
const menu = {
  id: 'order-trace',
  type: 'group',
  title: <FormattedMessage id='application' />,
  roleTags: [enums.userRole.CJAdmin, enums.userRole.SuperAdmin],
  children: [
    // {
    //   id: 'banners',
    //   title: <FormattedMessage id='banners' />,
    //   subTitle: 'Manage Banners',
    //   type: 'item',
    //   url: 'order-trace/banners',
    //   icon: icons.BurstModeOutlined,
    //   roleTags: [enums.userRole.CJAdmin, enums.userRole.SuperAdmin],
    //   isShowFilter: true,
    //   showTitle: true,
    // },
    {
      id: 'Screens',
      title: <FormattedMessage id='Screens' />,
      // subTitle: 'Manage Cars',
      type: 'item',
      url: 'order-trace/cars',
      icon: icons.AutoAwesomeMotionOutlined,
      roleTags: [enums.userRole.CJAdmin, enums.userRole.SuperAdmin],
      isShowFilter: true,
      showTitle: true,
    }
  ],
};

export default menu;
