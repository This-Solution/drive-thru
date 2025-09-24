import { PlusCircleOutlined } from '@ant-design/icons';
import { useTheme } from '@emotion/react';
import { EditTwoTone } from '@mui/icons-material';
import {
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import CjDialog from 'components/@extended/Dialog';
import CjReactTable from 'components/@extended/Table/ReactTable';
import { GlobalFilter } from 'components/@extended/Table/ReactTableFilter';
import FlavourButton from 'components/FlavourButton.js';
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { findIndex } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from 'service/ApiService';
import constants from 'utils/constants.js';
import dateHelper from 'utils/dateHelper.js';
import AddEditTenant from './addEditTenant';

const TenantList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const appName = process.env.REACT_APP_NAME;

  const [tenants, setTenants] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [siteHoursDialog, setSiteHoursDialog] = useState(false);
  const [siteDetails, setSiteDetails] = useState();
  const [enabled, setEnabled] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { flavour } = useSelector((state) => state.auth);

  useEffect(() => {
    getTenant();
  }, []);

  const getTenant = async () => {
    const { data } = await ApiService.getTenantsAsync();
    setTenants(data);
    setLoading(false);
  };

  // const filteredSites = useMemo(() => {
  //   let filteredSites;
  //   if (enabled) {
  //     filteredSites = tenants.filter((item) => item.isEnabled);
  //   } else {
  //     filteredSites = tenants.filter((item) => !item.isEnabled);
  //   }
  //   return filteredSites;
  // }, [tenants, enabled])

  const columns = useMemo(
    () => [
      {
        Header: 'Tenant Name',
        canSort: true,
        accessor: 'tenantName',
        Cell: ({ row }) => {
          const { original } = row;
          return (
            // <Link to={`/site/info/${original.siteId}`} style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle1'>{original.tenantName}</Typography>
            // </Link>
          );
        }
      },
      {
        Header: 'Url',
        canSort: true,
        accessor: 'url',
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <Link to={original.url} target='_blank' style={{ textDecoration: 'none' }}>
              <Typography variant='subtitle1'>{original.url}</Typography>
            </Link>
          );
        }
      },
      {
        Header: 'City',
        canSort: true,
        accessor: 'city'
      },
      {
        Header: 'State',
        canSort: true,
        accessor: 'state'
      },
      {
        accessor: 'updatedDate'
      },
      {
        Header: 'Created by',
        canSort: true,
        accessor: 'createByName',

        Cell: ({ row }) => {
          const { original } = row;
          return (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Stack spacing={0}>
                {/* eslint-disable-next-line */}
                <Typography variant="subtitle1">{original.createByName || '-'}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  { }
                  {original.createdDate ? dateHelper.getFormatDate(original.createdDate) : '-'}
                </Typography>
              </Stack>
            </Stack>
          )
        }
      },
      {
        Header: 'Last Updated by',
        canSort: true,
        accessor: 'updateByName',

        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Stack spacing={0}>
                {/* eslint-disable-next-line */}
                <Typography variant="subtitle1">{values.updateByName || '-'}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  { }
                  {values.updatedDate ? dateHelper.getFormatDate(values.updatedDate) : '-'}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      // {
      //   Header: 'Enabled',
      //   accessor: 'isEnabled',
      //   Cell: ({ row }) => {
      //     const { original } = row;
      //     return <Switch checked={original.isEnabled} onChange={(e) => handleSwitchChange(e, original)} />;
      //   }
      // },
      {
        Header: 'Actions',
        minWidth: 108,
        disableSortBy: true,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <>
              <Tooltip title='Edit'>
                <IconButton variant='contained' color='primary' onClick={() => handleEditClick(row.original)}>
                  <EditTwoTone />
                </IconButton>
              </Tooltip>
              {/* <Tooltip title='Site Hour'>
                <IconButton variant='contained' color='primary' onClick={() => handleSiteHours(row.original)}>
                  <AccessTimeOutlined />
                </IconButton>
              </Tooltip>
              {user.role === enums.userRole.SuperAdmin ? (
                <Tooltip title='Verify'>
                  <IconButton variant='contained' color='primary' onClick={() => handleVerifyDelivery(row.original)}>
                    <SettingOutlined />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title='KDS'>
                <IconButton variant='contained' color='primary' onClick={() => navigate('/kds-configure', { state: { siteId: original.siteId, siteName: original.siteName } })}>
                  <Monitor />
                </IconButton>
              </Tooltip > */}
            </>
          );
        }
      }
    ],
    [theme]
  );

  const handleSwitchChange = (event, row) => {
    setSiteDetails(row);
    setConfirmDialogOpen(true);
  };

  const onConfirmSwitchChange = async () => {
    await ApiService.setSiteEnabledStatusAsync(siteDetails.siteId, !siteDetails.isEnabled);
    setConfirmDialogOpen(false);
    const site = [...tenants];
    const siteIndex = findIndex(site, ['siteId', siteDetails.siteId]);
    site[siteIndex].isEnabled = !siteDetails.isEnabled;
    setTenants(site);
    setSiteDetails(null);
  };

  const handleEditClick = (row) => {
    setSiteDetails(row);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setSiteDetails(null);
    setEditDialogOpen(true);
  };

  const onSave = async (updateSite) => {
    const siteIndex = tenants.findIndex((item) => item.siteId === updateSite.siteId);
    const updatedSites = [...tenants];
    updateSite.updatedBy = user.name;
    updateSite.updatedDate = new Date();
    updatedSites[siteIndex] = updateSite;
    setTenants(updatedSites);
    setEditDialogOpen(false);
    getTenant();
  };

  const onCloseDialog = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid container rowSpacing={3} columnSpacing={3}>
          <Grid item xs={12} >
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Stack><Typography variant='h2'>Manage Tenant</Typography></Stack>
              <Stack direction={'row'} justifyContent={'end'}>
                <Button variant='contained' onClick={() => navigate(-1)}>Back</Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <MainCard content={false}>
              <ScrollX>
                <Stack spacing={3}>
                  <Stack
                    direction={matchDownMD ? 'column' : 'row'}
                    justifyContent='space-between'
                    alignItems='center'
                    spacing={1}
                    sx={{ py: 3, px: 3 }}
                  >
                    <Grid item xs={8}>
                      <Stack direction='row' alignItems='center' spacing={1}>
                        <Grid item xs={6}>
                          <GlobalFilter
                            preGlobalFilteredRows={tenants}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            size='large'
                            sx={{ width: '100%' }}
                          />
                        </Grid>
                        {/* <Grid item xs={2} pl={2}>
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox defaultChecked checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
                              label='Enabled'
                            />
                          </FormGroup>
                        </Grid> */}
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <Stack alignItems='center' justifyContent='center' spacing={2} direction={'row'}>
                        {appName === constants.appName && (
                          <FlavourButton
                            fullWidth
                            size='large'
                            variant='contained'
                            startIcon={<PlusCircleOutlined />}
                            onClick={handleAddClick}
                          >
                            Add Tenant
                          </FlavourButton>
                        )}
                        {/* <FlavourButton fullWidth size='large' variant="outlined" startIcon={<SettingOutlined />} onClick={() => navigate('/operating-hours')}>
                          Schedule
                        </FlavourButton> */}
                      </Stack>
                    </Grid>
                  </Stack>
                </Stack>
                {isConfirmDialogOpen ? (
                  <CjDialog
                    onCancel={onCloseDialog}
                    confirmHandle={onConfirmSwitchChange}
                    isDialogOpen={isConfirmDialogOpen}
                    title={`Change Status ${siteDetails.siteName}`}
                    Content={`${siteDetails.isEnabled ? 'Are you sure you want to disable' : 'Are you sure you want to enable'} ${siteDetails.siteName
                      }?`}
                  />
                ) : null}
                <CjReactTable
                  isLoading={isLoading}
                  columns={columns}
                  hiddenColumns={['city', 'state', 'updatedDate', 'markupPercent']}
                  data={tenants}
                  globalFilter={globalFilter}
                />
              </ScrollX>
            </MainCard>
          </Grid>
        </Grid>
      )}
      {isEditDialogOpen ? (
        <AddEditTenant isOpen={isEditDialogOpen} handleClose={() => setEditDialogOpen(false)} siteDetails={siteDetails} onSave={onSave} />
      ) : null}
    </>
  );
};

export default TenantList;
