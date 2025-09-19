import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { filter } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// project import
import IconButton from '@mui/material/IconButton';
import CjReactTable from 'components/@extended/Table/ReactTable';
import { GlobalFilter } from 'components/@extended/Table/ReactTableFilter';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ApiService from 'service/ApiService';
import dateHelper from 'utils/dateHelper';
import AddUser from './addSystemUser';

// assets
import { Add, DeleteTwoTone, EditTwoTone, ForwardToInboxOutlined, LockTwoTone } from '@mui/icons-material';
import CjDialog from 'components/@extended/Dialog';
import { openSnackbar } from 'store/reducers/snackbar';
import ResetAdminPassword from './resetAdminPassword';

const SystemUserList = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  // const { flavour } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [isOpenConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  // const [selectedFlavour, setSelectedFlavour] = useState(flavour.flavourId || '');
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setLoading] = useState(true);
  // const flavours = useSelector((state) => state.lookup.flavours);
  const twoFactAuth = process.env.REACT_APP_TWO_FACT_AUTH;

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    const { data } = await ApiService.getUserListAsync();
    let filterUsers = data;
    // if (selectedFlavour) {
    //   filterUsers = filterUsers.filter((user) => user.flavourId === selectedFlavour);
    // }
    setUsers(filterUsers);
    setLoading(false);
  };

  const onAddEdit = (data) => {
    if (selectedUser.systemUserId) {
      // Edit Mode
      setUsers([data, ...filter(users, (user) => user.systemUserId !== data.systemUserId)]);
    } else {
      setUsers([data, ...users]);
    }
  };

  const sendAuthenticationMail = async (systemUserId) => {
    const { data } = await ApiService.sendAuthenticationMailAsync(systemUserId);
    if (data) {
      dispatch(
        openSnackbar({
          open: true,
          message: data ? 'Authentication mail sent successfully.' : '',
          variant: 'alert',
          alert: {
            color: data ? 'success' : 'error'
          },
          close: true
        })
      );
    }
  };

  const onAddAdmin = () => {
    setOpenAddUserDialog(true);
  };

  const onEditAdmin = (data) => {
    setSelectedUser(data);
    setOpenEditUserDialog(true);
  };

  const onSave = () => {
    getUserList();
  };

  const onCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const onCloseEditUserDialog = () => {
    setOpenEditUserDialog(false);
    setSelectedUser(null);
  };

  const onCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const onDeleteAdmin = async () => {
    if (selectedUser) {
      const { data } = await ApiService.deleteAdminAsync(selectedUser.systemUserId);
      if (data) {
        setUsers(filter(users, (user) => user.systemUserId !== selectedUser.systemUserId));
      }
      dispatch(
        openSnackbar({
          open: true,
          message: data ? 'User deleted successfully.' : '',
          variant: 'alert',
          alert: {
            color: data ? 'success' : 'error'
          },
          close: true
        })
      );
      setOpenConfirmDialog(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'systemUserId'
      },
      {
        Header: 'Customer',
        accessor: 'name',
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Stack spacing={0}>
                <Typography variant='subtitle1'>{values.name}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  {values.email}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Email Address',
        canSort: true,
        accessor: 'email'
      },
      {
        Header: 'Phone Number',
        accessor: 'phone'
      },
      {
        Header: 'Role',
        accessor: 'roleName'
      },
      // {
      //   Header: 'Flavour',
      //   accessor: 'flavourId',
      //   Cell: ({ value }) => {
      //     const flavour = flavours && flavours.flavours.find((flavour) => flavour.flavourId === value);
      //     return flavour ? flavour.flavourName : '-';
      //   }
      // },
      {
        Header: 'Last Updated by',
        accessor: 'updatedBy',
        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Stack spacing={0}>
                <Typography variant='subtitle1'>{values.updatedBy || '-'}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  {values.updatedDate ? dateHelper.getFormatDate(values.updatedDate) : '-'}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },

      {
        Header: 'Last Login On',
        accessor: 'lastLoginOn',
        Cell: ({ value }) => (value ? dateHelper.getFormatDate(value) : '-')
      },
      {
        Header: 'Actions',
        className: 'left',
        disableSortBy: true,
        canSort: false,
        Cell: ({ row }) => {
          const theme = useTheme();
          const { original } = row;
          return (
            <Stack direction='row' alignItems='left' spacing={0}>
              <Tooltip title='Edit'>
                <IconButton
                  color='primary'
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAdmin(original);
                  }}
                >
                  <EditTwoTone twoToneColor={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
              {twoFactAuth === 'true' ? (
                <Tooltip title='Resend authentication mail'>
                  <IconButton
                    color='primary'
                    onClick={(e) => {
                      e.stopPropagation();
                      sendAuthenticationMail(original.systemUserId);
                    }}
                  >
                    <ForwardToInboxOutlined twoToneColor={theme.palette.error.main} />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title='Reset Password'>
                <IconButton
                  color='primary'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(original);
                    setOpenResetPasswordDialog(true);
                  }}
                >
                  <LockTwoTone twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton
                  color='error'
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(original);
                    setOpenConfirmDialog(true);
                  }}
                >
                  <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],

    [theme]
  );

  return (
    <Grid container rowSpacing={3} columnSpacing={3}>
      <Grid item xs={12}>
        <MainCard content={false}>
          <ScrollX>
            <Grid
              container
              direction={matchDownSM ? 'column' : 'row'}
              justifyContent='space-between'
              alignItems='center'
              spacing={1}
              sx={{ py: 3, px: 3 }}
            >
              <Grid item xs={12} sm={6} md={4}>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <GlobalFilter
                    preGlobalFilteredRows={users}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    size='large'
                    sx={{ width: '100%' }}
                  />

                  {/* <FormControl fullWidth>
                    <Select
                      id='flavourId'
                      name='flavourId'
                      value={selectedFlavour || ''}
                      onChange={(e) => setSelectedFlavour(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select Flavour</em>
                      </MenuItem>
                      {flavours &&
                        flavours.flavours.map((flavour) => (
                          <MenuItem key={flavour.flavourId} value={flavour.flavourId}>
                            {flavour.flavourName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl> */}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Stack
                  direction={matchDownSM ? 'column' : 'row'}
                  justifyContent={matchDownSM ? 'flex-start' : 'flex-end'}
                  alignItems='center'
                  spacing={1}
                >
                  <Button variant='contained' size='medium' startIcon={<Add />} onClick={onAddAdmin}>
                    Add User
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <CjReactTable
              isLoading={isLoading}
              globalFilter={globalFilter}
              columns={columns}
              data={users}
              hiddenColumns={['systemUserId', 'email', 'updatedDate']}
            />
          </ScrollX>
          {openAddUserDialog && <AddUser onCancel={onCloseAddUserDialog} onAddEdit={onAddEdit} onSave={onSave} />}
          {openEditUserDialog && <AddUser user={selectedUser} onCancel={onCloseEditUserDialog} onAddEdit={onAddEdit} onSave={onSave} />}
          {openResetPasswordDialog && (
            <ResetAdminPassword systemUser={selectedUser} onCancel={() => setOpenResetPasswordDialog(false)} onSave={onSave} />
          )}
          {isOpenConfirmDialog && selectedUser ? (
            <CjDialog
              onCancel={onCloseDialog}
              confirmHandle={onDeleteAdmin}
              isDialogOpen={isOpenConfirmDialog}
              title={`Delete User`}
              Content={`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.surName}?`}
            ></CjDialog>
          ) : null}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default SystemUserList;
