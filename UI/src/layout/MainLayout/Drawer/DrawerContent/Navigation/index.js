import { useSelector } from 'react-redux';

// material-ui
import { Box, Typography } from '@mui/material';

// project import
import { navigation } from 'pages/menu-items';
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const { user } = useSelector((state) => state.auth);
  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const navGroups = navigation.items.map((item) => {
    if (item.roleTags && item.roleTags.includes(user.role)) {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} roleTag={user.role} />;
        default:
          return (
            <Typography key={item.id} variant='h6' color='error' align='center'>
              Fix - Navigation Group
            </Typography>
          );
      }
    }
  });

  return <Box sx={{ pt: drawerOpen ? 2 : 0, '& > ul:first-of-type': { mt: 0 } }}>{navGroups}</Box>;
};

export default Navigation;
