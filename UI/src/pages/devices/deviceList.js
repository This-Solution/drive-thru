import { useEffect, useMemo, useState } from 'react';
// material-ui
import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  useMediaQuery,
  Typography,
  Tooltip,
  Button,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Switch,
  ButtonGroup,
  MenuItem,
  Menu,
  ListItemIcon
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project import
import CjReactTable from 'components/@extended/Table/ReactTable';
import { GlobalFilter } from 'components/@extended/Table/ReactTableFilter';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import ApiService from 'service/ApiService';
import dateHelper from 'utils/dateHelper';
import EditPos from './editPos';
import enums from 'utils/enums';
import { ArrowDropDownOutlined } from '@mui/icons-material';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import CjDialog from 'components/@extended/Dialog';
import Dot from 'components/@extended/Dot';

const DeviceList = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [devices, setDevices] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [openEditPosDialog, setOpenEditPosDialog] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
  const [activeDevices, setActiveDevices] = useState(true);
  const [deviceType, setDeviceType] = useState(enums.orderSource.kiosk);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isEnableConfirmDialogOpen, setEnableConfirmDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    getDevices();
    getSiteList();
  }, [deviceType, activeDevices]);

  useEffect(() => {
    setSelectedDeviceIds([]);
    setSelectedIndex(null);
    setSelectedIndex(null);
  }, [deviceType]);

  const getDevices = async () => {
    setLoading(true);
    let devices;
    const { data } = await ApiService.getDevicesAsync(deviceType);
    devices = data;
    if (activeDevices) {
      devices = devices.filter((device) => device.isDeleted === false);
    } else {
      devices = devices.filter((device) => device.isDeleted === true);
    }
    setDevices(devices);
    setLoading(false);
  };

  const getSiteList = async () => {
    setLoading(true);
    const { data } = await ApiService.getSiteListAsync();
    setSites(data);
    setLoading(false);
  };

  const filteredDevices = useMemo(() => {
    if (!selectedSite) return devices;
    return devices.filter(device => device.siteId === selectedSite);
  }, [devices, selectedSite]);

  const getDeviceId = (device) => {
    return deviceType === enums.orderSource.pos ? device.posId : device.kioskId;
  };

  const handleSelectDevice = (id) => {
    setSelectedDeviceIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAllDevices = () => {
    if (selectedDeviceIds.length === filteredDevices.length) {
      setSelectedDeviceIds([]);
    } else {
      setSelectedDeviceIds(filteredDevices.map((device) => getDeviceId(device)));
    }
  };

  const columns = useMemo(() => {
    let dynamicColumns = [
      ...(activeDevices
        ? [
          {
            Header: () => (
              <Checkbox
                checked={selectedDeviceIds.length === filteredDevices.length && filteredDevices.length > 0}
                indeterminate={selectedDeviceIds.length > 0 && selectedDeviceIds.length < filteredDevices.length}
                onChange={handleSelectAllDevices}
              />
            ),
            accessor: 'select',
            disableSortBy: true,
            Cell: ({ row }) => (
              <Checkbox
                checked={selectedDeviceIds.includes(getDeviceId(row.original))}
                onChange={() => handleSelectDevice(getDeviceId(row.original))}
              />
            )
          }
        ]
        : []),
      {
        Header: 'Site',
        accessor: 'siteName'
      },
      {
        Header: 'Device No',
        accessor: deviceType === enums.orderSource.pos ? 'posNo' : 'kioskNo',
        Cell: ({ value }) => {
          return value;
        }
      },
      {
        Header: 'Version',
        accessor: 'version',
        Cell: ({ value }) => value || '-'
      },
      {
        Header: 'Pin Pad',
        accessor: 'posType',
        Cell: ({ row }) => {
          const { values } = row;
          const posType = values.posType === 'Physical' ? 'EFTPOS' : values.posType || '-';
          const mId = values.mId;
          const tId = values.tId;

          return (
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <Stack spacing={0}>
                {enums.PosScreenType.doubleDisplayClient !== values.screenType ? (
                  <>
                    <Typography variant='subtitle1'>{posType}</Typography>
                    <Typography variant='caption' color='textSecondary'>
                      MID : {mId}, TID : {tId}
                    </Typography>
                  </>
                ) : (
                  '-'
                )}
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Flavour',
        accessor: 'flavour',
        Cell: ({ value }) => value || '-'
      },
      {
        Header: 'Pos Id',
        accessor: 'posId'
      },
      {
        Header: 'Kiosk Id',
        accessor: 'kioskId'
      },
      {
        Header: 'Site Id',
        accessor: 'siteId'
      },
      {
        Header: 'Mid',
        accessor: 'mId'
      },
      {
        Header: 'Tid',
        accessor: 'tId'
      },
      {
        Header: 'Screen Type',
        accessor: 'screenType',
        Cell: ({ row }) => {
          const { values } = row;
          const screenTypeValue = values.screenType;

          let displayText = '';
          switch (screenTypeValue) {
            case 1:
              displayText = 'Single display';
              break;
            case 2:
              displayText = 'Double display client';
              break;
            case 3:
              displayText = 'Double display server';
              break;
            default:
              displayText = '-';
              break;
          }
          const currentPosId = row.original.posId;
          const matchedRow = filteredDevices.find((device) => device.serverPosId === currentPosId);
          return (
            <Stack direction={'row'}>
              {matchedRow ? (
                <Tooltip title='Connected'>
                  <ListItemIcon>
                    <Dot color='success' size={13} sx={{ mt: 0.5 }} />
                  </ListItemIcon>
                </Tooltip>
              ) : (
                <Typography sx={{ ml: 3 }}></Typography>
              )}
              <Typography>{displayText}</Typography>
            </Stack>
          );
        }
      },
      {
        Header: 'Updated Date',
        accessor: 'updatedDate',
        Cell: ({ value }) => dateHelper.getFormatDate(value)
      },
      {
        Header: 'Enabled',
        accessor: 'isDeleted',
        maxWidth: 40,
        disableSortBy: true,
        Cell: ({ row }) => (
          <>
            <Switch checked={!row.values.isDeleted} onChange={(e) => handleEnableChange(e, row.values)} />
          </>
        )
      }
    ];
    if (deviceType === enums.orderSource.kiosk) {
      dynamicColumns = dynamicColumns.filter((column) => column.Header !== 'Screen Type' && column.accessor !== 'connectedClientPos');
    }
    return dynamicColumns;
  }, [theme, selectedDeviceIds, deviceType, activeDevices, selectedSite]);

  const handleEnableChange = (e, device) => {
    setSelectedDevice(device);
    setEnableConfirmDialogOpen(true);
  };

  const onConfirmPopularChange = async () => {
    const deviceId = getDeviceId(selectedDevice);
    await ApiService.updateDeviceStatusAsync(deviceId, deviceType, !selectedDevice.isDeleted, selectedDevice.siteId);
    setEnableConfirmDialogOpen(false);
    const device = [...devices];
    const deviceIndex = device.findIndex((device) => {
      const id = getDeviceId(device);
      return id === deviceId;
    });
    device[deviceIndex].isDeleted = !selectedDevice.isDeleted;
    const updateDevices = device.filter((device) => {
      if (activeDevices) {
        return device.isDeleted === false;
      } else {
        return device.isDeleted === true;
      }
    });
    setDevices(updateDevices);
    showSnackbar(
      `Device No :  ${deviceType === enums.orderSource.pos ? selectedDevice.posNo : selectedDevice.kioskNo} 
      ${!selectedDevice.isDeleted ? 'disabled' : 'enabled'} successfully.`,
      'success'
    );
    setSelectedDevice(null);
  };

  const handleSocketPair = (row) => {
    if (activeDevices && row.original.screenType === enums.PosScreenType.doubleDisplayServer) {
      setSelectedDevice(row.original);
      setOpenEditPosDialog(true);
    }
  };

  const closeDialog = () => {
    setOpenEditPosDialog(false);
    setSelectedDevice(null);
  };

  const handleToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleSyncClick = (index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleSendNotification = async (typeIndex) => {
    if (selectedDeviceIds.length > 0) {
      const ids = selectedDeviceIds;
      const notificationType = typeIndex === 0 ? enums.KioskNotificationType.ScreenSaver : enums.KioskNotificationType.MenuScreen;
      const data = await ApiService.sendSyncNotificationAsync({ ids, notificationType, deviceType });
      setSelectedDeviceIds([]);
      setLoading(false);
      if (data) {
        showSnackbar('Notifications sent successfully.', 'success');
      }
    } else {
      showSnackbar(deviceType === enums.orderSource.pos ? 'Please select the POS first.' : 'Please select the Kiosk first.', 'error');
    }
  };

  const showSnackbar = (message, color) => {
    dispatch(
      openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: { color },
        close: true
      })
    );
  };

  const onSave = () => {
    setOpenEditPosDialog(false);
    getDevices();
  };

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
              <Grid item xs={12}>
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <GlobalFilter
                      preGlobalFilteredRows={filteredDevices}
                      globalFilter={globalFilter}
                      setGlobalFilter={setGlobalFilter}
                      size='large'
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <Autocomplete
                      id='site'
                      sx={{ width: '100%' }}
                      options={[{ siteId: null, siteName: 'All' }, ...sites]}
                      value={sites.find((site) => site.siteId === selectedSite)}
                      getOptionLabel={(site) => site.siteName}
                      onChange={(event, newValue) => setSelectedSite(newValue ? newValue.siteId : null)}
                      renderInput={(params) => <TextField {...params} placeholder='Site' />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4.5} md={4.5}>
                    <Stack direction={matchDownSM ? 'column' : 'row'} alignItems='center' spacing={1}>
                      <RadioGroup row value={deviceType} onChange={(event) => setDeviceType(event.target.value)}>
                        <FormControlLabel value='Kiosk' control={<Radio color='primary' />} label='Kiosk' />
                        <FormControlLabel value='POS' control={<Radio color='primary' />} label='POS' />
                      </RadioGroup>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack
                      direction={matchDownSM ? 'column' : 'row'}
                      justifyContent={matchDownSM ? 'flex-start' : 'flex-end'}
                      alignItems='center'
                      spacing={1}
                    >
                      <Grid item xs={2}>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox checked={activeDevices} onChange={(e) => setActiveDevices(e.target.checked)} />}
                            label='Enabled'
                          />
                        </FormGroup>
                      </Grid>
                      <ButtonGroup variant='contained'>
                        <Button
                          onClick={() => {
                            if (selectedIndex !== null) {
                              handleSendNotification(selectedIndex);
                            }
                          }}
                        >
                          {selectedIndex === null ? 'Sync' : enums.SyncButtons[selectedIndex]}
                        </Button>
                        <Button
                          size='large'
                          aria-controls={anchorEl ? 'split-button-menu' : null}
                          aria-expanded={anchorEl ? 'true' : null}
                          aria-label='select merge strategy'
                          aria-haspopup='menu'
                          onClick={handleToggle}
                        >
                          <ArrowDropDownOutlined />
                        </Button>
                      </ButtonGroup>
                    </Stack>
                    <Menu id='split-button-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                      {enums.SyncButtons.map((option, index) => (
                        <MenuItem key={option} selected={index === selectedIndex} onClick={() => handleSyncClick(index)}>
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
            <CjReactTable
              isLoading={isLoading}
              globalFilter={globalFilter}
              columns={columns}
              data={filteredDevices}
              hiddenColumns={['siteId', 'mId', 'tId', 'posId', 'kioskId']}
              onColumnClick={(row) => {
                handleSocketPair(row);
              }}
            />
          </ScrollX>
        </MainCard>
        {openEditPosDialog && <EditPos onCancel={closeDialog} pos={selectedDevice} onSave={onSave} />}
        {isEnableConfirmDialogOpen && selectedDevice ? (
          <CjDialog
            confirmHandle={onConfirmPopularChange}
            isDialogOpen={isEnableConfirmDialogOpen}
            onCancel={() => setEnableConfirmDialogOpen(false)}
            title={`Change Status Device No : ${selectedDevice.posNo ? selectedDevice.posNo : selectedDevice.kioskNo}`}
            Content={`${!selectedDevice.isDeleted ? 'Are you sure you want to disable' : 'Are you sure you want to enable'} ${selectedDevice.posNo ? selectedDevice.posNo : selectedDevice.kioskNo}?`}
          />
        ) : null}
      </Grid>
    </Grid>
  );
};

export default DeviceList;
