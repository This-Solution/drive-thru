import { useEffect, useState } from 'react';
import { Stack, Button, Menu, MenuItem } from '@mui/material';
import CjDateRangePicker from './DateRangePicker.js';
import enums from 'utils/enums';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function StyledDurationFilter({ onDurationChange, minDate, maxDate, resetDuration, defaultDuration }) {
  const [durationAnchorEl, setDurationAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(defaultDuration);

  useEffect(() => {
    if (resetDuration) {
      setSelectedFilter(defaultDuration);
    } else {
      setSelectedFilter(selectedFilter);
    }
  }, [selectedFilter, resetDuration]);

  const handleDurationChange = (value) => {
    setSelectedFilter(value);
    if (value === enums.Duration.Between) {
      onDurationChange(value, null, null);
    } else {
      setSelectedFilter(value);
      onDurationChange(value);
    }
    setDurationAnchorEl(null);
  };

  const getDurationName = (durationValue) => {
    switch (durationValue) {
      case enums.Duration.Yesterday:
        return 'Yesterday';
      case enums.Duration.Today:
        return 'Today';
      case enums.Duration.Last7Days:
        return 'Last 7 Days';
      case enums.Duration.CurrentWeek:
        return 'Current Week';
      case enums.Duration.CurrentMonth:
        return 'Current Month';
      case enums.Duration.LastMonth:
        return 'Last Month';
      case enums.Duration.ThreeMonths:
        return 'Last 3 Months';
      case enums.Duration.SixMonths:
        return 'Last 6 Months';
      case enums.Duration.CurrentYear:
        return 'Current Year';
      case enums.Duration.LastYear:
        return 'Last Year';
      case enums.Duration.Between:
        return 'Custom Dates';
      default:
        return '';
    }
  };

  return (
    <>
      <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' } }} spacing={1}>
        <CjDateRangePicker
          showDateRangePicker={selectedFilter === enums.Duration.Between}
          minDate={minDate}
          maxDate={maxDate}
          onDateChanges={(start, end) => {
            if (selectedFilter === enums.Duration.Between) {
              onDurationChange(enums.Duration.Between, start, end);
            }
          }}
          resetDuration={resetDuration}
        />
        <Button
          aria-controls='duration-menu'
          color='primary'
          variant='contained'
          aria-haspopup='true'
          sx={{ whiteSpace: 'nowrap' }}
          onClick={(event) => setDurationAnchorEl(event.currentTarget)}
        >
          {getDurationName(selectedFilter)} <ArrowDropDownIcon />
        </Button>
      </Stack>
      <Menu
        id='duration-menu'
        anchorEl={durationAnchorEl}
        keepMounted
        open={Boolean(durationAnchorEl)}
        onClose={() => setDurationAnchorEl(null)}
      >
        {Object.values(enums.Duration).map((duration, index) => (
          <MenuItem key={index} onClick={() => handleDurationChange(duration)}>
            {getDurationName(duration)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
