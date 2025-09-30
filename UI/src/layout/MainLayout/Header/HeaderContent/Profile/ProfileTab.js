import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { EditOutlined, LockOutlined, LogoutOutlined, PartitionOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Apps } from '@mui/icons-material';
import AddUser from 'pages/admin/addSystemUser';
import ResetAdminPassword from 'pages/admin/resetAdminPassword';
import { useSelector } from 'react-redux';
import { dispatch } from 'store';
import { login } from 'store/reducers/auth';
import utils from 'utils/utils';
import { useNavigate } from 'react-router';
import enums from 'utils/enums';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { flavour } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // const currentUrl = window.location.origin;
  // const filteredApps = user.apps && user.apps.filter(app => app.appUrl !== currentUrl);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const onSave = (payload) => {
    const token = { session: payload.sessionToken, refresh: payload.refreshToken };
    dispatch(login({ user: payload.user, token }));
    setOpenResetPasswordDialog(false);
    setOpenEditProfileDialog(false);
  };

  const handleOrderKeyClick = () => {
    const switchUrl = utils.getSwitchUrl(flavour);
    const app2Window = window.open(switchUrl, '_blank');
    if (app2Window) {
      setTimeout(() => {
        const token = utils.getTokensFromStorage();
        if (token && token.refresh) {
          app2Window.postMessage({ refreshToken: token.refresh, flavour: flavour }, '*');
        }
      }, 1000);
    }
  };

  return (
    <List component='nav' sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* TODO */}
      {/* {filteredApps && filteredApps.map((app) => (
        <ListItemButton
          key={app.appUrl}
          selected={selectedIndex === app.appUrl}
          onClick={(e) => {
            setSelectedIndex(app.appUrl);
            handleOrderKeyClick(app.appUrl);
          }}
        >
          <ListItemIcon>
            <ClusterOutlined />
          </ListItemIcon>
          <ListItemText primary={app.appName} />
        </ListItemButton>
      ))} */}
      {/* <ListItemButton
        selected={selectedIndex === 1}
        onClick={(e) => {
          handleListItemClick(e, 1);
          e.stopPropagation();
          handleOrderKeyClick();
        }}
      >
        <ListItemIcon>
          <Apps />
        </ListItemIcon>
        <ListItemText primary='Switch To Orderkey HUB' />
      </ListItemButton> */}
      {/* {user && user.roleId === enums.userRole.SuperAdmin && ( */}
      {user && user.roleId === enums.userRole.SuperAdmin && <ListItemButton
        selected={selectedIndex === 1}
        onClick={(e) => {
          handleListItemClick(e, 1);
          e.stopPropagation();
          navigate('/admin/camera')
          // setOpenEditProfileDialog(true);
        }}
      >
        <ListItemIcon>
          <PartitionOutlined />
        </ListItemIcon>
        <ListItemText primary='Cameras' />
      </ListItemButton>}
      {/* {user && user.roleId === enums.userRole.SuperAdmin && <ListItemButton
        selected={selectedIndex === 2}
        onClick={(e) => {
          handleListItemClick(e, 2);
          e.stopPropagation();
          navigate('/admin/tenants')
        }}
      >
        <ListItemIcon>
          <PartitionOutlined />
        </ListItemIcon>
        <ListItemText primary='Tenants' />
      </ListItemButton>} */}
      {user && user.roleId === enums.userRole.SuperAdmin && <ListItemButton
        selected={selectedIndex === 3}
        onClick={(e) => {
          handleListItemClick(e, 3);
          e.stopPropagation();
          navigate('/admin/sites')
        }}
      >
        <ListItemIcon>
          <PartitionOutlined />
        </ListItemIcon>
        <ListItemText primary='Sites' />
      </ListItemButton>}
      {/* )} */}
      {user && user.roleId === enums.userRole.SuperAdmin && (
        <ListItemButton
          selected={selectedIndex === 4}
          onClick={(e) => {
            handleListItemClick(e, 4);
            e.stopPropagation();
            navigate('/admin/users')
            // setOpenEditProfileDialog(true);
          }}
        >
          <ListItemIcon>
            <UsergroupAddOutlined />
          </ListItemIcon>
          <ListItemText primary='Users' />
        </ListItemButton>
      )}
      {/* <ListItemButton
        selected={selectedIndex === 3}
        onClick={(e) => {
          handleListItemClick(e, 1);
          e.stopPropagation();
          setOpenEditProfileDialog(true);
        }}
      >
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary='Edit Profile' />
      </ListItemButton> */}
      {/* <ListItemButton
        selected={selectedIndex === 4}
        onClick={(e) => {
          handleListItemClick(e, 2);
          e.stopPropagation();
          setOpenResetPasswordDialog(true);
        }}
      >
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary='Reset Password' />
      </ListItemButton> */}

      <ListItemButton
        selected={selectedIndex === 5}
        onClick={(e) => {
          handleListItemClick(e, 5);
          e.stopPropagation();
          navigate('/admin/searchOrders')
          // setOpenEditProfileDialog(true);
        }}
      >
        <ListItemIcon>
          <PartitionOutlined />
        </ListItemIcon>
        <ListItemText primary='Search Orders' />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 6} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary='Logout' />
      </ListItemButton>
      {openResetPasswordDialog && (
        <ResetAdminPassword onCancel={() => setOpenResetPasswordDialog(false)} systemUser={user} onSave={onSave} />
      )}
      {openEditProfileDialog && <AddUser onCancel={() => setOpenEditProfileDialog(false)} user={user} onSave={onSave} page='editProfile' />}
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
