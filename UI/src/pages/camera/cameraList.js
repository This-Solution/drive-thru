import { PlusCircleOutlined } from '@ant-design/icons';
import { useTheme } from '@emotion/react';
import { DeleteOutline, EditTwoTone } from '@mui/icons-material';
import {
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
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
import { useNavigate } from 'react-router-dom';
import ApiService from 'service/ApiService';
import constants from 'utils/constants.js';
import dateHelper from 'utils/dateHelper.js';
import AddEditCamera from './addEditCamera';

const CameraList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
  const appName = process.env.REACT_APP_NAME;

  const [cameraList, setCameraList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [cameraDetails, setCameraDetails] = useState();
  const [enabled, setEnabled] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getCameraList();
  }, []);

  const getCameraList = async () => {
    const { data } = await ApiService.getCameraListAsync();
    console.log(data);
    setCameraList(data);
    setLoading(false);
  };

  // const filteredSites = useMemo(() => {
  //   let filteredSites;
  //   if (enabled) {
  //     filteredSites = sites.filter((item) => item.isEnabled);
  //   } else {
  //     filteredSites = sites.filter((item) => !item.isEnabled);
  //   }
  //   return filteredSites;
  // }, [sites, enabled])

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
        },
      },
      {
        Header: 'Site Name',
        canSort: true,
        accessor: 'siteName',
        Cell: ({ row }) => {
          const { original } = row;
          return (
            // <Link to={`/site/info/${original.siteId}`} style={{ textDecoration: 'none' }}>
            <Typography variant='subtitle1'>{original.siteName}</Typography>
            // </Link>
          );
        },
      },
      {
        Header: 'camera Name',
        canSort: true,
        accessor: 'cameraName',
      },
      {
        Header: 'camera Type',
        canSort: true,
        accessor: 'cameraType',
      },
      {
        Header: 'Reload Time(s)',
        accessor: 'reloadTime',
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
                <Typography variant='subtitle1'>
                  {values.updateByName || '-'}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  {}
                  {values.updatedDate
                    ? dateHelper.getFormatDate(values.updatedDate)
                    : '-'}
                </Typography>
              </Stack>
            </Stack>
          );
        },
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
          return (
            <>
              <Tooltip title='Edit'>
                <IconButton
                  variant='contained'
                  color='primary'
                  onClick={() => handleEditClick(row.original)}
                >
                  <EditTwoTone />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton
                  variant='contained'
                  color='primary'
                  onClick={() => handleDeleteDialog(row.original)}
                >
                  <DeleteOutline />
                </IconButton>
              </Tooltip>
            </>
          );
        },
      },
    ],
    [theme]
  );

  const handleDeleteDialog = (row) => {
    setCameraDetails(row);
    setConfirmDialogOpen(true);
  };

  // const onConfirmSwitchChange = async () => {
  //   await ApiService.setSiteEnabledStatusAsync(
  //     cameraDetails.siteId,
  //     !cameraDetails.isEnabled
  //   );
  //   setConfirmDialogOpen(false);
  //   const site = [...cameraList];
  //   const siteIndex = findIndex(site, ['siteId', cameraDetails.siteId]);
  //   site[siteIndex].isEnabled = !cameraDetails.isEnabled;
  //   setCameraList(site);
  //   setCameraDetails(null);
  // };

  const handleEditClick = (row) => {
    setCameraDetails(row);
    setEditDialogOpen(true);
  };

  const handleAddClick = () => {
    setCameraDetails(null);
    setEditDialogOpen(true);
  };

  const onSave = async (updateSite) => {
    const siteIndex = cameraList.findIndex(
      (item) => item.siteId === updateSite.siteId
    );
    const updatedSites = [...cameraList];
    updateSite.updatedBy = user.name;
    updateSite.updatedDate = new Date();
    updatedSites[siteIndex] = updateSite;
    setSites(updatedSites);
    setEditDialogOpen(false);
    getSiteList();
  };

  const handleDelete = async () => {
    const { data } = await ApiService.deleteCameraAsync(cameraDetails.cameraId);
    if (data) {
      const updatedCamera = cameraDetails.filter(
        (cam) => cam.cameraId !== cameraDetails.cameraId
      );
      setCameraDetails(updatedCamera);
    }
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
          <Grid item xs={12}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Stack>
                <Typography variant='h2'>Manage Camera</Typography>
              </Stack>
              <Stack direction={'row'} justifyContent={'end'}>
                <Button variant='contained' onClick={() => navigate(-1)}>
                  Back
                </Button>
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
                            preGlobalFilteredRows={cameraList}
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
                      <Stack
                        alignItems='center'
                        justifyContent='center'
                        spacing={2}
                        direction={'row'}
                      >
                        {appName === constants.appName && (
                          <FlavourButton
                            fullWidth
                            size='large'
                            variant='contained'
                            startIcon={<PlusCircleOutlined />}
                            onClick={handleAddClick}
                          >
                            Add Camera
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
                    confirmHandle={handleDelete}
                    isDialogOpen={isConfirmDialogOpen}
                    title={`Delete ${cameraDetails.cameraName}`}
                    Content={`Are you sure you want to delete ${cameraDetails.cameraName}?`}
                  />
                ) : null}
                <CjReactTable
                  isLoading={isLoading}
                  columns={columns}
                  hiddenColumns={[
                    'city',
                    'state',
                    'updatedDate',
                    'markupPercent',
                  ]}
                  data={cameraList}
                  globalFilter={globalFilter}
                />
              </ScrollX>
            </MainCard>
          </Grid>
        </Grid>
      )}
      {isEditDialogOpen ? (
        <AddEditCamera
          isOpen={isEditDialogOpen}
          handleClose={() => setEditDialogOpen(false)}
          cameraDetails={cameraDetails}
          onSave={onSave}
        />
      ) : null}
    </>
  );
};

export default CameraList;
