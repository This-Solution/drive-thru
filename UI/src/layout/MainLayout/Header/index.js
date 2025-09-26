import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import orderKeyIcon from 'assets/images/logos/logo_dark.png';
import LogoSection from 'components/logo';
import { useSelector } from 'store';
import _ from 'lodash';


// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const { user } = useSelector((state) => state.auth);
  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  // common header
  const mainHeader = (
    // <Toolbar>
    <Stack
      direction='row'
      sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0, py: 1 }}
    >
      <LogoSection isIcon={matchDownMD} sx={{ width: open ? 'auto' : 35, height: 35 }} />
      <Typography variant='h5'>{user.siteName}</Typography>
      {headerContent}
    </Stack>
    // </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200
    }
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
