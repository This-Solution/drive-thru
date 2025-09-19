import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { Box, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import useConfig from 'hooks/useConfig';
import { navigation } from 'pages/menu-items';
import { openDrawer } from 'store/reducers/menu';
import Drawer from './Drawer';
import Footer from './Footer';
import Header from './Header';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

  const { miniDrawer } = useConfig();
  const dispatch = useDispatch();

  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  // drawer toggler
  const [open, setOpen] = useState(!miniDrawer || drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setOpen(!matchDownLG);
      dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    }
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      {/* <Drawer open={open} handleDrawerToggle={handleDrawerToggle} /> */}
      <Box component='main' sx={{ width: 'calc(100% - 260px)', flexGrow: 1, paddingX: { xs: 2, sm: 2 }, mt: 7.5 }}>
        {/* <Toolbar /> */}
        <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column' }}>
          <Breadcrumbs navigation={navigation} title card={false} divider={false} />
          <Outlet />
          {/* <Footer /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
