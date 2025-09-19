// material-ui
import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, FormHelperText, Grid, IconButton, List, ListItemText, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
// third-party
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// project imports
import { CloseOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Loader from 'components/Loader';
import _, { isEmpty, size } from 'lodash';
import ApiService from 'service/ApiService';
import enums from 'utils/enums';
import LoadingButton from 'components/@extended/LoadingButton';

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const ViewGrops = ({ siteId, dialogType, onCancel, rowData = {}, onUpdate }) => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [groups, setGroups] = useState([]);
  const [state, setState] = useState({
    screenName: '',
    screenType: dialogType,
    selectedGroupIds: [],
    columnsLimit: 4,
    printerIpAddress: ''
  });
  const [ipAddressError, setIpAddressError] = useState('');
  const  { flavour }  = useSelector((state)=> state.auth);
  
  
  useEffect(() => {
    let groupIds = [];
    if (!isEmpty(rowData)) {
      groupIds = rowData.groupIdList.split(',').map((groupId) => parseInt(groupId.trim(), 10));
      setState({
        screenName: rowData.screenName,
        selectedGroupIds: groupIds,
        screenType: rowData.screenType,
        columnsLimit: rowData.columnsLimit,
        printerIpAddress: rowData.printerIpAddress
      })
    } else {
      setState({
        screenName: '',
        screenType: dialogType,
        selectedGroupIds: [],
        columnsLimit: 4,
        printerIpAddress: ''
      });
    }
    getScreenGroups(groupIds);
  }, []);

  const getScreenGroups = async (groupIds) => {
    const { data } = await ApiService.getScreenGroupsAsync(flavour.flavourId);
    if (data && size(data) > 0) {  
      const groups = _.map(data, (group) => {
        group.isSelected = groupIds.includes(group.screenGroupId);
        return group;
      });
      setGroups(groups);
    }
    setLoading(false);
};

  const onPressCheckBox = (e, data) => {
    const updatedGroups = groups.map((groupData) => ({
      ...groupData,
      isSelected: groupData.screenGroupId === data.screenGroupId ? e.target.checked : groupData.isSelected,
    }));
    setGroups(updatedGroups);
    const groupIds = updatedGroups
      .filter((groupData) => groupData.isSelected)
      .map((groupData) => groupData.screenGroupId);
    setState({
      ...state,
      selectedGroupIds: groupIds
    })
  }

  const validateIPAddress = (ipAddress) => {
    const ipRegex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
    return ipRegex.test(ipAddress);
  };


  const onInputChange = (field, event) => {
    let value = event.target.value;

    if (field === 'printerIpAddress') {
      if (isEmpty(value)) {
        setIpAddressError('Please Enter IP Address.');
      }
      else if (!validateIPAddress(value)) {
        setIpAddressError('Invalid IP Address.');
      } else {
        setIpAddressError('');
      }
    }

    setState({
      ...state,
      [field]: value,
    });
  };


  const onColumnLimitChange = (event) => {
    setState({
      ...state,
      columnsLimit: parseInt(event.target.value, 10),
    });
  };

  const onAssign = async () => {
    setButtonLoader(true);
    const apiData = {
      siteId: siteId,
      screenName: state.screenName,
      groupIds: state.selectedGroupIds,
      screenType: state.screenType ? state.screenType : dialogType,
      columnsLimit: (state.screenType ? state.screenType : dialogType) === enums.screenType.prep ? state.columnsLimit : null,
      printerIpAddress: (state.screenType ? state.screenType : dialogType) === enums.screenType.printer ? state.printerIpAddress : null
    }
    if (!isEmpty(rowData)) {
      apiData.kitchenScreenId = rowData.kitchenScreenId;
      await ApiService.updateScreenGroupsAsync(apiData);
    } else {
      await ApiService.configureScreenGroupsAsync(apiData);
    }
    onUpdate();
    onCancel();
    setButtonLoader(false);
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Dialog maxWidth='xs' fullWidth onClose={onCancel} open={true}>
          <DialogContent sx={{ paddingTop: 0.5 }}>
            <Grid
              container
              justifyContent='space-between'
              alignItems='center'
              sx={{ mb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Grid item sx={{ py: 2 }}>
                <Typography variant='subtitle1' fontSize={'1rem'}>{state.screenType ? state.screenType : dialogType} Screen Detail</Typography>
              </Grid>
              <Grid item sx={{ mr: 1.5 }}>
                <IconButton color='secondary' onClick={onCancel}>
                  <CloseOutlined />
                </IconButton>
              </Grid>
            </Grid>
            <Stack spacing={1}>
              {
                dialogType === enums.screenType.pack ?
                  <>
                    <TextField
                      fullWidth
                      name='screenName'
                      id='screenName'
                      variant='outlined'
                      onChange={(e) => onInputChange('screenName', e)}
                      value={state.screenName}
                      inputProps={{ maxLength: 100 }}
                      placeholder='Screen name'
                    />
                  </>
                  :
                  size(groups) > 0 || enums.screenType.printer ?
                    <>
                      <TextField
                        name='screenName'
                        id='screenName'
                        value={state.screenName}
                        onChange={(e) => onInputChange('screenName', e)}
                        inputProps={{ maxLength: 100 }}
                        placeholder='Screen name'
                      />
                      <Grid xs={12}>
                        <Stack direction={'row'}>
                          <Grid xs={6} ml={1}>
                            <Typography variant="subtitle1" >Groups</Typography>
                            <List disablePadding >
                              {groups.map((data, index) => (
                                <Stack>
                                  <FormControlLabel
                                    key={index}
                                    control={
                                      <Checkbox
                                        size='large'
                                        checked={data.isSelected}
                                        onChange={(event) => onPressCheckBox(event, data)}
                                      />
                                    }
                                    label={data.screenGroupName}
                                  />
                                </Stack>
                              ))}
                            </List>
                          </Grid>
                          {dialogType === enums.screenType.prep && !_.isNull(rowData.columnsLimit) ? (
                            <Grid xs={6}>
                              <Typography variant="subtitle1">Column Limit</Typography>
                              <RadioGroup
                                row
                                name="columnLimit"
                                value={state.columnsLimit}
                                onChange={onColumnLimitChange}
                              >
                                {[2, 4, 6, 8].map((value) => (
                                  <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={<Radio />}
                                    label={`${value}`}
                                  />
                                ))}
                              </RadioGroup>
                            </Grid>
                          ) : (
                            <Grid xs={6}>
                              <Typography variant="subtitle1">IP Address</Typography>
                              <TextField
                                name="printerIpAddress"
                                id="printerIpAddress"
                                value={state.printerIpAddress}
                                onChange={(e) => onInputChange('printerIpAddress', e)}
                                inputProps={{ maxLength: 15 }}
                                placeholder="Enter IP Address"
                                error={!!ipAddressError}
                              />
                              <FormHelperText error={ipAddressError} sx={{ marginLeft: 0 }}>
                                {ipAddressError}
                              </FormHelperText>
                            </Grid>
                          )}
                        </Stack>
                      </Grid>
                    </>
                    :
                    <ListItemText
                      primary={'No groups available'}
                      sx={{}}
                      primaryTypographyProps={{
                        sx: { fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', padding: 4 }
                      }}
                    />
              }
            </Stack>
            <DialogActions>
              <Button disabled={buttonLoader} variant='outlined' color='error' onClick={onCancel}>
                Cancel
              </Button>
              <LoadingButton
                loading={buttonLoader}
                disabled={
                  (((state.screenType ? state.screenType : dialogType) === enums.screenType.prep) && _.size(state.selectedGroupIds) === 0) ||
                  (((state.screenType ? state.screenType : dialogType) === enums.screenType.printer) && (isEmpty(state.printerIpAddress) || ipAddressError !== '')) ||
                  ((state.screenType ? state.screenType : dialogType) !== enums.screenType.printer && isEmpty(state.screenName))
                }
                variant='contained'
                onClick={() => onAssign()}
                autoFocus
              >
                Assign
              </LoadingButton>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

ViewGrops.propTypes = {
  onCancel: PropTypes.func
};

export default ViewGrops;
