import { PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useTheme } from '@emotion/react';
import { AccessTimeOutlined, EditTwoTone, Monitor } from '@mui/icons-material';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Stack, Switch, Tooltip, Typography, useMediaQuery } from '@mui/material';
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
import enums from 'utils/enums.js';
import EditSite from './editSite.js';
import SiteHours from './siteHours.js';
import Verify from './verify.js';

const SiteList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const appName = process.env.REACT_APP_NAME;

  const [sites, setSites] = useState([]);
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
    getSiteList();
  }, []);

  const getSiteList = async () => {
    const { data } = await ApiService.getSitesAsync();
    setSites(data);
    setLoading(false);
  };

  const filteredSites = useMemo(() => {
    let filteredSites;
    if (enabled) {
      filteredSites = sites.filter((item) => item.isEnabled);
    } else {
      filteredSites = sites.filter((item) => !item.isEnabled);
    }
    return filteredSites;
  }, [sites, enabled])

  const columns = useMemo(
    () => [
      {
        Header: 'Site Name',
        canSort: true,
        accessor: 'siteName',
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <Link to={`/site/info/${original.siteId}`} style={{ textDecoration: 'none' }}>
              {original.siteName}
            </Link>
          );
        }
      },
      {
        Header: 'Address',
        accessor: 'addressLine1',

        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction='row' spacing={1.5}>
              <Stack spacing={0}>
                {/* eslint-disable-next-line */}
                <Typography variant="subtitle1">{values.addressLine1}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  { }
                  {values.city}, {values.state}
                </Typography>
              </Stack>
            </Stack>
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
        Header: 'Phone No.',
        canSort: true,
        accessor: 'voicePhone'
      },
      {
        Header: 'external Id',
        canSort: true,
        accessor: 'externalId'
      },
      {
        accessor: 'updatedDate'
      },
      {
        accessor: 'markupPercent'
      },
      {
        Header: 'Last Updated by',
        canSort: true,
        accessor: 'updatedBy',

        Cell: ({ row }) => {
          const { values } = row;
          return (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Stack spacing={0}>
                {/* eslint-disable-next-line */}
                <Typography variant="subtitle1">{values.updatedBy || '-'}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  { }
                  {values.updatedDate ? dateHelper.getFormatDate(values.updatedDate) : '-'}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Enabled',
        accessor: 'isEnabled',
        Cell: ({ row }) => {
          const { original } = row;
          return <Switch checked={original.isEnabled} onChange={(e) => handleSwitchChange(e, original)} />;
        }
      },
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
              <Tooltip title='Site Hour'>
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
              </Tooltip >
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
    const site = [...sites];
    const siteIndex = findIndex(site, ['siteId', siteDetails.siteId]);
    site[siteIndex].isEnabled = !siteDetails.isEnabled;
    setSites(site);
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

  const handleSiteHours = (row) => {
    setSiteDetails(row);
    setSiteHoursDialog(true);
  };

  const onSave = async (updateSite) => {
    const siteIndex = sites.findIndex((item) => item.siteId === updateSite.siteId);
    const updatedSites = [...sites];
    updateSite.updatedBy = user.name;
    updateSite.updatedDate = new Date();
    updatedSites[siteIndex] = updateSite;
    setSites(updatedSites);
    setEditDialogOpen(false);
    getSiteList();
  };

  const onCloseDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleVerifyDelivery = async (row) => {
    setSiteDetails(row);
    setVerifyDialogOpen(true);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid container rowSpacing={3} columnSpacing={3}>
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
                            preGlobalFilteredRows={sites}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            size='large'
                            sx={{ width: '100%' }}
                          />
                        </Grid>
                        <Grid item xs={2} pl={2}>
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox defaultChecked checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
                              label='Enabled'
                            />
                          </FormGroup>
                        </Grid>
                      </Stack>
                    </Grid>
                    <Grid item xs={3}>
                      <Stack alignItems='center' justifyContent='center' spacing={2} direction={'row'}>
                        {appName === constants.appName &&
                          <FlavourButton fullWidth size='large' variant="contained" startIcon={<PlusCircleOutlined />} onClick={handleAddClick}>
                            Add Site
                          </FlavourButton>}
                        <FlavourButton fullWidth size='large' variant="outlined" startIcon={<SettingOutlined />} onClick={() => navigate('/operating-hours')}>
                          Schedule
                        </FlavourButton>
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
                  data={filteredSites}
                  globalFilter={globalFilter}
                />
              </ScrollX>
            </MainCard>
          </Grid >
        </Grid >
      )}
      {
        siteHoursDialog ? (
          <SiteHours isOpen={siteHoursDialog} handleClose={() => setSiteHoursDialog(false)} siteDetails={siteDetails} />
        ) : null
      }
      {
        isEditDialogOpen ? (
          <EditSite isOpen={isEditDialogOpen} handleClose={() => setEditDialogOpen(false)} siteDetails={siteDetails} onSave={onSave} />
        ) : null
      }
      {
        isVerifyDialogOpen ? (
          <Verify isOpen={isVerifyDialogOpen} handleClose={() => setVerifyDialogOpen(false)} siteDetails={siteDetails} />
        ) : null
      }
    </>
  );
};

export default SiteList;
